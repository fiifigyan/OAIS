import React, { useEffect } from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SuccessModal = ({ 
  visible, 
  onClose, 
  title, 
  message, 
  duration = 3000,
  onAutoClose
}) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
        if (onAutoClose) onAutoClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose, duration, onAutoClose]);

  return (
    <Modal 
      visible={visible} 
      transparent
      animationType="fade"
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.iconContainer}>
            <Icon name="checkmark-circle" size={48} color="#03AC13" />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 25,
    alignItems: 'center',
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#007AFF',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    minWidth: 120,
  },
  buttonText: {
    color: 'aliceblue',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default SuccessModal;