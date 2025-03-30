import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

const PaymentSuccess = ({ route, navigation }) => {
  const { amount, method, reference } = route.params;

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#4CAF50', '#2E7D32']} style={styles.header}>
        <Icon name="checkmark-circle" size={80} color="#fff" />
        <Text style={styles.successText}>Payment Successful!</Text>
      </LinearGradient>

      <View style={styles.card}>
        <DetailRow icon="cash" label="Amount" value={`GHS ${amount.toFixed(2)}`} />
        <DetailRow icon="card" label="Method" value={method} />
        <DetailRow icon="receipt" label="Reference" value={reference} />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.replace('Drawer')}
      >
        <Text style={styles.buttonText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
};

// Reuse DetailRow component from PaymentProcessingScreen.
const DetailRow = ({ icon, label, value }) => (
  <View style={styles.detailRow}>
    <Icon name={icon} size={18} color="#666" style={styles.rowIcon} />
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  successText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  button: {
    backgroundColor: '#000080',
    borderRadius: 25,
    padding: 18,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PaymentSuccess;