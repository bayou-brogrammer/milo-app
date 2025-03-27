import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import { Calendar, Check, X, ChevronRight } from 'lucide-react-native';
import { useCalendarStore } from '@/stores/calendar';
import type { Calendar as ExpoCalendar } from 'expo-calendar';

interface CalendarSelectorProps {
  visible: boolean;
  onClose: () => void;
}

export function CalendarSelector({ visible, onClose }: CalendarSelectorProps) {
  const {
    calendars,
    selectedCalendars,
    toggleCalendarSelection,
    selectAllCalendars,
    deselectAllCalendars,
    loadCalendars,
  } = useCalendarStore();

  const handleSelect = async (calendar: ExpoCalendar) => {
    toggleCalendarSelection(calendar);
  };

  const renderCalendarItem = (calendar: ExpoCalendar) => {
    const title = calendar.title || 'Untitled Calendar';
    const source = calendar.source.name ?? 'Unknown Source';
    const isSelected = selectedCalendars.some((cal) => cal.id === calendar.id);

    return (
      <TouchableOpacity
        key={calendar.id}
        style={[styles.calendarItem, isSelected && styles.calendarItemSelected]}
        onPress={() => handleSelect(calendar)}
      >
        <View style={styles.calendarInfo}>
          <View
            style={[styles.colorDot, { backgroundColor: calendar.color }]}
          />
          <View style={styles.calendarDetails}>
            <Text
              style={[
                styles.calendarName,
                isSelected && styles.calendarNameSelected,
              ]}
            >
              {title}
            </Text>
            <Text style={styles.calendarType}>{source}</Text>
          </View>
        </View>
        {isSelected ? (
          <Check size={20} color="#007AFF" />
        ) : (
          <ChevronRight size={20} color="#C7C7CC" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Calendars</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {calendars.length > 0 ? (
            <>
              <View style={styles.selectionButtons}>
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={selectAllCalendars}
                >
                  <Text style={styles.selectButtonText}>Select All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={deselectAllCalendars}
                >
                  <Text style={styles.selectButtonText}>Deselect All</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.calendarList}>
                {calendars.map(renderCalendarItem)}
              </ScrollView>
            </>
          ) : (
            <View style={styles.emptyState}>
              <Calendar size={48} color="#C7C7CC" />
              <Text style={styles.emptyStateTitle}>No Calendars Found</Text>
              <Text style={styles.emptyStateDescription}>
                No calendars are available on your device. Try refreshing or
                check your calendar permissions.
              </Text>
            </View>
          )}

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={loadCalendars}
            >
              <Calendar size={20} color="#007AFF" />
              <Text style={styles.refreshText}>Refresh Calendars</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.doneButton} onPress={onClose}>
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: '50%',
    maxHeight: '80%',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  closeButton: {
    padding: 4,
  },
  selectionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  selectButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F0F8FF',
    borderRadius: 8,
  },
  selectButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  calendarList: {
    padding: 15,
  },
  calendarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f1f1f1',
  },
  calendarItemSelected: {
    backgroundColor: '#F0F8FF',
    borderColor: '#007AFF',
  },
  calendarInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  calendarDetails: {
    flex: 1,
  },
  calendarName: {
    fontSize: 16,
    color: '#1a1a1a',
    marginBottom: 2,
  },
  calendarNameSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  calendarType: {
    fontSize: 14,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    minHeight: 200,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#f1f1f1',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    marginBottom: 10,
  },
  refreshText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  doneButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
