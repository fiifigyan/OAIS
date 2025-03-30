import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SuccessModal = ({ visible, onClose, title, message, buttonText, applicationId }) => {
  const navigation = useNavigation();

  const handleViewStatus = () => {
    onClose(); // Close the modal
    navigation.navigate('AdmissionStatus', { applicationId }); // Navigate to AdmissionStatus with applicationId
  };

  return (
    <Modal visible={visible} transparent={true}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity style={styles.button} onPress={handleViewStatus}>
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
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