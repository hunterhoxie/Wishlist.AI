import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [publicProfile, setPublicProfile] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [animatedValue] = useState(new Animated.Value(0));

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();
    
    return () => pulseAnimation.stop();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => logout() }
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert(
      'Edit Profile',
      'This would open a profile editing screen',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const handleShareProfile = () => {
    Alert.alert(
      'Share Profile',
      'Share your wishlist profile with friends',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const handleViewStats = () => {
    Alert.alert(
      'Your Stats',
      'Total Items: 35\nShared Lists: 8\nFriends: 12\nIdeas Generated: 24',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const profileStats = [
    { label: 'Total Items', value: '35', icon: 'list', color: '#c41e3a' },
    { label: 'Shared Lists', value: '8', icon: 'share', color: '#4CAF50' },
    { label: 'Friends', value: '12', icon: 'people', color: '#2196F3' },
    { label: 'Ideas Generated', value: '24', icon: 'bulb', color: '#FF9800' },
  ];

  const settingsOptions = [
    { 
      title: 'Edit Profile', 
      subtitle: 'Update your personal information',
      icon: 'person-outline',
      onPress: handleEditProfile,
      color: '#c41e3a'
    },
    { 
      title: 'Share Profile', 
      subtitle: 'Share your wishlist with friends',
      icon: 'share-outline',
      onPress: handleShareProfile,
      color: '#4CAF50'
    },
    { 
      title: 'View Stats', 
      subtitle: 'See your wishlist statistics',
      icon: 'bar-chart-outline',
      onPress: handleViewStats,
      color: '#2196F3'
    },
  ];

  const notificationOptions = [
    {
      title: 'Push Notifications',
      subtitle: 'Receive notifications about your lists',
      value: notifications,
      onToggle: setNotifications,
      icon: 'notifications-outline',
      color: '#FF9800'
    },
    {
      title: 'Public Profile',
      subtitle: 'Allow others to find your profile',
      value: publicProfile,
      onToggle: setPublicProfile,
      icon: 'globe-outline',
      color: '#9C27B0'
    },
    {
      title: 'Email Updates',
      subtitle: 'Get email updates about new features',
      value: emailNotifications,
      onToggle: setEmailNotifications,
      icon: 'mail-outline',
      color: '#607D8B'
    },
  ];

  const renderStat = (item, index) => (
    <Animated.View 
      key={index} 
      style={[
        styles.statCard,
        {
          transform: [{
            scale: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.05],
            })
          }]
        }
      ]}
    >
      <LinearGradient
        colors={[item.color + '20', item.color + '10']}
        style={styles.statGradient}
      >
        <View style={[styles.statIconContainer, { backgroundColor: item.color + '20' }]}>
          <Ionicons name={item.icon} size={20} color={item.color} />
        </View>
        <Text style={styles.statValue}>{item.value}</Text>
        <Text style={styles.statLabel}>{item.label}</Text>
      </LinearGradient>
    </Animated.View>
  );

  const renderSetting = (item, index) => (
    <TouchableOpacity key={index} style={styles.settingCard} onPress={item.onPress}>
      <LinearGradient
        colors={['#2a1a1a', '#3a2a2a']}
        style={styles.settingGradient}
      >
        <View style={styles.settingLeft}>
          <View style={[styles.settingIconContainer, { backgroundColor: item.color + '20' }]}>
            <Ionicons name={item.icon} size={20} color={item.color} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>{item.title}</Text>
            <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
          </View>
        </View>
        <View style={styles.settingRight}>
          <Ionicons name="chevron-forward" size={16} color="#888" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderNotification = (item, index) => (
    <View key={index} style={styles.notificationCard}>
      <LinearGradient
        colors={['#2a1a1a', '#3a2a2a']}
        style={styles.notificationGradient}
      >
        <View style={styles.notificationLeft}>
          <View style={[styles.notificationIconContainer, { backgroundColor: item.color + '20' }]}>
            <Ionicons name={item.icon} size={20} color={item.color} />
          </View>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            <Text style={styles.notificationSubtitle}>{item.subtitle}</Text>
          </View>
        </View>
        <View style={styles.notificationRight}>
          <Switch
            value={item.value}
            onValueChange={item.onToggle}
            trackColor={{ false: '#444', true: item.color + '40' }}
            thumbColor={item.value ? item.color : '#888'}
            ios_backgroundColor="#444"
          />
        </View>
      </LinearGradient>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0f0f0f', '#1a1a1a', '#2d2d2d']}
        style={styles.gradient}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Enhanced Profile Info */}
          <View style={styles.section}>
            <View style={styles.profileCard}>
              <LinearGradient
                colors={['#2a1a1a', '#3a2a2a']}
                style={styles.profileGradient}
              >
                <View style={styles.profileHeader}>
                  <View style={styles.avatarContainer}>
                    <LinearGradient
                      colors={['#c41e3a', '#a01829']}
                      style={styles.avatarGradient}
                    >
                      <Text style={styles.avatar}>👤</Text>
                    </LinearGradient>
                    <TouchableOpacity 
                      style={styles.editAvatarButton} 
                      onPress={handleEditProfile}
                    >
                      <LinearGradient
                        colors={['#4CAF50', '#45a049']}
                        style={styles.editButtonGradient}
                      >
                        <Ionicons name="camera" size={14} color="#fff" />
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>{user?.email?.split('@')[0] || 'User'}</Text>
                    <Text style={styles.profileEmail}>{user?.email || 'user@example.com'}</Text>
                    <View style={styles.memberBadge}>
                      <Ionicons name="star" size={12} color="#FFD700" />
                      <Text style={styles.memberSince}>Member since Nov 2025</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.profileActions}>
                  <TouchableOpacity 
                    style={styles.profileActionButton}
                    onPress={handleEditProfile}
                  >
                    <LinearGradient
                      colors={['#c41e3a', '#a01829']}
                      style={styles.actionButtonGradient}
                    >
                      <Ionicons name="create" size={16} color="#fff" />
                      <Text style={styles.actionButtonText}>Edit Profile</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.profileActionButton}
                    onPress={handleShareProfile}
                  >
                    <LinearGradient
                      colors={['#4CAF50', '#45a049']}
                      style={styles.actionButtonGradient}
                    >
                      <Ionicons name="share" size={16} color="#fff" />
                      <Text style={styles.actionButtonText}>Share</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          </View>

          {/* Enhanced Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📊 Your Activity</Text>
            <View style={styles.statsContainer}>
              {profileStats.map(renderStat)}
            </View>
          </View>

          {/* Enhanced Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⚙️ Account Settings</Text>
            <View style={styles.settingsList}>
              {settingsOptions.map(renderSetting)}
            </View>
          </View>

          {/* Enhanced Notifications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔔 Notifications</Text>
            <View style={styles.notificationsList}>
              {notificationOptions.map(renderNotification)}
            </View>
          </View>

          {/* Logout Button */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <LinearGradient
                colors={['#dc3545', '#c82333']}
                style={styles.logoutGradient}
              >
                <Ionicons name="log-out" size={20} color="#fff" />
                <Text style={styles.logoutButtonText}>Logout</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* App Version */}
          <View style={styles.footer}>
            <Text style={styles.versionText}>Wishlist.AI v1.0.0</Text>
            <Text style={styles.copyrightText}>© 2025 Christmas Wishlist App</Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  profileCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  profileGradient: {
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatarGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#c41e3a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatar: {
    fontSize: 32,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  editButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  memberSince: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '600',
  },
  profileActions: {
    flexDirection: 'row',
    gap: 12,
  },
  profileActionButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: '23%',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  statGradient: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderRadius: 12,
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 10,
    color: '#888',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  settingsList: {
    gap: 12,
  },
  settingCard: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  settingGradient: {
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#888',
  },
  settingRight: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationsList: {
    gap: 12,
  },
  notificationCard: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  notificationGradient: {
    padding: 16,
  },
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notificationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  notificationSubtitle: {
    fontSize: 12,
    color: '#888',
  },
  notificationRight: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#dc3545',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 12,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 20,
  },
  versionText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 10,
    color: '#666',
  },
});
