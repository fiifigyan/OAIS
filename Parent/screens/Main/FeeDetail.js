import React, { useContext, useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { PaymentContext } from '../../context/PaymentContext';
import { formatDate } from '../../utils/helpers';

const FeeDetailScreen = ({ navigation }) => {
  const { fees, payments, isLoading, error, refreshFees, refreshPayments } = useContext(PaymentContext);
  const [refreshing, setRefreshing] = useState(false);

  // Calculate fee summaries
  const { pendingFees, totalAmount, paidAmount } = useMemo(() => {
    const pending = fees.filter(fee => fee.status === 'Pending');
    const total = pending.reduce((sum, fee) => sum + fee.amount, 0);
    const paid = fees
      .filter(fee => fee.status === 'Paid')
      .reduce((sum, fee) => sum + fee.amount, 0);
    return { pendingFees: pending, totalAmount: total, paidAmount: paid };
  }, [fees]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refreshFees(), refreshPayments()]);
    setRefreshing(false);
  };

  const handlePayNow = () => {
    navigation.navigate('PaymentMethod', {
      totalAmount,
      feeIds: pendingFees.map(f => f.id),
    });
  };

  const getFeeStatus = (fee) => {
    if (fee.status === 'Paid') return 'Paid';
    if (new Date(fee.dueDate) < new Date()) return 'Overdue';
    return 'Pending';
  };

  const handleViewReceipt = (paymentId) => {
    navigation.navigate('PaymentReceipt', { paymentId });
  };

  if (isLoading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00873E" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with summary */}
      <LinearGradient colors={['#00873E', '#03C04A']} style={styles.header}>
        <Text style={styles.headerTitle}>Fee Statement</Text>
        
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Due</Text>
            <Text style={styles.summaryValue}>GHS {totalAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Paid</Text>
            <Text style={styles.summaryValue}>GHS {paidAmount.toFixed(2)}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#00873E']}
            tintColor="#00873E"
          />
        }
      >
        {/* Fee breakdown section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fee Breakdown</Text>
          {fees.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="receipt-outline" size={40} color="#ccc" />
              <Text style={styles.emptyText}>No fees records found</Text>
            </View>
          ) : (
            fees.map((fee) => (
              <View key={fee.id} style={[
                styles.feeCard,
                getFeeStatus(fee) === 'Paid' && styles.paidFeeCard,
                getFeeStatus(fee) === 'Overdue' && styles.overdueFeeCard,
              ]}>
                <View style={styles.feeHeader}>
                  <Text style={styles.feeDescription}>{fee.description}</Text>
                  <Text style={styles.feeAmount}>GHS {fee.amount.toFixed(2)}</Text>
                </View>
                
                <View style={styles.feeMeta}>
                  <View style={styles.statusBadge}>
                    <Icon 
                      name={getFeeStatus(fee) === 'Paid' ? 'checkmark-circle' : 
                            getFeeStatus(fee) === 'Overdue' ? 'alert-circle' : 'time'}
                      size={16}
                      color={getFeeStatus(fee) === 'Paid' ? '#4CAF50' : 
                             getFeeStatus(fee) === 'Overdue' ? '#FF5252' : '#FF9800'}
                    />
                    <Text style={[
                      styles.statusText,
                      getFeeStatus(fee) === 'Paid' && styles.statusPaid,
                      getFeeStatus(fee) === 'Overdue' && styles.statusOverdue,
                    ]}>
                      {getFeeStatus(fee)}
                      {getFeeStatus(fee) === 'Overdue' && '!'}
                    </Text>
                  </View>
                  
                  <Text style={styles.feeDate}>
                    {getFeeStatus(fee) === 'Paid' ? 
                      `Paid on ${formatDate(fee.paidDate)}` : 
                      `Due by ${formatDate(fee.dueDate)}`}
                  </Text>
                </View>
                
                {fee.notes && (
                  <Text style={styles.feeNotes}>{fee.notes}</Text>
                )}
              </View>
            ))
          )}
        </View>

        {/* Payment history section */}
        {payments.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Payments</Text>
            {payments.slice(0, 3).map(payment => (
              <TouchableOpacity 
                key={payment.id}
                style={styles.paymentCard}
                onPress={() => handleViewReceipt(payment.id)}
              >
                <View style={styles.paymentHeader}>
                  <Text style={styles.paymentMethod}>{payment.method}</Text>
                  <Text style={styles.paymentAmount}>-GHS {payment.amount.toFixed(2)}</Text>
                </View>
                <Text style={styles.paymentDate}>{formatDate(payment.date)}</Text>
                {payment.reference && (
                  <Text style={styles.paymentRef}>Ref: {payment.reference}</Text>
                )}
                <View style={styles.paymentStatus}>
                  <Icon 
                    name="checkmark-circle" 
                    size={16} 
                    color={payment.status === 'success' ? '#4CAF50' : '#FF9800'} 
                  />
                  <Text style={[
                    styles.paymentStatusText,
                    payment.status === 'success' && styles.paymentStatusSuccess,
                  ]}>
                    {payment.status === 'success' ? 'Completed' : 'Processing'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
            {payments.length > 3 && (
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={() => navigation.navigate('PaymentHistory')}
              >
                <Text style={styles.viewAllText}>View All Payments ({payments.length})</Text>
                <Icon name="chevron-forward" size={18} color="#00873E" />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Pay Now Button */}
        {pendingFees.length > 0 && (
          <TouchableOpacity 
            style={styles.payButton} 
            onPress={handlePayNow}
            disabled={isLoading}
          >
            <LinearGradient
              colors={['#03C04A', '#00873E']}
              style={styles.payButtonGradient}
            >
              <Text style={styles.payButtonText}>Pay GHS {totalAmount.toFixed(2)}</Text>
              <Icon name="arrow-forward" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Error message */}
        {error && (
          <View style={styles.errorContainer}>
            <Icon name="warning-outline" size={20} color="#FF5252" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={onRefresh}>
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 25,
    paddingBottom: 30,
    borderBottomEndRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
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
  feeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  paidFeeCard: {
    opacity: 0.7,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  overdueFeeCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF5252',
  },
  feeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  feeDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  feeAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00873E',
  },
  feeMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 5,
    color: '#FF9800',
  },
  statusPaid: {
    color: '#4CAF50',
  },
  statusOverdue: {
    color: '#FF5252',
  },
  feeDate: {
    fontSize: 12,
    color: '#666',
  },
  feeNotes: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  paymentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  paymentMethod: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  paymentAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00873E',
  },
  paymentDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 3,
  },
  paymentRef: {
    fontSize: 12,
    color: '#999',
  },
  paymentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  paymentStatusText: {
    fontSize: 12,
    color: '#FF9800',
    marginLeft: 5,
  },
  paymentStatusSuccess: {
    color: '#4CAF50',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  viewAllText: {
    color: '#00873E',
    fontWeight: '500',
    marginRight: 5,
  },
  payButton: {
    marginTop: 20,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  payButtonGradient: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
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
    flex: 1,
  },
  retryText: {
    color: '#00873E',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#999',
  },
});

export default FeeDetailScreen;