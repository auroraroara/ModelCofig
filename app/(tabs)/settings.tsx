import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Platform } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { LogOut, Bell, Shield, Moon, CircleHelp as HelpCircle, Info } from 'lucide-react-native';
import Avatar from '@/components/Avatar';
import Colors from '@/constants/Colors';

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);

  const handleSignOut = () => {
    if (Platform.OS === 'web') {
      signOut();
    } else {
      Alert.alert(
        'Sign Out',
        'Are you sure you want to sign out?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign Out', onPress: signOut, style: 'destructive' },
        ]
      );
    }
  };

  const SettingsItem = ({ icon, title, description, toggle, value, onToggle, onPress }) => (
    <TouchableOpacity 
      style={styles.settingsItem} 
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={[styles.iconContainer, { backgroundColor: Colors.primary + '20' }]}>
        {icon}
      </View>
      <View style={styles.settingsInfo}>
        <Text style={styles.settingsTitle}>{title}</Text>
        {description && <Text style={styles.settingsDescription}>{description}</Text>}
      </View>
      {toggle && (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: '#d9d9d9', true: Colors.primary + '70' }}
          thumbColor={value ? Colors.primary : '#f4f3f4'}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.profileSection}>
        <Avatar uri={user?.photoURL} size={80} />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user?.displayName}</Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <SettingsItem
          icon={<Bell size={24} color={Colors.primary} />}
          title="Notifications"
          description="Receive chat notifications"
          toggle
          value={notifications}
          onToggle={setNotifications}
        />
        <SettingsItem
          icon={<Moon size={24} color={Colors.primary} />}
          title="Dark Mode"
          description="Toggle dark theme"
          toggle
          value={isDarkMode}
          onToggle={setIsDarkMode}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>
        <SettingsItem
          icon={<Shield size={24} color={Colors.primary} />}
          title="Privacy"
          description="Manage your data and privacy settings"
          onPress={() => {}}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <SettingsItem
          icon={<HelpCircle size={24} color={Colors.primary} />}
          title="Help Center"
          description="Get help with using the app"
          onPress={() => {}}
        />
        <SettingsItem
          icon={<Info size={24} color={Colors.primary} />}
          title="About"
          description="Version 1.0.0"
          onPress={() => {}}
        />
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut} activeOpacity={0.7}>
        <LogOut size={20} color="#fff" />
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
  },
  profileInfo: {
    marginLeft: 16,
  },
  profileName: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#333',
    marginBottom: 4,
  },
  profileEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#999',
    marginLeft: 24,
    marginBottom: 8,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingsInfo: {
    flex: 1,
  },
  settingsTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  settingsDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginHorizontal: 24,
    marginTop: 16,
  },
  signOutButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#fff',
    marginLeft: 8,
  },
});