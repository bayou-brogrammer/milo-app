import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Activity } from 'lucide-react-native';

export default function EnergyScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Energy Tracking</Text>
      </View>

      <View style={styles.energyCard}>
        <Activity size={32} color="#fff" />
        <Text style={styles.energyLevel}>High Energy</Text>
        <Text style={styles.energyTime}>2:30 PM</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Energy Log</Text>
        
        <View style={styles.timelineContainer}>
          <View style={styles.timelineItem}>
            <View style={[styles.energyDot, { backgroundColor: '#4CAF50' }]} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTime}>9:00 AM</Text>
              <Text style={styles.timelineLevel}>Medium Energy</Text>
              <Text style={styles.timelineNote}>Morning coffee, feeling productive</Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={[styles.energyDot, { backgroundColor: '#2196F3' }]} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTime}>12:00 PM</Text>
              <Text style={styles.timelineLevel}>High Energy</Text>
              <Text style={styles.timelineNote}>Post-lunch boost, ready for afternoon tasks</Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={[styles.energyDot, { backgroundColor: '#FFC107' }]} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTime}>3:00 PM</Text>
              <Text style={styles.timelineLevel}>Medium Energy</Text>
              <Text style={styles.timelineNote}>Afternoon slump starting</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommendations</Text>
        <View style={styles.recommendationCard}>
          <Text style={styles.recommendationTitle}>Take a Break</Text>
          <Text style={styles.recommendationText}>
            Your energy levels typically dip around this time. Consider a 15-minute walk or quick meditation session.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  energyCard: {
    backgroundColor: '#007AFF',
    borderRadius: 15,
    padding: 20,
    margin: 20,
    alignItems: 'center',
  },
  energyLevel: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  energyTime: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.9,
    marginTop: 5,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1a1a1a',
  },
  timelineContainer: {
    paddingLeft: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  energyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 15,
    marginTop: 5,
  },
  timelineContent: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timelineTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  timelineLevel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 5,
  },
  timelineNote: {
    fontSize: 14,
    color: '#666',
  },
  recommendationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  recommendationText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});