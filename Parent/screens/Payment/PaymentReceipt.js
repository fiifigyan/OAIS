import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getPaymentReceipt } from '../../services/PaymentService';
import { formatDate } from '../../utils/helpers';

const PaymentReceiptScreen = ({ route, navigation }) => {
  const { paymentId } = route.params;
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadReceipt = async () => {
      try {
        const receiptData = await getPaymentReceipt(paymentId);
        setReceipt(receiptData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadReceipt();
  }, [paymentId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00873E" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="warning-outline" size={24} color="#FF5252" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Payment Receipt</Text>
        <Text style={styles.receiptNumber}>#{receipt.reference}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Amount Paid</Text>
          <Text style={styles.amount}>GHS {receipt.amount.toFixed(2)}</Text>
        </View>

        <View style={styles.detailsContainer}>
          <DetailRow icon="wallet-outline" label="Payment Method" value={receipt.method} />
          <DetailRow icon="calendar-outline" label="Date" value={formatDate(receipt.date)} />
          <DetailRow icon="time-outline" label="Time" value={new Date(receipt.date).toLocaleTimeString()} />
          <DetailRow
            icon={receipt.status === 'success' ? 'checkmark-circle-outline' : 'time-outline'}
            label="Status"
            value={receipt.status === 'success' ? 'Completed' : 'Processing'}
            isSuccess={receipt.status === 'success'}
          />
        </View>

        {receipt.fees.length > 0 && (
          <View style={styles.feesContainer}>
            <Text style={styles.sectionTitle}>Fees Paid</Text>
            {receipt.fees.map((fee) => (
              <View key={fee.id} style={styles.feeItem}>
                <Text style={styles.feeDescription}>{fee.description}</Text>
                <Text style={styles.feeAmount}>GHS {fee.amount.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.institutionDetails}>
          <Text style={styles.sectionTitle}>Institution Details</Text>
          <Text style={styles.institutionName}>{receipt.institutionDetails.name}</Text>
          <Text style={styles.institutionAddress}>{receipt.institutionDetails.address}</Text>
          <Text style={styles.institutionContact}>{receipt.institutionDetails.contact}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.printButton}
        onPress={() => {/* Implement print functionality */}}
      >
        <Icon name="print-outline" size={20} color="#00873E" />
        <Text style={styles.printButtonText}>Print Receipt</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const DetailRow = ({ icon, label, value, isSuccess }) => (
  <View style={styles.detailRow}>
    <Icon
      name={icon}
      size={20}
      color={isSuccess ? '#4CAF50' : '#666'}
      style={styles.detailIcon}
    />
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={[
      styles.detailValue,
      isSuccess && styles.successValue,
    ]}>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F8F9FF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FF5252',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#00873E',
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  receiptNumber: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  amountLabel: {
    fontSize: 16,
    color: '#666',
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00873E',
    marginTop: 8,
  },
  detailsContainer: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailIcon: {
    marginRight: 12,
  },
  detailLabel: {
    width: 120,
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'right',
  },
  successValue: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  feesContainer: {
    marginBottom: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  feeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  feeDescription: {
    fontSize: 14,
    color: '#333',
  },
  feeAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#00873E',
  },
  institutionDetails: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  institutionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  institutionAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  institutionContact: {
    fontSize: 14,
    color: '#666',
  },
  printButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#00873E',
    borderRadius: 8,
  },
  printButtonText: {
    color: '#00873E',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  closeButton: {
    backgroundColor: '#00873E',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentReceiptScreen;