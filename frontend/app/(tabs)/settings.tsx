import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRight, Bell, User, Calendar, Activity, Moon } from 'lucide-react-native';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();

  const renderSettingItem = (icon: any, title: string, subtitle?: string) => (
    <TouchableOpacity style={styles.settingItem}>
      <View style={styles.settingIcon}>
        {icon}
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      <ChevronRight size={20} color="#8E8E93" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile</Text>
        {renderSettingItem(
          <User size={24} color="#007AFF" />,
          "Personal Information",
          "Sarah Johnson"
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        {renderSettingItem(
          <Bell size={24} color="#FF9500" />,
          "Notifications",
          "Customize your alerts"
        )}
        {renderSettingItem(
          <Calendar size={24} color="#5856D6" />,
          "Calendar Settings",
          "Sync and display options"
        )}
        {renderSettingItem(
          <Activity size={24} color="#34C759" />,
          "Energy Tracking",
          "Customize tracking intervals"
        )}
        {renderSettingItem(
          <Moon size={24} color="#AF52DE" />,
          "Theme",
          "Light"
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.aboutCard}>
          <Text style={styles.appName}>Milo</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
          <Text style={styles.description}>
            Your personal AI companion for managing tasks and energy levels
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginLeft: 20,
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  settingIcon: {
    width: 35,
    alignItems: 'center',
    marginRight: 15,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  aboutCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    marginTop: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 5,
  },
  version: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});