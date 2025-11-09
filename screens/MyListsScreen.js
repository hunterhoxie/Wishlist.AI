import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Alert, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function MyListsScreen() {
  const [lists, setLists] = useState([
    { 
      id: '1', 
      name: 'Christmas 2025', 
      description: 'Gifts for family and friends',
      items: 12, 
      shared: true, 
      sharedWith: 5,
      created: '2025-11-01',
      lastModified: '2025-11-08',
      priority: 'high',
      progress: 8,
      category: 'Holiday',
      color: '#c41e3a'
    },
    { 
      id: '2', 
      name: 'Birthday Ideas', 
      description: 'Potential birthday gifts',
      items: 8, 
      shared: false, 
      sharedWith: 0,
      created: '2025-10-15',
      lastModified: '2025-11-05',
      priority: 'medium',
      progress: 3,
      category: 'Personal',
      color: '#FF9800'
    },
    { 
      id: '3', 
      name: 'Family Gifts', 
      description: 'Gifts for parents and siblings',
      items: 15, 
      shared: true, 
      sharedWith: 3,
      created: '2025-09-20',
      lastModified: '2025-11-07',
      priority: 'high',
      progress: 10,
      category: 'Holiday',
      color: '#4CAF50'
    },
    { 
      id: '4', 
      name: 'Tech Wishlist', 
      description: 'Gadgets and electronics',
      items: 6, 
      shared: false, 
      sharedWith: 0,
      created: '2025-11-01',
      lastModified: '2025-11-06',
      priority: 'low',
      progress: 2,
      category: 'Technology',
      color: '#2196F3'
    },
    { 
      id: '5', 
      name: 'Anniversary Special', 
      description: 'Romantic gift ideas',
      items: 10, 
      shared: true, 
      sharedWith: 1,
      created: '2025-10-01',
      lastModified: '2025-11-04',
      priority: 'medium',
      progress: 7,
      category: 'Romantic',
      color: '#9C27B0'
    },
  ]);

  const [animatedValue] = useState(new Animated.Value(0));
  const [filterMode, setFilterMode] = useState('all');
  
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

  const filters = [
    { id: 'all', label: 'All Lists', icon: 'list', count: lists.length },
    { id: 'shared', label: 'Shared', icon: 'people', count: lists.filter(l => l.shared).length },
    { id: 'private', label: 'Private', icon: 'lock-closed', count: lists.filter(l => !l.shared).length },
    { id: 'high', label: 'Priority', icon: 'star', count: lists.filter(l => l.priority === 'high').length },
  ];

  const filteredLists = lists.filter(list => {
    switch (filterMode) {
      case 'shared': return list.shared;
      case 'private': return !list.shared;
      case 'high': return list.priority === 'high';
      default: return true;
    }
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#FFD700';
      case 'medium': return '#FF9800';
      case 'low': return '#2196F3';
      default: return '#888';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return 'star';
      case 'medium': return 'star-half';
      case 'low': return 'star-outline';
      default: return 'star-outline';
    }
  };

  const renderList = ({ item, index }) => (
    <Animated.View
      style={[
        styles.listCard,
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
        colors={item.priority === 'high' ? ['#2a1a1a', '#3a2a2a'] : ['#1a1a1a', '#2a2a2a']}
        style={styles.listGradient}
      >
        <TouchableOpacity style={styles.listContent}>
          <View style={styles.listHeader}>
            <View style={styles.listInfo}>
              <View style={styles.listTitleRow}>
                <Text style={styles.listName}>{item.name}</Text>
                <View style={styles.priorityContainer}>
                  <Ionicons 
                    name={getPriorityIcon(item.priority)} 
                    size={16} 
                    color={getPriorityColor(item.priority)} 
                  />
                  <View style={[styles.categoryBadge, { backgroundColor: item.color + '20' }]}>
                    <Text style={[styles.categoryText, { color: item.color }]}>
                      {item.category}
                    </Text>
                  </View>
                </View>
              </View>
              <Text style={styles.listDescription}>{item.description}</Text>
              <View style={styles.listMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="gift" size={12} color="#c41e3a" />
                  <Text style={styles.metaText}>{item.items} items</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="calendar" size={12} color="#888" />
                  <Text style={styles.metaText}>Updated {item.lastModified}</Text>
                </View>
              </View>
            </View>
            <View style={styles.listActions}>
              <TouchableOpacity style={styles.shareButton}>
                <Ionicons 
                  name={item.shared ? "people" : "lock-closed"} 
                  size={16} 
                  color="#c41e3a" 
                />
                {item.shared && (
                  <Text style={styles.shareCount}>{item.sharedWith}</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.moreButton}>
                <Ionicons name="ellipsis-vertical" size={20} color="#c41e3a" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Progress</Text>
              <Text style={styles.progressText}>{item.progress}/{item.items} completed</Text>
            </View>
            <View style={styles.progressBar}>
              <Animated.View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${(item.progress / item.items) * 100}%`,
                    backgroundColor: item.priority === 'high' ? '#FFD700' : item.color
                  }
                ]} 
              />
            </View>
          </View>
          
          <View style={styles.listFooter}>
            <View style={styles.footerStats}>
              <View style={styles.statItem}>
                <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
                <Text style={styles.statText}>{item.progress} done</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="time" size={14} color="#888" />
                <Text style={styles.statText}>{item.items - item.progress} left</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.openButton}>
              <LinearGradient
                colors={[item.color, item.color + 'cc']}
                style={styles.openButtonGradient}
              >
                <Text style={styles.openButtonText}>Open List</Text>
                <Ionicons name="arrow-forward" size="14" color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );

  const renderFilter = (item) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.filterTab,
        filterMode === item.id && styles.activeFilterTab
      ]}
      onPress={() => setFilterMode(item.id)}
    >
      <View style={styles.filterContent}>
        <Ionicons 
          name={item.icon} 
          size={16} 
          color={filterMode === item.id ? '#fff' : '#c41e3a'} 
        />
        <Text style={[
          styles.filterText,
          filterMode === item.id && styles.activeFilterText
        ]}>
          {item.label}
        </Text>
        <View style={[
          styles.filterBadge,
          filterMode === item.id && styles.activeFilterBadge
        ]}>
          <Text style={[
            styles.filterBadgeText,
            filterMode === item.id && styles.activeFilterBadgeText
          ]}>
            {item.count}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const listStats = [
    { label: 'Total', value: '5', icon: 'list', color: '#c41e3a' },
    { label: 'Shared', value: '3', icon: 'people', color: '#4CAF50' },
    { label: 'Items', value: '51', icon: 'gift', color: '#FF9800' },
    { label: 'Priority', value: '2', icon: 'star', color: '#FFD700' },
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
        <Text style={styles.statNumber}>{item.value}</Text>
        <Text style={styles.statLabel}>{item.label}</Text>
      </LinearGradient>
    </Animated.View>
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
                <Text style={styles.appTitle}>📋 My Lists</Text>
                <Text style={styles.appSubtitle}>Organize your gift ideas</Text>
              </View>
              <TouchableOpacity style={styles.createButton}>
                <Ionicons name="add" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Enhanced Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📊 Your Collections</Text>
            <View style={styles.statsContainer}>
              {listStats.map(renderStat)}
            </View>
          </View>

          {/* Enhanced Filters */}
          <View style={styles.filtersContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filtersList}>
                {filters.map(renderFilter)}
              </View>
            </ScrollView>
          </View>

          {/* Lists */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {filterMode === 'all' ? '🌟 All Lists' : 
               filterMode === 'shared' ? '👥 Shared Lists' :
               filterMode === 'private' ? '🔒 Private Lists' : '⭐ Priority Lists'}
            </Text>
            <FlatList
              data={filteredLists}
              renderItem={renderList}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </View>

          {/* Create List Button */}
          <TouchableOpacity style={styles.createButton}>
            <LinearGradient
              colors={['#c41e3a', '#a01829']}
              style={styles.createButtonGradient}
            >
              <Ionicons name="add-circle" size={20} color="#fff" />
              <Text style={styles.createButtonText}>Create New List</Text>
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
  createButton: {
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
  statNumber: {
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
  filtersContainer: {
    marginBottom: 16,
  },
  filtersList: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
  },
  filterTab: {
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  activeFilterTab: {
    backgroundColor: '#c41e3a',
  },
  filterContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterText: {
    fontSize: 14,
    color: '#c41e3a',
    fontWeight: '600',
  },
  activeFilterText: {
    color: '#fff',
  },
  filterBadge: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  activeFilterBadge: {
    backgroundColor: '#fff',
  },
  filterBadgeText: {
    fontSize: 11,
    color: '#c41e3a',
    fontWeight: 'bold',
  },
  activeFilterBadgeText: {
    color: '#c41e3a',
  },
  listCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  listGradient: {
    borderRadius: 12,
  },
  listContent: {
    padding: 16,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  listInfo: {
    flex: 1,
  },
  listTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  listName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    marginRight: 8,
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  listDescription: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  listMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: '#888',
  },
  listActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  shareCount: {
    fontSize: 10,
    color: '#c41e3a',
    fontWeight: 'bold',
  },
  moreButton: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: '#2a2a2a',
  },
  progressSection: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressTitle: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
  },
  progressText: {
    fontSize: 11,
    color: '#888',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#444',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  listFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerStats: {
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
  openButton: {
    borderRadius: 8,
    overflow: 'hidden',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
