import React, { useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
const TypingIndicator = ({ isVisible }) => (
  isVisible && (
    <View style={styles.typingContainer}>
      <ActivityIndicator size="small" color="#00873E" />
      <Text style={styles.typingText}>Typing...</Text>
    </View>
  )
);

const styles = StyleSheet.create({
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginVertical: 4,
  },
  typingText: {
    marginLeft: 8,
    color: '#00873E',
    fontSize: 14,
  },
});
/**
 * TypingIndicator.js
 * 
 * This component displays a typing indicator when a user is typing a message.
 * It shows an activity indicator and a "Typing..." text.
 */

export default TypingIndicator;