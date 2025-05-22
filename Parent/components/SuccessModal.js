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
            <Icon name="checkmark-circle" size={48} color="#0B6623" />
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'aliceblue',
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
    color: '#0B6623',
  },
  iconContainer: {
    marginBottom: 20,
    backgroundColor: '#E0F7FA',
    borderRadius: 50,
    padding: 10,
  },
});

export default SuccessModal;