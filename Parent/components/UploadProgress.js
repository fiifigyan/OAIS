import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

/**
 * Component to display file upload progress
 * @param {Object} props - Component props
 * @param {number} props.progress - Upload progress (0-100)
 * @param {string} props.status - Upload status ('uploading', 'success', 'error', 'compressing')
 * @param {string} props.filename - Name of the file being uploaded
 */
const UploadProgress = ({ progress = 0, status = 'uploading', filename = '' }) => {
  // Determine colors based on status
  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return '#4CAF50';
      case 'error':
        return '#F44336';
      case 'compressing':
        return '#FF9800';
      default:
        return '#2196F3';
    }
  };

  // Get status message
  const getStatusMessage = () => {
    switch (status) {
      case 'success':
        return 'Upload complete';
      case 'error':
        return 'Upload failed';
      case 'compressing':
        return 'Compressing file...';
      default:
        return `Uploading (${Math.round(progress)}%)`;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressInfo}>
        <Text style={styles.filename} numberOfLines={1} ellipsizeMode="middle">
          {filename}
        </Text>
        <Text style={[styles.statusText, { color: getStatusColor() }]}>
          {getStatusMessage()}
        </Text>
      </View>
      
      <View style={styles.progressBarContainer}>
        <View 
          style={[
            styles.progressBar, 
            { 
              width: `${progress}%`,
              backgroundColor: getStatusColor()
            }
          ]} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#2196F3',
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  filename: {
    fontSize: 12,
    color: '#555',
    flex: 1,
    marginRight: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  }
});

export default UploadProgress;
