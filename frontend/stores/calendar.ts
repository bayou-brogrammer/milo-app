import { create } from 'zustand';
import * as ExpoCalendar from 'expo-calendar';
import { Platform } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from './auth';
import type { CalendarState, CalendarStore, Calendar, CalendarEvent } from '@/types/calendar';

const INITIAL_STATE: CalendarState = {
  selectedDate: new Date(),
  selectedCalendars: [],
  calendars: [],
  events: [],
  isLoading: false,
  error: null,
  syncInProgress: false,
};

export const useCalendarStore = create<CalendarStore>((set, get) => ({
  ...INITIAL_STATE,

  // Calendar Selection Actions
  setSelectedDate: (date: Date) => {
    set({ selectedDate: date });
  },

  toggleCalendarSelection: (calendar: Calendar) => {
    const { selectedCalendars } = get();
    const isSelected = selectedCalendars.some(cal => cal.id === calendar.id);

    set({
      selectedCalendars: isSelected
        ? selectedCalendars.filter(cal => cal.id !== calendar.id)
        : [...selectedCalendars, calendar]
    });
  },

  selectAllCalendars: () => {
    set(state => ({
      selectedCalendars: state.calendars
    }));
  },

  deselectAllCalendars: () => {
    set({ selectedCalendars: [] });
  },

  // Data Loading and Syncing
  loadCalendars: async () => {
    const { isAuthenticated, user } = useAuthStore.getState();
    if (!isAuthenticated || !user) {
      set({ error: 'Authentication required' });
      return;
    }

    try {
      set({ isLoading: true, error: null });

      if (Platform.OS === 'web') {
        const { data: supabaseCalendars, error: calendarError } = await supabase
          .from('calendars')
          .select('*')
          .eq('user_id', user.id);

        if (calendarError) throw calendarError;

        const mappedCalendars = supabaseCalendars.map(cal => ({
          id: cal.id,
          title: cal.title,
          color: cal.color,
          source: { name: cal.source, type: 'system' },
          isPrimary: false,
          allowsModifications: true,
        }));

        set({
          calendars: mappedCalendars,
          selectedCalendars: mappedCalendars.length > 0 ? [mappedCalendars[0]] : []
        });
        return;
      }

      const { status } = await ExpoCalendar.requestCalendarPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Calendar permission not granted');
      }

      const [defaultCalendar, deviceCalendars] = await Promise.all([
        ExpoCalendar.getDefaultCalendarAsync(),
        ExpoCalendar.getCalendarsAsync(ExpoCalendar.EntityTypes.EVENT)
      ]);

      // Sync calendars with Supabase
      await Promise.all(deviceCalendars.map(calendar =>
        syncCalendarToSupabase(calendar, user.id)
      ));

      set({ calendars: deviceCalendars });

      // Set initial calendar selection
      if (deviceCalendars.length > 0) {
        const initialSelectedCalendars = new Set<Calendar>();

        if (defaultCalendar) {
          initialSelectedCalendars.add(defaultCalendar);
        }

        const primaryCalendar = deviceCalendars.find(cal => cal.isPrimary);
        if (primaryCalendar && (!defaultCalendar || primaryCalendar.id !== defaultCalendar.id)) {
          initialSelectedCalendars.add(primaryCalendar);
        }

        if (initialSelectedCalendars.size === 0) {
          initialSelectedCalendars.add(deviceCalendars[0]);
        }

        set({ selectedCalendars: Array.from(initialSelectedCalendars) });
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load calendars' });
      console.error('Calendar loading error:', err);
    } finally {
      set({ isLoading: false });
    }
  },

  syncLocalCalendars: async () => {
    const { isAuthenticated, user } = useAuthStore.getState();
    const { selectedCalendars, syncInProgress } = get();

    if (!isAuthenticated || !user) {
      set({ error: 'Authentication required' });
      return;
    }

    if (selectedCalendars.length === 0) {
      set({ error: 'No calendars selected' });
      return;
    }

    if (syncInProgress) return;

    try {
      set({ syncInProgress: true, isLoading: true, error: null });

      if (Platform.OS === 'web') {
        const { data: events, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .in('calendar_id', selectedCalendars.map(cal => cal.id))
          .eq('user_id', user.id);

        if (eventsError) throw eventsError;

        const mappedEvents = events.map(event => ({
          id: event.id,
          title: event.title,
          notes: event.description,
          startDate: new Date(event.start_date),
          endDate: new Date(event.end_date),
          location: event.location,
          calendarId: event.calendar_id,
        }));

        set({ events: mappedEvents });
        return;
      }

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);

      const calendarEvents = await Promise.all(
        selectedCalendars.map(async calendar => {
          // Get the start date of the current month
          const startDate = new Date();
          startDate.setDate(1);
          const endDate = new Date();
          endDate.setDate(endDate.getDate() + 30);
          const events = await ExpoCalendar.getEventsAsync(
            [calendar.id],
            startDate,
            endDate
          );

          console.log(events)

          // Sync each event with Supabase
          await Promise.all(events.map(event =>
            syncEventToSupabase(event, calendar.id, user.id)
          ));

          return events;
        })
      );

      const allEvents = calendarEvents
        .flat()
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

      set({ events: allEvents });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to sync calendars' });
      console.error('Calendar sync error:', err);
    } finally {
      set({ isLoading: false, syncInProgress: false });
    }
  },

  // Event Management
  addEvent: async (eventData: Partial<CalendarEvent>) => {
    const { isAuthenticated, user } = useAuthStore.getState();
    if (!isAuthenticated || !user) {
      set({ error: 'Authentication required' });
      return;
    }

    try {
      set({ isLoading: true, error: null });

      if (Platform.OS === 'web') {
        const { data, error } = await supabase
          .from('events')
          .insert({
            title: eventData.title,
            description: eventData.notes,
            start_date: eventData.startDate,
            end_date: eventData.endDate,
            location: eventData.location,
            calendar_id: eventData.calendarId,
            user_id: user.id,
          })
          .select()
          .single();

        if (error) throw error;

        set(state => ({
          events: [...state.events, {
            ...eventData,
            id: data.id,
          } as CalendarEvent]
        }));
      } else {
        const eventId = await ExpoCalendar.createEventAsync(
          eventData.calendarId!,
          eventData as ExpoCalendar.Event
        );

        const newEvent = { ...eventData, id: eventId } as CalendarEvent;
        await syncEventToSupabase(newEvent, eventData.calendarId!, user.id);

        set(state => ({
          events: [...state.events, newEvent]
        }));
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to add event' });
      console.error('Event creation error:', err);
    } finally {
      set({ isLoading: false });
    }
  },

  updateEvent: async (eventId: string, updates: Partial<CalendarEvent>) => {
    const { isAuthenticated, user } = useAuthStore.getState();
    if (!isAuthenticated || !user) {
      set({ error: 'Authentication required' });
      return;
    }

    try {
      set({ isLoading: true, error: null });

      if (Platform.OS === 'web') {
        const { error } = await supabase
          .from('events')
          .update({
            title: updates.title,
            description: updates.notes,
            start_date: updates.startDate,
            end_date: updates.endDate,
            location: updates.location,
          })
          .eq('id', eventId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        await ExpoCalendar.updateEventAsync(
          updates.calendarId!,
          eventId,
          updates as ExpoCalendar.Event
        );
      }

      set(state => ({
        events: state.events.map(event =>
          event.id === eventId ? { ...event, ...updates } : event
        )
      }));
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to update event' });
      console.error('Event update error:', err);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteEvent: async (eventId: string) => {
    const { isAuthenticated, user } = useAuthStore.getState();
    if (!isAuthenticated || !user) {
      set({ error: 'Authentication required' });
      return;
    }

    try {
      set({ isLoading: true, error: null });

      const event = get().events.find(e => e.id === eventId);
      if (!event) throw new Error('Event not found');

      if (Platform.OS === 'web') {
        const { error } = await supabase
          .from('events')
          .delete()
          .eq('id', eventId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        await ExpoCalendar.deleteEventAsync(event.calendarId, eventId);
      }

      set(state => ({
        events: state.events.filter(event => event.id !== eventId)
      }));
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to delete event' });
      console.error('Event deletion error:', err);
    } finally {
      set({ isLoading: false });
    }
  },

  // Error Handling
  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null }),
}));

// Helper Functions
async function syncCalendarToSupabase(calendar: Calendar, userId: string) {
  try {
    const { data: existingCalendar, error: calendarError } = await supabase
      .from('calendars')
      .select()
      .eq('id', calendar.id)
      .single();

    if (calendarError && calendarError.code !== 'PGRST116') {
      throw calendarError;
    }

    if (!existingCalendar) {
      const { error: insertError } = await supabase
        .from('calendars')
        .insert({
          id: calendar.id,
          title: calendar.title || 'Untitled Calendar',
          color: calendar.color || '#000000',
          source: calendar.source.name || 'system',
          user_id: userId,
        });

      if (insertError) throw insertError;
    }
  } catch (err) {
    console.error('Error syncing calendar:', err);
    throw err;
  }
}

async function syncEventToSupabase(event: CalendarEvent, calendarId: string, userId: string) {
  try {
    const { data: existingEvent, error: eventError } = await supabase
      .from('events')
      .select()
      .eq('id', event.id)
      .single();

    if (eventError && eventError.code !== 'PGRST116') {
      throw eventError;
    }

    const eventData = {
      id: event.id,
      title: event.title,
      description: event.notes || null,
      start_date: event.startDate,
      end_date: event.endDate,
      location: event.location || null,
      calendar_id: calendarId,
      user_id: userId,
    };

    if (!existingEvent) {
      const { error: insertError } = await supabase
        .from('events')
        .insert(eventData);

      if (insertError) throw insertError;
    } else {
      const { error: updateError } = await supabase
        .from('events')
        .update(eventData)
        .eq('id', event.id);

      if (updateError) throw updateError;
    }
  } catch (err) {
    console.error('Error syncing event:', err);
    throw err;
  }
}
