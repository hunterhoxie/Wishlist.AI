import React from 'react';
import { View, Text } from 'react-native';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, color: '#667eea', marginBottom: 10 }}>Something went wrong</Text>
          <Text style={{ fontSize: 14, color: 'gray', textAlign: 'center' }}>Please restart the app and try again</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
