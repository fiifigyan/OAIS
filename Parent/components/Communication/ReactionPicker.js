import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import PropTypes from 'prop-types';

const ReactionPicker = ({ onSelect, reactions = DEFAULT_REACTIONS, emojiSize = 24 }) => {
  const [scaleAnim] = useState(new Animated.Value(1));

  const handleReactionSelect = (emoji) => {
    // Animation when selecting
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.5,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    onSelect(emoji);
  };

  return (
    <View style={styles.reactionPicker}>
      {reactions.map(emoji => (
        <TouchableOpacity 
          key={emoji} 
          onPress={() => handleReactionSelect(emoji)}
          accessibilityLabel={`React with ${emoji}`}
        >
          <Animated.Text style={[styles.emoji, { 
            fontSize: emojiSize,
            transform: [{ scale: scaleAnim }] 
          }]}>
            {emoji}
          </Animated.Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const DEFAULT_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '😡'];

ReactionPicker.propTypes = {
  onSelect: PropTypes.func.isRequired,
  reactions: PropTypes.arrayOf(PropTypes.string),
  emojiSize: PropTypes.number,
};

const styles = StyleSheet.create({
  reactionPicker: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emoji: {
    marginHorizontal: 4,
  },
});

export default ReactionPicker;