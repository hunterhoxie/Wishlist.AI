import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, TextInput, Alert, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function FriendsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
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
  
  const [friends, setFriends] = useState([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      avatar: '👩',
      mutualFriends: 12,
      joinedDate: '2025-10-15',
      isOnline: true,
      sharedLists: 3,
      status: 'active',
      lastSeen: 'Online now'
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      avatar: '👨',
      mutualFriends: 8,
      joinedDate: '2025-09-20',
      isOnline: false,
      sharedLists: 1,
      status: 'away',
      lastSeen: '2 hours ago'
    },
    {
      id: '3',
      name: 'Emily Davis',
      email: 'emily.d@email.com',
      avatar: '👩',
      mutualFriends: 15,
      joinedDate: '2025-11-01',
      isOnline: true,
      sharedLists: 5,
      status: 'active',
      lastSeen: 'Online now'
    },
    {
      id: '4',
      name: 'Alex Thompson',
      email: 'alex.t@email.com',
      avatar: '👨',
      mutualFriends: 6,
      joinedDate: '2025-10-10',
      isOnline: false,
      sharedLists: 2,
      status: 'offline',
      lastSeen: '1 day ago'
    },
  ]);

  const [pendingRequests] = useState([
    {
      id: '5',
      name: 'Jessica Martinez',
      email: 'jessica.m@email.com',
      avatar: '👩',
      mutualFriends: 5,
      requestDate: '2025-11-08'
    },
    {
      id: '6',
      name: 'David Wilson',
      email: 'david.w@email.com',
      avatar: '👨',
      mutualFriends: 3,
      requestDate: '2025-11-07'
    }
  ]);

  const groups = [
    {
      id: '1',
      name: 'Family Christmas 2025',
      description: 'Gift exchange with the whole family',
      members: 12,
      lists: 8,
      avatar: '🎄',
      createdDate: '2025-10-15',
      isActive: true
    },
    {
      id: '2',
      name: 'Office Secret Santa',
      description: 'Workplace gift exchange program',
      members: 24,
      lists: 15,
      avatar: '🎁',
      createdDate: '2025-11-01',
      isActive: true
    },
    {
      id: '3',
      name: 'Best Friends Group',
      description: 'Close friends gift sharing',
      members: 6,
      lists: 4,
      avatar: '👥',
      createdDate: '2025-09-20',
      isActive: false
    }
  ];

  const tabs = [
    { id: 'all', label: 'All Friends', icon: 'people', count: friends.length },
    { id: 'groups', label: 'Groups', icon: 'people-circle', count: 3 },
    { id: 'pending', label: 'Pending', icon: 'person-add', count: pendingRequests.length },
  ];

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'away': return '#FF9800';
      case 'offline': return '#888';
      default: return '#888';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return 'radio-button-on';
      case 'away': return 'time';
      case 'offline': return 'radio-button-off';
      default: return 'radio-button-off';
    }
  };

  const renderFriend = ({ item, index }) => (
    <Animated.View
      style={[
        styles.friendCard,
        {
          transform: [{
            translateY: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0, index % 2 === 0 ? -2 : 2],
            })
          }]
        }
      ]}
    >
      <LinearGradient
        colors={item.isOnline ? ['#2a1a1a', '#3a2a2a'] : ['#1a1a1a', '#2a2a2a']}
        style={styles.friendGradient}
      >
        <TouchableOpacity style={styles.friendContent}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>{item.avatar}</Text>
            <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(item.status) }]}>
              <Ionicons name={getStatusIcon(item.status)} size={8} color="#fff" />
            </View>
          </View>
          
          <View style={styles.friendInfo}>
            <View style={styles.friendHeader}>
              <Text style={styles.friendName}>{item.name}</Text>
              {item.isOnline && (
                <View style={styles.onlineBadge}>
                  <Text style={styles.onlineText}>ONLINE</Text>
                </View>
              )}
            </View>
            <Text style={styles.friendEmail}>{item.email}</Text>
            <View style={styles.friendStats}>
              <View style={styles.statItem}>
                <Ionicons name="people" size={12} color="#c41e3a" />
                <Text style={styles.statText}>{item.mutualFriends} mutual</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="list" size={12} color="#c41e3a" />
                <Text style={styles.statText}>{item.sharedLists} lists</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="time" size={12} color="#888" />
                <Text style={styles.statText}>{item.lastSeen}</Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="ellipsis-vertical" size={20} color="#c41e3a" />
          </TouchableOpacity>
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );

  const renderPendingRequest = ({ item }) => (
    <View style={styles.pendingCard}>
      <LinearGradient
        colors={['#2a1a1a', '#3a2a2a']}
        style={styles.pendingGradient}
      >
        <View style={styles.pendingContent}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>{item.avatar}</Text>
            <View style={styles.pendingIndicator}>
              <Ionicons name="person-add" size={10} color="#fff" />
            </View>
          </View>
          
          <View style={styles.pendingInfo}>
            <Text style={styles.pendingName}>{item.name}</Text>
            <Text style={styles.pendingEmail}>{item.email}</Text>
            <View style={styles.pendingMeta}>
              <View style={styles.statItem}>
                <Ionicons name="people" size={12} color="#c41e3a" />
                <Text style={styles.statText}>{item.mutualFriends} mutual</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="calendar" size={12} color="#888" />
                <Text style={styles.statText}>Requested {item.requestDate}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.pendingActions}>
            <TouchableOpacity style={styles.acceptButton}>
              <Ionicons name="checkmark" size={16} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.declineButton}>
              <Ionicons name="close" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  const renderTab = (item, index) => (
    <TouchableOpacity
      key={item.id}
      style={[
        index === 0 ? styles.tab : index === 1 ? styles.tabMiddle : styles.tabLast,
        activeTab === item.id && styles.activeTab
      ]}
      onPress={() => setActiveTab(item.id)}
    >
      <View style={styles.tabContent}>
        <Ionicons 
          name={item.icon} 
          size={16} 
          color={activeTab === item.id ? '#fff' : '#c41e3a'} 
        />
        <Text style={[
          styles.tabText,
          activeTab === item.id && styles.activeTabText
        ]}>
          {item.label}
        </Text>
        <View style={[
          styles.tabBadge,
          activeTab === item.id && styles.activeTabBadge
        ]}>
          <Text style={[
            styles.tabBadgeText,
            activeTab === item.id && styles.activeTabBadgeText
          ]}>
            {item.count}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderGroup = (item) => (
    <TouchableOpacity style={styles.groupCard}>
      <LinearGradient
        colors={['#2a1a1a', '#3a2a2a']}
        style={styles.groupGradient}
      >
        <View style={styles.groupHeader}>
          <View style={styles.groupAvatar}>
            <Text style={styles.groupAvatarText}>{item.avatar}</Text>
          </View>
          <View style={styles.groupInfo}>
            <View style={styles.groupTitleRow}>
              <Text style={styles.groupName}>{item.name}</Text>
              {item.isActive && (
                <View style={styles.activeIndicator}>
                  <Ionicons name="radio-button-on" size={8} color="#4CAF50" />
                </View>
              )}
            </View>
            <Text style={styles.groupDescription}>{item.description}</Text>
            <View style={styles.groupMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="people" size={12} color="#c41e3a" />
                <Text style={styles.metaText}>{item.members} members</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="list" size={12} color="#888" />
                <Text style={styles.metaText}>{item.lists} lists</Text>
              </View>
            </View>
          </View>
          <View style={styles.groupBadge}>
            <Ionicons name="chevron-forward" size={16} color="#888" />
          </View>
        </View>
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
        >
          {/* Natural Header */}
          <View style={styles.naturalHeader}>
            <View style={styles.headerTop}>
              <View style={styles.appInfo}>
                <Text style={styles.appTitle}>👥 Friends</Text>
                <Text style={styles.appSubtitle}>Connect and share wishlists</Text>
              </View>
            </View>
          </View>

          {/* Enhanced Search */}
          <View style={styles.searchContainer}>
            <LinearGradient
              colors={['#2a1a1a', '#3a2a2a']}
              style={styles.searchGradient}
            >
              <View style={styles.searchBar}>
                <Ionicons name="search" size={20} color="#c41e3a" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search friends..."
                  placeholderTextColor="#888"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Ionicons name="close-circle" size={20} color="#888" />
                  </TouchableOpacity>
                )}
              </View>
            </LinearGradient>
          </View>

          {/* Enhanced Tabs */}
          <View style={styles.tabsContainer}>
            <View style={styles.tabsList}>
              {tabs.map((tab, index) => renderTab(tab, index))}
            </View>
          </View>

          {/* Friends List */}
          {activeTab === 'all' && (
            <View style={styles.section}>
              <FlatList
                data={filteredFriends}
                renderItem={renderFriend}
                keyExtractor={item => item.id}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            </View>
          )}

          {/* Groups List */}
          {activeTab === 'groups' && (
            <View style={styles.section}>
              <FlatList
                data={groups}
                renderItem={renderGroup}
                keyExtractor={item => item.id}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            </View>
          )}

          {activeTab === 'online' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🟢 Online Now</Text>
              <FlatList
                data={filteredFriends.filter(f => f.isOnline)}
                renderItem={renderFriend}
                keyExtractor={item => item.id}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            </View>
          )}

          {activeTab === 'pending' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>⏳ Pending Requests</Text>
              <FlatList
                data={pendingRequests}
                renderItem={renderPendingRequest}
                keyExtractor={item => item.id}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            </View>
          )}

          {/* Add Friends Button */}
          <TouchableOpacity style={styles.addFriendButton}>
            <LinearGradient
              colors={['#c41e3a', '#a01829']}
              style={styles.addButtonGradient}
            >
              <Ionicons name="person-add" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Find New Friends</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
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
  searchContainer: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#c41e3a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  searchGradient: {
    padding: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  tabsContainer: {
    marginHorizontal: 0,
    marginBottom: 16,
  },
  tabsList: {
    flexDirection: 'row',
    paddingHorizontal: 0,
  },
  tab: {
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    flex: 1,
    alignItems: 'center',
  },
  tabMiddle: {
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    flex: 1,
    alignItems: 'center',
  },
  tabLast: {
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    flex: 1,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#c41e3a',
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tabText: {
    fontSize: 14,
    color: '#c41e3a',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
  },
  tabBadge: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  activeTabBadge: {
    backgroundColor: '#fff',
  },
  tabBadgeText: {
    fontSize: 11,
    color: '#c41e3a',
    fontWeight: 'bold',
  },
  activeTabBadgeText: {
    color: '#c41e3a',
  },
  friendCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  friendGradient: {
    borderRadius: 12,
  },
  friendContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    fontSize: 32,
    width: 48,
    height: 48,
    textAlign: 'center',
    lineHeight: 48,
    backgroundColor: '#2a2a2a',
    borderRadius: 24,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1a1a1a',
  },
  friendInfo: {
    flex: 1,
  },
  friendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  friendName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  onlineBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  onlineText: {
    fontSize: 9,
    color: '#fff',
    fontWeight: 'bold',
  },
  friendEmail: {
    fontSize: 12,
    color: '#888',
    marginBottom: 6,
  },
  friendStats: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 11,
    color: '#888',
  },
  actionButton: {
    padding: 8,
    borderRadius: 16,
    backgroundColor: '#2a2a2a',
  },
  pendingCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  pendingGradient: {
    borderRadius: 12,
  },
  pendingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  pendingIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    backgroundColor: '#FF9800',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1a1a1a',
  },
  groupCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  groupGradient: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#c41e3a20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  groupAvatarText: {
    fontSize: 20,
  },
  groupInfo: {
    flex: 1,
  },
  groupTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  groupName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 8,
  },
  activeIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupDescription: {
    fontSize: 13,
    color: '#888',
    marginBottom: 8,
  },
  groupMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#888',
  },
  groupBadge: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pendingInfo: {
    flex: 1,
  },
  pendingName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  pendingEmail: {
    fontSize: 12,
    color: '#888',
    marginBottom: 6,
  },
  pendingMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  pendingActions: {
    flexDirection: 'row',
    gap: 8,
  },
  acceptButton: {
    width: 32,
    height: 32,
    backgroundColor: '#4CAF50',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  declineButton: {
    width: 32,
    height: 32,
    backgroundColor: '#f44336',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addFriendButton: {
    marginHorizontal: 20,
    marginBottom: 32,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#c41e3a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
