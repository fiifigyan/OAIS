import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const PaymentMethod = ({ route, navigation }) => {
  const totalAmount = route.params?.totalAmount || 0;
  const [method, setMethod] = useState('MoMo');

  const paymentMethods = [
    { 
      label: 'Mobile Money', 
      value: 'MoMo', 
      icon: 'phone-portrait',
      description: 'Pay instantly with your mobile wallet',
    },
    { 
      label: 'Credit Card', 
      value: 'Credit Card', 
      icon: 'card',
      description: 'Visa, Mastercard, or other cards',
    },
    { 
      label: 'Bank Transfer', 
      value: 'Bank Transfer', 
      icon: 'swap-horizontal',
      description: 'Direct transfer from your bank',
    },
  ];

  const handlePayment = () => {
    navigation.navigate('PaymentProcessing', { 
      method,
      amount: totalAmount 
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={['#00873E', '#03C04A']} 
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.headerTitle}>Make Payment</Text>
        <Text style={styles.headerAmount}>GHS {totalAmount.toFixed(2)}</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Payment Method</Text>
          
          <View style={styles.methodsContainer}>
            {paymentMethods.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.methodOption,
                  method === option.value && styles.methodOptionActive
                ]}
                onPress={() => setMethod(option.value)}
              >
                <View style={[
                  styles.methodIconContainer,
                  method === option.value && styles.methodIconContainerActive
                ]}>
                  <Icon 
                    name={option.icon} 
                    size={24} 
                    color={method === option.value ? 'aliceblue' : '#00873E'} 
                  />
                </View>
                <View style={styles.methodTextContainer}>
                  <Text style={[
                    styles.methodLabel,
                    method === option.value && styles.methodLabelActive
                  ]}>
                    {option.label}
                  </Text>
                  <Text style={styles.methodDescription}>
                    {option.description}
                  </Text>
                </View>
                {method === option.value && (
                  <Icon name="checkmark-circle" size={20} color="#4CAF50" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.payButton}
          onPress={handlePayment}
          disabled={totalAmount <= 0}
        >
          <LinearGradient
            colors={['#00873E', '#03C04A']}
            style={styles.payButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.payButtonText}>Pay GHS {totalAmount.toFixed(2)}</Text>
            <Icon name="lock-closed" size={20} color="aliceblue" style={styles.lockIcon} />
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.securityInfo}>
          <Icon name="shield-checkmark" size={18} color="#4CAF50" />
          <Text style={styles.securityText}>Secure payment encrypted with SSL</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  header: {
    padding: 25,
    paddingBottom: 30,
    borderBottomEndRadius: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'aliceblue',
    marginBottom: 5,
  },
  headerAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'aliceblue',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  methodsContainer: {
    backgroundColor: 'aliceblue',
    borderRadius: 12,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  methodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginVertical: 3,
  },
  methodOptionActive: {
    backgroundColor: 'rgba(0, 0, 128, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: '#00873E',
  },
  methodIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 128, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  methodIconContainerActive: {
    backgroundColor: '#00873E',
  },
  methodTextContainer: {
    flex: 1,
  },
  methodLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  methodLabelActive: {
    color: '#00873E',
  },
  methodDescription: {
    fontSize: 14,
    color: '#666',
  },
  detailsCard: {
    backgroundColor: 'aliceblue',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00873E',
    marginLeft: 10,
  },
  detailsText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 15,
  },
  detailsNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    padding: 12,
    borderRadius: 8,
  },
  noteText: {
    fontSize: 14,
    color: '#FF9800',
    marginLeft: 10,
  },
  payButton: {
    marginTop: 20,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  payButtonGradient: {
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  payButtonText: {
    color: 'aliceblue',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  lockIcon: {
    marginLeft: 5,
  },
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  securityText: {
    color: '#4CAF50',
    fontSize: 14,
    marginLeft: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  errorText: {
    color: '#d32f2f',
    marginLeft: 10,
    fontSize: 14,
  },
});

export default PaymentMethod;