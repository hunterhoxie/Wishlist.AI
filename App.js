import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

// Import screens
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import ErrorBoundary from './components/ErrorBoundary';

function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Christmas Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎄 Wishlist AI</Text>
        <Text style={styles.headerSubtitle}>Your Christmas Wishlist Companion</Text>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>Search for gift ideas...</Text>
        </View>
      </View>
      
      {/* Featured Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎁 Featured Gifts</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          <View style={styles.giftCard}>
            <Text style={styles.giftEmoji}>🎮</Text>
            <Text style={styles.giftTitle}>Gaming Console</Text>
            <Text style={styles.giftPrice}>$299</Text>
          </View>
          <View style={styles.giftCard}>
            <Text style={styles.giftEmoji}>📱</Text>
            <Text style={styles.giftTitle}>Smartphone</Text>
            <Text style={styles.giftPrice}>$699</Text>
          </View>
          <View style={styles.giftCard}>
            <Text style={styles.giftEmoji}>🎧</Text>
            <Text style={styles.giftTitle}>Headphones</Text>
            <Text style={styles.giftPrice}>$149</Text>
          </View>
        </ScrollView>
      </View>
      
      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎅 Categories</Text>
        <View style={styles.categoriesGrid}>
          <View style={styles.categoryCard}>
            <Text style={styles.categoryEmoji}>🎮</Text>
            <Text style={styles.categoryName}>Gaming</Text>
          </View>
          <View style={styles.categoryCard}>
            <Text style={styles.categoryEmoji}>👗</Text>
            <Text style={styles.categoryName}>Fashion</Text>
          </View>
          <View style={styles.categoryCard}>
            <Text style={styles.categoryEmoji}>📚</Text>
            <Text style={styles.categoryName}>Books</Text>
          </View>
          <View style={styles.categoryCard}>
            <Text style={styles.categoryEmoji}>⚽</Text>
            <Text style={styles.categoryName}>Sports</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function WishlistScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>My Wishlist</Text>
    </View>
  );
}

function AIChatScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>AI Chat</Text>
    </View>
  );
}

function ExploreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Explore</Text>
    </View>
  );
}

function AIChatScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>AI Chat</Text>
    </View>
  );
}

function ExploreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Explore</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Profile</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Wishlist') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'AI Chat') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          } else if (route.name === 'Explore') {
            iconName = focused ? 'compass' : 'compass-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#667eea',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Wishlist" component={WishlistScreen} />
      <Tab.Screen name="AI Chat" component={AIChatScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainTabs /> : <AuthStack />}
      <StatusBar style="light" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  // Christmas Header
  header: {
    backgroundColor: '#c41e3a',
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  // Search Bar
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: -20,
  },
  searchBar: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchPlaceholder: {
    fontSize: 16,
    color: '#6c757d',
  },
  // Sections
  section: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 15,
  },
  // Gift Cards
  horizontalScroll: {
    marginHorizontal: -10,
  },
  giftCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginRight: 15,
    alignItems: 'center',
    width: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  giftEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  giftTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d3436',
    textAlign: 'center',
    marginBottom: 5,
  },
  giftPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#c41e3a',
  },
  // Categories Grid
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    width: '48%',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryEmoji: {
    fontSize: 30,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d3436',
  },
  // Other existing styles
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 18,
    color: '#667eea',
  },
});
