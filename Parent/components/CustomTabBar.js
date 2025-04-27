import React, { useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from 'react-native-paper';
import * as Haptics from 'expo-haptics';

export default function CustomTabBar({ state, descriptors, navigation }) {
  const animationValues = useRef(state.routes.map(() => new Animated.Value(1))).current;

  const tabConfig = {
    Home: { icon: 'home', label: 'Home' },
    Calendar: { icon: 'calendar', label: 'Calendar' },
    Profile: { icon: 'person', label: 'Profile' },
    Notification: { icon: 'notifications', label: 'Notifications' },
  };

  const animateTab = (index) => {
    Animated.sequence([
      Animated.timing(animationValues[index], {
        toValue: 0.9,
        duration: 50,
        useNativeDriver: true
      }),
      Animated.spring(animationValues[index], {
        toValue: 1,
        friction: 5,
        useNativeDriver: true
      })
    ]).start();
  };

  const handlePress = (route, index, isFocused) => {
    if (!isFocused) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      animateTab(index);
      navigation.navigate(route.name);
    }
  };

  return (
    <View style={[styles.container, { 
      backgroundColor: '#FFFFFF',
      borderTopColor: '#E0E0E0'
    }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const { icon, label } = tabConfig[route.name];

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={() => handlePress(route, index, isFocused)}
            style={styles.tab}
            activeOpacity={0.8}
          >
            <Animated.View style={[
              styles.tabContent,
              { transform: [{ scale: animationValues[index] }] }
            ]}>
              <Ionicons
                name={isFocused ? icon : `${icon}-outline`}
                size={26}
                color={isFocused ? '#03AC13' : '#03c04A'}
              />
              <Text 
                style={[
                  styles.label,
                  { 
                    color: isFocused ? '#03AC13' : '#03c04A',
                    fontSize: isFocused ? 14 : 12,
                    fontWeight: isFocused ? '600' : '400',
                    fontFamily: isFocused ? 'Medium' : 'Regular' 
                  }
                ]}
                numberOfLines={1}
              >
                {label}
              </Text>
            </Animated.View>
            {isFocused && (
              <View 
                style={[
                  styles.activeIndicator,
                  { backgroundColor: '#03AC13' }
                ]} 
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContent: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    maxWidth: '90%',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    width: '40%',
    height: 3,
    borderRadius: 2,
  },
});