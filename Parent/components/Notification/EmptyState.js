import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types';

const EmptyState = ({ title, description, icon }) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Icon 
        name={icon || 'bell-off'} 
        size={48} 
        color={theme.colors.placeholder}
        style={styles.icon}
      />
      <Text style={[styles.title, { color: theme.colors.text }]}>
        {title || 'No items found'}
      </Text>
      {description && (
        <Text style={[styles.description, { color: theme.colors.placeholder }]}>
          {description}
        </Text>
      )}
    </View>
  );
};

EmptyState.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  icon: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  icon: {
    marginBottom: 16,
    opacity: 0.6,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default EmptyState;