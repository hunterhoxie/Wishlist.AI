import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function IdeasScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: '🤖 Hello! I\'m your AI gift assistant. I can help you find the perfect gift ideas for anyone on your list. What kind of gift are you looking for today?',
      sender: 'ai',
      timestamp: new Date().toISOString(),
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const scrollViewRef = useRef(null);
  const recordingAnimation = useRef(new Animated.Value(1)).current;

  // Sample AI responses for demo
  const aiResponses = [
    'Based on your description, I think a personalized photo album would be wonderful! It\'s thoughtful, personal, and shows you care about your shared memories.',
    'Have you considered a smart home device? Something like a smart speaker or smart display could be both practical and fun.',
    'For someone who loves cooking, I\'d suggest a high-quality chef\'s knife or a cooking class experience. Both show you understand their passion!',
    'A subscription box tailored to their interests could be perfect - it\'s the gift that keeps giving throughout the year!',
    'How about something experiential? Concert tickets, a spa day, or a weekend getaway create lasting memories.',
  ];

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    if (isRecording) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(recordingAnimation, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(recordingAnimation, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
      return () => pulseAnimation.stop();
    }
  }, [isRecording]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const sendMessage = () => {
    if (message.trim() === '') return;

    const userMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const startRecording = () => {
    setIsRecording(true);
    // In a real app, you would start voice recording here
  };

  const stopRecording = () => {
    setIsRecording(false);
    // In a real app, you would stop recording and process the voice here
    // For demo, we'll simulate a voice message
    const voiceMessage = {
      id: Date.now().toString(),
      text: '🎤 Voice message: "I need a gift for my dad who loves gardening"',
      sender: 'user',
      timestamp: new Date().toISOString(),
      isVoice: true,
    };
    setMessages(prev => [...prev, voiceMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: 'For a gardening dad, I\'d recommend a high-quality set of gardening tools, a rare plant for his collection, or even a greenhouse kit if you have the space! Another great idea would be a personalized garden stone or a gardening book signed by his favorite author.',
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const renderMessage = (message) => (
    <View key={message.id} style={[
      styles.messageContainer,
      message.sender === 'user' ? styles.userMessage : styles.aiMessage
    ]}>
      <LinearGradient
        colors={message.sender === 'user' ? ['#c41e3a', '#a01829'] : ['#2a1a1a', '#3a2a2a']}
        style={styles.messageGradient}
      >
        {message.isVoice && (
          <View style={styles.voiceIndicator}>
            <Ionicons name="mic" size={14} color="#fff" />
            <Text style={styles.voiceText}>Voice</Text>
          </View>
        )}
        <Text style={styles.messageText}>{message.text}</Text>
        <Text style={styles.timestamp}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </LinearGradient>
    </View>
  );

  const renderSuggestion = (text) => (
    <TouchableOpacity
      key={text}
      style={styles.suggestionChip}
      onPress={() => setMessage(text)}
    >
      <LinearGradient
        colors={['#2a1a1a', '#3a2a2a']}
        style={styles.suggestionGradient}
      >
        <Ionicons name="bulb" size={14} color="#c41e3a" />
        <Text style={styles.suggestionText}>{text}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const suggestions = [
    'Gift ideas for mom',
    'Birthday presents under $50',
    'Tech gifts for teenagers',
    'Anniversary gift ideas',
    'Last-minute gift suggestions',
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0f0f0f', '#1a1a1a', '#2d2d2d']}
        style={styles.gradient}
      >
        {/* Natural Header */}
        <View style={styles.naturalHeader}>
          <View style={styles.headerTop}>
            <View style={styles.appInfo}>
              <Text style={styles.appTitle}>🤖 AI Gift Assistant</Text>
              <Text style={styles.appSubtitle}>Get personalized gift ideas instantly</Text>
            </View>
            <TouchableOpacity style={styles.settingsButton}>
              <Ionicons name="settings" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Chat Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.chatContent}
        >
          {messages.map(renderMessage)}
          
          {isTyping && (
            <View style={[styles.messageContainer, styles.aiMessage]}>
              <LinearGradient
                colors={['#2a1a1a', '#3a2a2a']}
                style={styles.typingIndicator}
              >
                <View style={styles.typingDots}>
                  <Animated.View style={[styles.dot, { transform: [{ scale: recordingAnimation }] }]} />
                  <Animated.View style={[styles.dot, { transform: [{ scale: recordingAnimation }] }]} />
                  <Animated.View style={[styles.dot, { transform: [{ scale: recordingAnimation }] }]} />
                </View>
              </LinearGradient>
            </View>
          )}

          {/* Suggestions */}
          {messages.length <= 2 && (
            <View style={styles.suggestionsContainer}>
              <Text style={styles.suggestionsTitle}>💡 Try asking:</Text>
              <View style={styles.suggestionsList}>
                {suggestions.map(renderSuggestion)}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Recording Overlay */}
        {isRecording && (
          <View style={styles.recordingOverlay}>
            <LinearGradient
              colors={['#c41e3a', '#a01829']}
              style={styles.recordingGradient}
            >
              <Animated.View style={{ transform: [{ scale: recordingAnimation }] }}>
                <Ionicons name="mic" size={48} color="#fff" />
              </Animated.View>
              <Text style={styles.recordingText}>Recording...</Text>
              <Text style={styles.recordingTime}>{formatTime(recordingTime)}</Text>
              <TouchableOpacity style={styles.stopRecordingButton} onPress={stopRecording}>
                <Ionicons name="stop" size={24} color="#fff" />
                <Text style={styles.stopRecordingText}>Tap to stop</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <LinearGradient
            colors={['#2a1a1a', '#3a2a2a']}
            style={styles.inputGradient}
          >
            <View style={styles.inputRow}>
              <TextInput
                style={styles.textInput}
                placeholder="Ask me for gift ideas..."
                placeholderTextColor="#888"
                value={message}
                onChangeText={setMessage}
                multiline
                maxLength={500}
              />
              
              <View style={styles.inputActions}>
                {message.trim() === '' ? (
                  <TouchableOpacity
                    style={styles.microphoneButton}
                    onPressIn={startRecording}
                    onPressOut={stopRecording}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={['#4CAF50', '#45a049']}
                      style={styles.microphoneGradient}
                    >
                      <Ionicons name="mic" size={20} color="#fff" />
                    </LinearGradient>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.sendButton}
                    onPress={sendMessage}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={['#c41e3a', '#a01829']}
                      style={styles.sendGradient}
                    >
                      <Ionicons name="send" size={18} color="#fff" />
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            
            <View style={styles.inputFooter}>
              <Text style={styles.characterCount}>{message.length}/500</Text>
              <TouchableOpacity style={styles.attachButton}>
                <Ionicons name="attach" size={18} color="#888" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
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
  settingsButton: {
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
  chatContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  chatContent: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  messageContainer: {
    marginBottom: 12,
    maxWidth: width * 0.8,
  },
  userMessage: {
    alignSelf: 'flex-end',
    marginLeft: 'auto',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    marginRight: 'auto',
  },
  messageGradient: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  voiceIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  voiceText: {
    fontSize: 10,
    color: '#ffcccc',
    fontWeight: '600',
  },
  messageText: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 10,
    color: '#888',
    textAlign: 'right',
  },
  typingIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  typingDots: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#c41e3a',
  },
  suggestionsContainer: {
    marginTop: 20,
    paddingHorizontal: 4,
  },
  suggestionsTitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  suggestionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionChip: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  suggestionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  suggestionText: {
    fontSize: 12,
    color: '#fff',
  },
  recordingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 1000,
  },
  recordingGradient: {
    alignItems: 'center',
    padding: 32,
    borderRadius: 20,
    gap: 16,
  },
  recordingText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  recordingTime: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  stopRecordingButton: {
    alignItems: 'center',
    gap: 8,
  },
  stopRecordingText: {
    fontSize: 14,
    color: '#fff',
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
  },
  inputGradient: {
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    maxHeight: 100,
    minHeight: 40,
  },
  inputActions: {
    alignItems: 'flex-end',
  },
  microphoneButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  microphoneGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  sendGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  characterCount: {
    fontSize: 11,
    color: '#888',
    backgroundColor: '#c41e3a',
    padding: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default IdeasScreen;
