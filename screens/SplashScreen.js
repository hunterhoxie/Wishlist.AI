import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function SplashScreen({ onSplashComplete }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    // Notify parent when splash is complete
    const timer = setTimeout(() => {
      if (onSplashComplete) {
        onSplashComplete();
      }
    }, 4000); // 4 seconds

    return () => clearTimeout(timer);
  }, [fadeAnim, onSplashComplete]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a1a', '#2d2d2d']}
        style={styles.gradient}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Big Present Emoji */}
          <Text style={styles.presentEmoji}>🎁</Text>

          {/* Christmas Wishlist Text */}
          <Text style={styles.titleText}>Christmas Wishlist</Text>

          {/* Bottom Powered By Text */}
          <View style={styles.bottomContainer}>
            <Text style={styles.poweredByText}>Powered by Wishlist AI</Text>
          </View>
        </Animated.View>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  presentEmoji: {
    fontSize: 120,
    marginBottom: 40,
  },
  titleText: {
    fontSize: 32,
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
    marginBottom: 60,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  poweredByText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});
