import React, { useState, useContext, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { PaymentContext } from '../../context/PaymentContext';

const HistoryScreen = ({ route }) => {
  const { payments } = useContext(PaymentContext);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [highlightedPaymentId, setHighlightedPaymentId] = useState(null);

  // Check if a payment ID was passed to highlight
  useEffect(() => {
    if (route.params?.highlightId) {
      setHighlightedPaymentId(route.params.highlightId);
    }
  }, [route.params?.highlightId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment History</Text>
      <FlatList
        data={payments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.paymentCard,
              item.id === highlightedPaymentId && styles.highlightedPaymentCard,
            ]}
            onPress={() => setSelectedPayment(item)}
          >
            <Text style={styles.label}>ID: {item.id}</Text>
            <Text style={styles.label}>Amount: GHS {item.amount.toFixed(2)}</Text>
            <Text style={styles.label}>Method: {item.method}</Text>
            <Text style={styles.label}>Date: {new Date(item.date).toLocaleString()}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Receipt Modal */}
      <Modal visible={!!selectedPayment} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Receipt</Text>
            {selectedPayment && (
              <>
                <Text style={styles.label}>ID: {selectedPayment.id}</Text>
                <Text style={styles.label}>Amount: GHS {selectedPayment.amount.toFixed(2)}</Text>
                <Text style={styles.label}>Method: {selectedPayment.method}</Text>
                <Text style={styles.label}>Date: {new Date(selectedPayment.date).toLocaleString()}</Text>
              </>
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedPayment(null)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'aliceblue',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  paymentCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  highlightedPaymentCard: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HistoryScreen;