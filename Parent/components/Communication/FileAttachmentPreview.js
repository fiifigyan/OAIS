import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatFileSize } from '../../utils/helpers';

const FileAttachmentPreview = ({ attachments, onRemove }) => {
  if (attachments.length === 0) return null;

  return (
    <View style={styles.container}>
      <FlatList
        data={attachments}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View style={styles.fileContainer}>
            <View style={styles.fileInfo}>
              <Ionicons 
                name={item.type === 'image' ? 'image' : 'document'} 
                size={24} 
                color="#00873E" 
              />
              <View style={styles.fileDetails}>
                <Text style={styles.fileName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.fileSize}>{formatFileSize(item.size)}</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={() => onRemove(index)}
            >
              <Ionicons name="close" size={16} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingTop: 10,
    backgroundColor: 'white',
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
});

export default FileAttachmentPreview;