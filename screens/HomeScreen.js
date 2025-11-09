import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, RefreshControl, Animated, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const [notifications, setNotifications] = useState(3); // Number of unread notifications
  const [refreshing, setRefreshing] = useState(false);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [animatedValue] = useState(new Animated.Value(0));
  
  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      let christmas = new Date(currentYear, 11, 25); // December 25th
      
      // If Christmas has passed this year, use next year's Christmas
      if (now > christmas) {
        christmas = new Date(currentYear + 1, 11, 25);
      }
      
      const difference = christmas - now;
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setCountdown({ days, hours, minutes, seconds });
    };
    
    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, []);

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
  
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const handleNotifications = () => {
    if (notifications > 0) {
      Alert.alert(
        'Notifications',
        `You have ${notifications} new notifications:\n\n• Sarah shared a new wishlist\n• AI found 5 gift ideas for you\n• Reminder: Buy gifts for family`,
        [
          { text: 'Clear All', style: 'destructive', onPress: () => setNotifications(0) },
          { text: 'Later', style: 'cancel' }
        ]
      );
    } else {
      Alert.alert(
        'Notifications',
        'You\'re all caught up! No new notifications.',
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  // Simulate receiving new notification
  const simulateNewNotification = () => {
    setNotifications(prev => prev + 1);
  };

  // Enhanced mock data with more details
  const recentWishlists = [
    { 
      id: '1', 
      name: 'Christmas 2025', 
      items: 12, 
      shared: true, 
      progress: 8,
      priority: 'high',
      lastUpdated: '2 hours ago'
    },
    { 
      id: '2', 
      name: 'Birthday Ideas', 
      items: 8, 
      shared: false, 
      progress: 3,
      priority: 'medium',
      lastUpdated: '1 day ago'
    },
    { 
      id: '3', 
      name: 'Family Gifts', 
      items: 15, 
      shared: true, 
      progress: 10,
      priority: 'high',
      lastUpdated: '3 hours ago'
    },
  ];

  const quickActions = [
    { id: '1', title: 'Create List', icon: 'add-circle', color: '#4CAF50' },
    { id: '2', title: 'AI Ideas', icon: 'bulb', color: '#FF9800' },
    { id: '3', title: 'Share', icon: 'share', color: '#2196F3' },
    { id: '4', title: 'Friends', icon: 'people', color: '#9C27B0' },
  ];

  const renderWishlist = ({ item }) => (
    <TouchableOpacity style={styles.wishlistCard}>
      <LinearGradient
        colors={item.priority === 'high' ? ['#2a1a1a', '#3a2a2a'] : ['#1a1a1a', '#2a2a2a']}
        style={styles.wishlistGradient}
      >
        <View style={styles.wishlistHeader}>
          <View style={styles.wishlistInfo}>
            <View style={styles.wishlistTitleRow}>
              <Text style={styles.wishlistName}>{item.name}</Text>
              {item.priority === 'high' && (
                <View style={styles.priorityBadge}>
                  <Ionicons name="star" size={12} color="#FFD700" />
                </View>
              )}
            </View>
            <Text style={styles.wishlistMeta}>{item.items} items • {item.lastUpdated}</Text>
          </View>
          <View style={styles.wishlistBadge}>
            <Ionicons 
              name={item.shared ? "people" : "lock-closed"} 
              size={16} 
              color="#c41e3a" 
            />
          </View>
        </View>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View 
              style={[
                styles.progressFill, 
                { 
                  width: `${(item.progress / item.items) * 100}%`,
                  backgroundColor: item.priority === 'high' ? '#FFD700' : '#c41e3a'
                }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>{item.progress}/{item.items} completed</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderQuickAction = (item) => (
    <TouchableOpacity key={item.id} style={styles.quickActionCard}>
      <LinearGradient
        colors={[item.color + '20', item.color + '10']}
        style={styles.quickActionGradient}
      >
        <View style={[styles.quickActionIcon, { backgroundColor: item.color + '20' }]}>
          <Ionicons name={item.icon} size={32} color={item.color} />
        </View>
        <Text style={styles.quickActionText}>{item.title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0f0f0f', '#1a1a1a', '#2d2d2d']}
        style={styles.gradient}
      >
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#c41e3a" />
          }
        >
          {/* Natural Header */}
          <View style={styles.naturalHeader}>
            <View style={styles.headerTop}>
              <View style={styles.appInfo}>
                <Text style={styles.appTitle}>🎄 Home</Text>
                <Text style={styles.appSubtitle}>Plan your perfect Christmas</Text>
              </View>
              <TouchableOpacity style={styles.notificationsButton} onPress={handleNotifications}>
                <Ionicons name="notifications" size={20} color="#fff" />
                {notifications > 0 && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationCount}>{notifications}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            
            <View style={styles.countdownCard}>
              <View style={styles.countdownHeader}>
                <Ionicons name="gift" size={18} color="#FFD700" />
                <Text style={styles.countdownTitle}>Christmas Countdown</Text>
                <Ionicons name="gift" size={18} color="#FFD700" />
              </View>
              <View style={styles.countdownNumbers}>
                <View style={styles.countdownItem}>
                  <Text style={styles.countdownNumber}>{countdown.days}</Text>
                  <Text style={styles.countdownLabel}>Days</Text>
                </View>
                <View style={styles.countdownSeparator}>
                  <Text style={styles.separatorText}>:</Text>
                </View>
                <View style={styles.countdownItem}>
                  <Text style={styles.countdownNumber}>{countdown.hours}</Text>
                  <Text style={styles.countdownLabel}>Hours</Text>
                </View>
                <View style={styles.countdownSeparator}>
                  <Text style={styles.separatorText}>:</Text>
                </View>
                <View style={styles.countdownItem}>
                  <Text style={styles.countdownNumber}>{countdown.minutes}</Text>
                  <Text style={styles.countdownLabel}>Mins</Text>
                </View>
                <View style={styles.countdownSeparator}>
                  <Text style={styles.separatorText}>:</Text>
                </View>
                <View style={styles.countdownItem}>
                  <Text style={styles.countdownNumber}>{countdown.seconds}</Text>
                  <Text style={styles.countdownLabel}>Secs</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Enhanced Quick Actions */}
          <View style={styles.quickActionsSection}>
            <View style={styles.quickActionsGrid}>
              {quickActions.map(renderQuickAction)}
            </View>
          </View>

          {/* Enhanced Recent Wishlists */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>📋 Recent Wishlists</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See all →</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={recentWishlists}
              renderItem={renderWishlist}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </View>

          {/* Enhanced AI Assistant Card */}
          <View style={styles.aiAssistantCard}>
            <LinearGradient
              colors={['#2a1a1a', '#3a2a2a']}
              style={styles.aiGradient}
            >
              <View style={styles.aiHeader}>
                <View style={styles.aiIconContainer}>
                  <Ionicons name="sparkles" size={24} color="#c41e3a" />
                </View>
                <View style={styles.aiInfo}>
                  <Text style={styles.aiTitle}>🤖 AI Gift Assistant</Text>
                  <Text style={styles.aiSubtitle}>Get personalized gift ideas powered by AI</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.aiButton}>
                <LinearGradient
                  colors={['#c41e3a', '#a01829']}
                  style={styles.aiButtonGradient}
                >
                  <Text style={styles.aiButtonText}>Try AI Assistant</Text>
                  <Ionicons name="arrow-forward" size={16} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
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
  naturalHeader: {
    paddingTop: 25,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  appInfo: {
    flex: 1,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 14,
    color: '#888',
  },
  notificationsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#c41e3a',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#c41e3a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FFD700',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#c41e3a',
  },
  notificationCount: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
  },
  countdownCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  countdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 12,
  },
  countdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  countdownNumbers: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  countdownItem: {
    alignItems: 'center',
    minWidth: 60,
  },
  countdownNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#c41e3a',
    lineHeight: 32,
  },
  countdownLabel: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  countdownSeparator: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  separatorText: {
    fontSize: 20,
    color: '#666',
    fontWeight: '300',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  quickActionsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  seeAllText: {
    fontSize: 14,
    color: '#c41e3a',
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  quickActionGradient: {
    padding: 20,
    alignItems: 'center',
    borderRadius: 12,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  wishlistCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  wishlistGradient: {
    padding: 16,
    borderRadius: 12,
  },
  wishlistHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  wishlistInfo: {
    flex: 1,
  },
  wishlistTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  wishlistName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  priorityBadge: {
    backgroundColor: '#FFD70020',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  wishlistMeta: {
    fontSize: 12,
    color: '#888',
  },
  wishlistBadge: {
    backgroundColor: '#1a1a1a',
    padding: 8,
    borderRadius: 8,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#444',
    borderRadius: 3,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    color: '#888',
    textAlign: 'right',
  },
  aiAssistantCard: {
    marginHorizontal: 20,
    marginBottom: 32,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#c41e3a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  aiGradient: {
    padding: 20,
    borderRadius: 16,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  aiIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#c41e3a20',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  aiInfo: {
    flex: 1,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  aiSubtitle: {
    fontSize: 12,
    color: '#888',
  },
  aiButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  aiButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
  aiButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 8,
  },
});
