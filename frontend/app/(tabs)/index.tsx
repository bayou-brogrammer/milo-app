import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=200&auto=format&fit=crop' }}
          style={styles.avatar}
        />
        <View style={styles.greeting}>
          <Text style={styles.welcomeText}>Welcome back</Text>
          <Text style={styles.nameText}>Sarah</Text>
        </View>
      </View>

      <View style={styles.energyCard}>
        <Text style={styles.cardTitle}>Current Energy Level</Text>
        <Text style={styles.energyLevel}>High</Text>
        <Text style={styles.energyDescription}>
          Great time to tackle important tasks or start new projects!
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Focus</Text>
        <View style={styles.focusCard}>
          <Text style={styles.focusTime}>10:00 AM - 12:00 PM</Text>
          <Text style={styles.focusTask}>Deep Work: Project Planning</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        <View style={styles.eventCard}>
          <Text style={styles.eventTime}>2:00 PM</Text>
          <Text style={styles.eventTitle}>Team Meeting</Text>
          <Text style={styles.eventLocation}>Virtual</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  greeting: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  energyCard: {
    backgroundColor: '#007AFF',
    borderRadius: 15,
    padding: 20,
    margin: 20,
    marginTop: 10,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
  },
  energyLevel: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  energyDescription: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.9,
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1a1a1a',
  },
  focusCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  focusTime: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 5,
  },
  focusTask: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  eventCard: {
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
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 5,
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
});