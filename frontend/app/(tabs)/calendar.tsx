import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar as CalendarIcon, Plus, Settings } from 'lucide-react-native';
import {
  format,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  isToday,
  parseISO,
  isSameDay,
  startOfWeek,
  endOfWeek,
  addDays,
} from 'date-fns';
import { useState, useEffect } from 'react';
import { CalendarSelector } from '@/components/calendar/CalendarSelector';
import { useCalendarStore } from '@/stores/calendar';

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const [showCalendarSelector, setShowCalendarSelector] = useState(false);

  const {
    events,
    isLoading,
    error,
    selectedCalendars,
    selectedDate,
    setSelectedDate,
    loadCalendars,
    syncLocalCalendars,
  } = useCalendarStore();

  // Initial load
  useEffect(() => {
    loadCalendars();
    syncLocalCalendars();
  }, []);

  // Generate calendar weeks for the current month
  const currentMonth = startOfMonth(selectedDate);
  const monthStart = startOfWeek(currentMonth);
  const monthEnd = endOfWeek(endOfMonth(currentMonth));

  // Create array of weeks
  const weeks: Date[][] = [];
  let currentDate = monthStart;

  while (currentDate <= monthEnd) {
    const week = Array(7)
      .fill(null)
      .map((_, i) => addDays(currentDate, i));
    weeks.push(week);
    currentDate = addDays(currentDate, 7);
  }

  // Filter events for the selected date
  const selectedDateEvents = events.filter((event) =>
    isSameDay(parseISO(event.startDate.toString()), selectedDate)
  );

  const getEventColors = (date: Date) => {
    const dayEvents = events.filter((event) =>
      isSameDay(parseISO(event.startDate.toString()), date)
    );

    // Get unique calendar colors for the day's events
    const uniqueColors = Array.from(
      new Set(
        dayEvents
          .map((event) => {
            const calendar = selectedCalendars.find(
              (cal) => cal.id === event.calendarId
            );
            return calendar?.color;
          })
          .filter(Boolean)
      )
    );

    // Return up to 3 unique colors
    return uniqueColors.slice(0, 3);
  };

  const renderCalendarDay = (date: Date) => {
    const isSelected = isSameDay(date, selectedDate);
    const isCurrentMonth = isSameMonth(date, currentMonth);
    const isTodayDate = isToday(date);
    const eventColors = getEventColors(date);

    return (
      <TouchableOpacity
        key={date.toString()}
        style={[
          styles.calendarDay,
          isSelected && styles.selectedDay,
          !isCurrentMonth && styles.otherMonthDay,
          isTodayDate && styles.today,
        ]}
        onPress={() => setSelectedDate(date)}
      >
        <Text
          style={[
            styles.dayText,
            isSelected && styles.selectedDayText,
            !isCurrentMonth && styles.otherMonthDayText,
            isTodayDate && !isSelected && styles.todayText,
          ]}
        >
          {format(date, 'd')}
        </Text>
        {eventColors.length > 0 && (
          <View style={styles.eventDotsContainer}>
            {eventColors.map((color, index) => (
              <View
                key={`${date}-${color}-${index}`}
                style={[styles.eventDot, { backgroundColor: color }]}
              />
            ))}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // Initial calendar load when authenticated
  useEffect(() => {
    loadCalendars();
  }, []);

  // Auto-sync when selected calendars change
  useEffect(() => {
    if (selectedCalendars.length <= 0) return;
    syncLocalCalendars();
  }, [selectedCalendars]);

  // Set up periodic sync (every 5 minutes)
  useEffect(() => {
    if (selectedCalendars.length <= 0) return;

    const syncInterval = setInterval(() => {
      if (selectedCalendars.length > 0) {
        syncLocalCalendars();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(syncInterval);
  }, [selectedCalendars]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Calendar</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => setShowCalendarSelector(true)}
            >
              <Settings size={20} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.subtitle}>{format(selectedDate, 'MMMM yyyy')}</Text>
        <View style={styles.selectedCalendars}>
          {selectedCalendars.map((calendar) => (
            <View key={calendar.id} style={styles.calendarChip}>
              <View
                style={[
                  styles.calendarDot,
                  { backgroundColor: calendar.color },
                ]}
              />
              <Text style={styles.calendarName}>{calendar.title}</Text>
            </View>
          ))}
        </View>
      </View>

      <ScrollView>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.calendarGrid}>
          <View style={styles.weekDays}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <Text key={day} style={styles.weekDayText}>
                {day}
              </Text>
            ))}
          </View>
          <View style={styles.weeksContainer}>
            {weeks.map((week, weekIndex) => (
              <View key={weekIndex} style={styles.weekRow}>
                {week.map((date) => renderCalendarDay(date))}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.eventsList}>
          <View style={styles.eventsHeader}>
            <Text style={styles.sectionTitle}>
              Events for {format(selectedDate, 'MMMM d, yyyy')}
            </Text>
            <TouchableOpacity style={styles.addButton}>
              <Plus size={20} color="#007AFF" />
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading events...</Text>
            </View>
          ) : selectedDateEvents.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No events for this day</Text>
            </View>
          ) : (
            selectedDateEvents.map((event) => {
              const calendar = selectedCalendars.find(
                (cal) => cal.id === event.calendarId
              );
              return (
                <View
                  key={event.id}
                  style={[
                    styles.eventCard,
                    { borderLeftColor: calendar?.color, borderLeftWidth: 4 },
                  ]}
                >
                  <View style={styles.eventTime}>
                    <Text style={styles.timeText}>
                      {format(new Date(event.startDate), 'h:mm')}
                    </Text>
                    <Text style={styles.ampmText}>
                      {format(new Date(event.startDate), 'a')}
                    </Text>
                  </View>
                  <View style={styles.eventDetails}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <Text style={styles.eventLocation}>
                      {event.location || 'No location'}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      <CalendarSelector
        visible={showCalendarSelector}
        onClose={() => setShowCalendarSelector(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  settingsButton: {
    padding: 8,
    backgroundColor: '#F0F8FF',
    borderRadius: 8,
    marginRight: 8,
  },
  selectedCalendars: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 8,
  },
  calendarChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  calendarDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  calendarName: {
    fontSize: 12,
    color: '#666',
  },
  calendarGrid: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  weekDayText: {
    color: '#666',
    fontSize: 14,
    width: 40,
    textAlign: 'center',
  },
  weeksContainer: {
    width: '100%',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  calendarDay: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  selectedDay: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
  },
  selectedDayText: {
    color: '#ffffff',
  },
  otherMonthDay: {
    opacity: 0.3,
  },
  otherMonthDayText: {
    color: '#666',
  },
  today: {
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 20,
  },
  todayText: {
    color: '#007AFF',
  },
  eventDotsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 4,
    gap: 3,
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  eventsList: {
    padding: 20,
  },
  eventsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  addButton: {
    width: 36,
    height: 36,
    backgroundColor: '#F0F8FF',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventTime: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#f1f1f1',
    marginRight: 15,
  },
  timeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  ampmText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 3,
  },
  eventLocation: {
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    margin: 20,
    padding: 15,
    backgroundColor: '#FFE5E5',
    borderRadius: 8,
  },
  errorText: {
    color: '#D00000',
    fontSize: 14,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: '#666',
    fontSize: 14,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#666',
    fontSize: 14,
  },
});
