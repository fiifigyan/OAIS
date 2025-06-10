import React, { useContext, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  ActivityIndicator, 
  RefreshControl, 
  TouchableOpacity 
} from 'react-native';
import { AdmissionContext } from '../../context/AdmissionContext';
import Icon from 'react-native-vector-icons/Ionicons';

const STATUS_COLORS = {
  pending: '#FFA500',
  approved: '#4CAF50',
  rejected: '#F44336',
  review: '#2196F3',
  processed: '#9C27B0'
};

const STATUS_ICONS = {
  pending: 'time-outline',
  approved: 'checkmark-circle-outline',
  rejected: 'close-circle-outline',
  review: 'document-text-outline',
  processed: 'shield-checkmark-outline'
};

const AdmissionStatus = ({ route }) => {
  const { getAdmissionStatus, getAdmissionStatusById } = useContext(AdmissionContext);
  const [admissionData, setAdmissionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const { applicationId } = route.params || {};

  const fetchAdmissionStatus = async () => {
    try {
      setError(null);
      setIsLoading(true);
      setRefreshing(true);

      let data;
      if (applicationId) {
        data = await getAdmissionStatusById(applicationId);
        setAdmissionData(data);
      } else {
        data = await getAdmissionStatus();
        setAdmissionData(Array.isArray(data) ? data : [data]);
      }
    } catch (error) {
      setError(error.message);
      setAdmissionData(null);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAdmissionStatus();
  }, [applicationId]);

  const renderStatusTimeline = (admission) => {
    const status = admission?.status?.toLowerCase() || 'pending';
    const stages = [
      { id: 'submitted', label: 'Submitted', active: true },
      { id: 'review', label: 'Under Review', active: ['review', 'processed', 'approved', 'rejected'].includes(status) },
      { id: 'processed', label: 'Processed', active: ['processed', 'approved', 'rejected'].includes(status) },
      { id: 'completed', label: 'Completed', active: ['approved', 'rejected'].includes(status) }
    ];

    return (
      <View style={styles.timelineContainer}>
        {stages.map((stage, index) => (
          <View key={stage.id} style={styles.timelineItem}>
            <View style={[
              styles.timelineDot,
              { 
                backgroundColor: stage.active ? STATUS_COLORS[status] || '#999' : '#e0e0e0',
                borderColor: stage.active ? STATUS_COLORS[status] || '#999' : '#e0e0e0'
              }
            ]}>
              {stage.active && (
                <Icon 
                  name={STATUS_ICONS[status] || 'checkmark-outline'} 
                  size={16} 
                  color="#fff" 
                />
              )}
            </View>
            <Text style={[
              styles.timelineLabel,
              { color: stage.active ? '#333' : '#999' }
            ]}>
              {stage.label}
            </Text>
            {index < stages.length - 1 && (
              <View style={[
                styles.timelineConnector,
                { backgroundColor: stage.active ? STATUS_COLORS[status] || '#999' : '#e0e0e0' }
              ]} />
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderStatusDetails = (admission) => {
    const status = admission?.status?.toLowerCase() || 'pending';
    const submissionDate = admission?.submissionDate 
      ? new Date(admission.submissionDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      : 'N/A';

    return (
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Icon name="document-text-outline" size={18} color="#333" />
          <Text style={[styles.detailLabel, { color: '#333' }]}>Reference:</Text>
          <Text style={[styles.detailValue, { color: '#333' }]}>
            {admission.refNumber || 'N/A'}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Icon name="calendar-outline" size={18} color="#333" />
          <Text style={[styles.detailLabel, { color: '#333' }]}>Submitted:</Text>
          <Text style={[styles.detailValue, { color: '#333' }]}>
            {submissionDate}
          </Text>
        </View>

        {admission.processedDate && (
          <View style={styles.detailRow}>
            <Icon name="checkmark-circle-outline" size={18} color="#333" />
            <Text style={[styles.detailLabel, { color: '#333' }]}>Processed:</Text>
            <Text style={[styles.detailValue, { color: '#333' }]}>
              {new Date(admission.processedDate).toLocaleDateString()}
            </Text>
          </View>
        )}

        <View style={styles.statusBadgeContainer}>
          <View style={[
            styles.statusBadge, 
            { backgroundColor: `${STATUS_COLORS[status]}20`, borderColor: STATUS_COLORS[status] }
          ]}>
            <Text style={[styles.statusText, { color: STATUS_COLORS[status] }]}>
              {formatStatus(admission.status)}
            </Text>
          </View>
        </View>

        {admission.comments && (
          <View style={styles.commentsContainer}>
            <Text style={[styles.commentsLabel, { color: '#333' }]}>
              <Icon name="information-circle-outline" size={16} color="#333" /> 
              {' '}Administrator Comments:
            </Text>
            <Text style={[styles.commentsText, { color: '#333' }]}>
              {admission.comments}
            </Text>
          </View>
        )}
      </View>
    );
  };

  if (isLoading && !admissionData) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#00873E" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={fetchAdmissionStatus}
          colors={["#00873E"]}
        />
      }
    >
      {error && (
        <View style={styles.errorContainer}>
          <Icon name="warning-outline" size={24} color="#D32F2F" />
          <Text style={[styles.errorText, { color: '#D32F2F' }]}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchAdmissionStatus}
          >
            <Text style={[styles.retryText, { color: '#00873E' }]}>
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {admissionData ? (
        <View style={styles.contentContainer}>
          <Text style={[styles.title, { color: '#333' }]}>
            {applicationId ? 'Application Details' : 'My Applications'}
          </Text>

          {Array.isArray(admissionData) ? (
            admissionData.map((app, index) => (
              <View key={app.id || index} style={styles.applicationCard}>
                {renderStatusTimeline(app)}
                {renderStatusDetails(app)}
              </View>
            ))
          ) : (
            <View style={styles.applicationCard}>
              {renderStatusTimeline(admissionData)}
              {renderStatusDetails(admissionData)}
            </View>
          )}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Icon name="document-outline" size={48} color="#999" />
          <Text style={[styles.emptyText, { color: '#00873E' }]}>
            {applicationId ? 'Application not found' : 'No applications found'}
          </Text>
          <Text style={[styles.emptySubtext, { color: '#999' }]}>
            {applicationId ? 'Please check the application ID' : 'Submit an application to view status'}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const formatStatus = (status) => {
  if (!status) return 'Pending Review';
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  applicationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  timelineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timelineItem: {
    alignItems: 'center',
    flex: 1,
  },
  timelineDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  timelineLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  timelineConnector: {
    position: 'absolute',
    top: 13,
    left: '50%',
    right: '-50%',
    height: 2,
    zIndex: -1,
  },
  detailsContainer: {
    marginTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    width: 90,
  },
  detailValue: {
    fontSize: 14,
    flex: 1,
  },
  statusBadgeContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  statusBadge: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  commentsContainer: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    backgroundColor: '#f8f9fa',
  },
  commentsLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  commentsText: {
    fontSize: 14,
    lineHeight: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  errorContainer: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#ffebee',
    borderColor: '#ef9a9a',
    borderWidth: 1,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 8,
  },
  retryButton: {
    marginTop: 8,
  },
  retryText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AdmissionStatus;