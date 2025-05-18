import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types';

const ErrorState = ({ error, onRetry }) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Icon 
        name="alert-circle" 
        size={48} 
        color={theme.colors.error}
        style={styles.icon}
      />
      <Text style={[styles.title, { color: theme.colors.error }]}>
        Something went wrong
      </Text>
      <Text style={[styles.description, { color: theme.colors.text }]}>
        {error?.message || 'Failed to load content'}
      </Text>
      {onRetry && (
        <Button 
          mode="contained" 
          onPress={onRetry}
          style={styles.button}
          labelStyle={styles.buttonLabel}
          icon="reload"
        >
          Try Again
        </Button>
      )}
    </View>
  );
};

ErrorState.propTypes = {
  error: PropTypes.object,
  onRetry: PropTypes.func,
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
    marginBottom: 24,
    lineHeight: 20,
  },
  button: {
    borderRadius: 8,
  },
  buttonLabel: {
    color: 'white',
  },
});

export default ErrorState;