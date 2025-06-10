import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import PropTypes from 'prop-types';

const TypingIndicator = ({ isVisible, whoIsTyping = [] }) => {
  const [dotAnimation] = useState(new Animated.Value(0));
  
  useEffect(() => {
    if (!isVisible) return;

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(dotAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dotAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();
    return () => animation.stop();
  }, [isVisible]);

  if (!isVisible) return null;

  const opacity1 = dotAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  const opacity2 = dotAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 1, 0.3],
  });

  const opacity3 = dotAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.3],
  });

  const typingText = whoIsTyping.length > 0
    ? whoIsTyping.length === 1
      ? `${whoIsTyping[0]} is typing`
      : `${whoIsTyping.length} people are typing`
    : 'Typing';

  return (
    <View style={styles.container}>
      <View style={styles.dotsContainer}>
        <Animated.Text style={[styles.dot, { opacity: opacity1 }]}>•</Animated.Text>
        <Animated.Text style={[styles.dot, { opacity: opacity2 }]}>•</Animated.Text>
        <Animated.Text style={[styles.dot, { opacity: opacity3 }]}>•</Animated.Text>
      </View>
      <Text style={styles.text}>{typingText}</Text>
    </View>
  );
};

TypingIndicator.propTypes = {
  isVisible: PropTypes.bool,
  whoIsTyping: PropTypes.arrayOf(PropTypes.string),
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginVertical: 4,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  dot: {
    fontSize: 18,
    color: '#00873E',
    marginHorizontal: 2,
  },
  text: {
    color: '#00873E',
    fontSize: 14,
  },
});

export default TypingIndicator;