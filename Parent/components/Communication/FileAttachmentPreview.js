import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { formatFileSize } from '../../utils/helpers';

const FileAttachmentPreview = ({ attachments, onRemove, maxAttachments = 5 }) => {
  if (attachments.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.attachmentsLabel}>Attachments ({attachments.length}/{maxAttachments})</Text>
      <FlatList
        data={attachments.slice(0, maxAttachments)}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.fileContainer}>
            <View style={styles.fileInfo}>
              {item.isLoading ? (
                <ActivityIndicator size="small" color="#00873E" />
              ) : (
                <Ionicons 
                  name={item.type === 'image' ? 'image' : 'document'} 
                  size={24} 
                  color="#00873E" 
                />
              )}
              <View style={styles.fileDetails}>
                <Text style={styles.fileName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.fileSize}>{formatFileSize(item.size)}</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={() => onRemove(index)}
              accessibilityLabel="Remove attachment"
            >
              <Ionicons name="close" size={16} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        )}
      />
      {attachments.length > maxAttachments && (
        <Text style={styles.moreFilesText}>+{attachments.length - maxAttachments} more</Text>
      )}
    </View>
  );
};

FileAttachmentPreview.propTypes = {
  attachments: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      size: PropTypes.number,
      type: PropTypes.string,
      isLoading: PropTypes.bool,
    })
  ).isRequired,
  onRemove: PropTypes.func.isRequired,
  maxAttachments: PropTypes.number,
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingTop: 10,
    backgroundColor: 'white',
  },
  attachmentsLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 8,
    marginRight: 10,
    maxWidth: 200,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fileDetails: {
    marginLeft: 8,
    flexShrink: 1,
  },
  fileName: {
    fontSize: 12,
    color: '#333',
  },
  fileSize: {
    fontSize: 10,
    color: '#757575',
    marginTop: 2,
  },
  removeButton: {
    marginLeft: 8,
  },
  moreFilesText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
});

export default FileAttachmentPreview;