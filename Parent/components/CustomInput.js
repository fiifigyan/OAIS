import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export const CustomInput = ({ label, value, onChangeText, onBlur, error, placeholder, secureTextEntry = false, keyboardType = 'default', autoCapitalize = 'sentences', validate, leftIcon, rightIcon, onRightIconPress, containerStyle, inputStyle, multiline = false, numberOfLines = 1, }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const handleBlur = () => {
    if (validate) {
      validate(value);
    }
    onBlur && onBlur();
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        {leftIcon && (
          <View style={styles.leftIcon}>
            {leftIcon}
          </View>
        )}
        <TextInput
          style={[
            styles.input, 
            error ? styles.inputError : null,
            leftIcon ? styles.inputWithLeftIcon : null,
            rightIcon ? styles.inputWithRightIcon : null,
            inputStyle,
            multiline ? styles.multilineInput : null,
          ]}
          value={value}
          onChangeText={onChangeText}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor="#999"
          secureTextEntry={!isPasswordVisible && secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
        />
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.iconWrapper}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Icon name={isPasswordVisible ? 'eye' : 'eye-off'} size={20} color="#03AC13" />
          </TouchableOpacity>
        )}
        {rightIcon && !secureTextEntry && (
          <TouchableOpacity
            style={[styles.rightIcon,{padding:8}]}
            onPress={onRightIconPress}
            activeOpacity={0.8}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#03AC13',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },

  input: {
    flex: 1,
    height: 45,
    color: '#333',
    paddingHorizontal: 10,
    fontSize: 16,
  },
  inputWithLeftIcon: {
    paddingLeft: 40,
  },
  inputWithRightIcon: {
    paddingRight: 40,
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  leftIcon: {
    position: 'absolute',
    left: 10,
    zIndex: 1,
  },
  rightIcon: {
    position: 'absolute',
    right: 10,
    zIndex: 1,
  },
  iconWrapper: {
    position: 'absolute',
    right: 10,
    zIndex: 1,
    padding: 8,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 4,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
});