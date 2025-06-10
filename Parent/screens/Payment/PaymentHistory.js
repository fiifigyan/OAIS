import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { PaymentContext } from '../../context/PaymentContext';
import { formatDate } from '../../utils/helpers';

const PaymentHistoryScreen = ({ navigation, route }) => {
  const { payments, refreshPayments } = useContext(PaymentContext);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [highlightedPaymentId, setHighlightedPaymentId] = useState(null);

  // Handle highlight from navigation params
  useEffect(() => {
    if (route.params?.highlightId) {
      setHighlightedPaymentId(route.params.highlightId);
    }
  }, [route.params?.highlightId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshPayments();
    setRefreshing(false);
  };

  const handlePaymentPress = (payment) => {
    navigation.navigate('PaymentReceipt', { paymentId: payment.id });
  };

  const renderPaymentItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.paymentCard,
        item.id === highlightedPaymentId && styles.highlightedCard,
      ]}
      onPress={() => handlePaymentPress(item)}
    >
      <View style={styles.paymentHeader}>
        <Text style={styles.paymentMethod}>{item.method}</Text>
        <Text style={styles.paymentAmount}>-GHS {item.amount.toFixed(2)}</Text>
      </View>
      
      <View style={styles.paymentDetails}>
        <View style={styles.paymentMeta}>
          <Text style={styles.paymentDate}>{formatDate(item.date)}</Text>
          <View style={styles.paymentStatus}>
            <Icon
              name={item.status === 'success' ? 'checkmark-circle' : 'time'}
              size={16}
              color={item.status === 'success' ? '#4CAF50' : '#FF9800'}
            />
            <Text style={[
              styles.statusText,
              item.status === 'success' ? styles.statusSuccess : styles.statusPending,
            ]}>
              {item.status === 'success' ? 'Completed' : 'Processing'}
            </Text>
          </View>
        </View>
        
        {item.reference && (
          <Text style={styles.paymentReference}>Ref: {item.reference}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00873E" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={payments}
        keyExtractor={(item) => item.id}
        renderItem={renderPaymentItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#00873E']}
            tintColor="#00873E"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="receipt-outline" size={48} color="#CCCCCC" />
            <Text style={styles.emptyText}>No payment history found</Text>
          </View>
        }
        ListHeaderComponent={
          <Text style={styles.sectionTitle}>Payment History</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    marginTop: 8,
  },
  paymentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  highlightedCard: {
    borderWidth: 2,
    borderColor: '#00873E',
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentMethod: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00873E',
  },
  paymentDetails: {
    flexDirection: 'column',
  },
  paymentMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  paymentDate: {
    fontSize: 14,
    color: '#666666',
  },
  paymentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    marginLeft: 4,
  },
  statusSuccess: {
    color: '#4CAF50',
  },
  statusPending: {
    color: '#FF9800',
  },
  paymentReference: {
    fontSize: 13,
    color: '#999999',
    fontFamily: 'monospace',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999999',
    marginTop: 16,
  },
});

export default PaymentHistoryScreen;