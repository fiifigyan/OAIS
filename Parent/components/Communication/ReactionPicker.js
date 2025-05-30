import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
const ReactionPicker = ({ onSelect }) => (
  <View style={styles.reactionPicker}>
    {['👍', '❤️', '😂', '😮', '😢'].map(emoji => (
      <TouchableOpacity key={emoji} onPress={() => onSelect(emoji)}>
        <Text style={styles.emoji}>{emoji}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

const styles = StyleSheet.create({
  reactionPicker: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  emoji: {
    fontSize: 24,
  },
});
/**
 * ReactionPicker.js
 * 
 * This component allows users to select a reaction emoji for a message.
 * It displays a row of emojis that the user can tap to select.
 */
export default ReactionPicker;