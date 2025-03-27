import type { Calendar as ExpoCalendar, Event as ExpoEvent } from 'expo-calendar';
import type { Database } from './database';

export type CalendarEvent = ExpoEvent;
export type Calendar = ExpoCalendar;
export type SupabaseCalendar = Database['public']['Tables']['calendars']['Row'];
export type SupabaseEvent = Database['public']['Tables']['events']['Row'];

export interface CalendarState {
  // Calendar Selection
  selectedDate: Date;
  selectedCalendars: Calendar[];
  
  // Calendar Data
  calendars: Calendar[];
  events: CalendarEvent[];
  
  // UI State
  isLoading: boolean;
  error: string | null;
  syncInProgress: boolean;
}

export interface CalendarStore extends CalendarState {
  // Calendar Actions
  setSelectedDate: (date: Date) => void;
  toggleCalendarSelection: (calendar: Calendar) => void;
  selectAllCalendars: () => void;
  deselectAllCalendars: () => void;
  
  // Data Operations
  loadCalendars: () => Promise<void>;
  syncLocalCalendars: () => Promise<void>;
  
  // Event Management
  addEvent: (event: Partial<CalendarEvent>) => Promise<void>;
  updateEvent: (eventId: string, updates: Partial<CalendarEvent>) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  
  // Error Handling
  setError: (error: string | null) => void;
  clearError: () => void;
}