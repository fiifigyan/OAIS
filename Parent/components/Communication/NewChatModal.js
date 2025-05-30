import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NewChatModal = ({ visible, onClose, onCreateChat }) => {
  const [isGroup, setIsGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState([]);

  // Mock users data - in a real app, this would come from your backend
  const users = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Mike Johnson' },
    { id: '4', name: 'Sarah Williams' },
    { id: '5', name: 'Tom Brown' },
    { id: '6', name: 'Emily Davis' },
    { id: '7', name: 'Chris Wilson' },
    { id: '8', name: 'Anna Garcia' },
    { id: '9', name: 'David Martinez' },
    { id: '10', name: 'Laura Rodriguez' }
  ];

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleParticipant = (user) => {
    if (selectedParticipants.some(p => p.id === user.id)) {
      setSelectedParticipants(prev => prev.filter(p => p.id !== user.id));
    } else {
      setSelectedParticipants(prev => [...prev, user]);
    }
  };

  const handleCreate = () => {
    if (isGroup && !groupName.trim()) {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }

    if (!isGroup && selectedParticipants.length !== 1) {
      Alert.alert('Error', 'Please select exactly one participant for a private chat');
      return;
    }

    onCreateChat(
      selectedParticipants.map(p => p.id),
      isGroup,
      isGroup ? groupName : null
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="arrow-back" size={24} color="#00873E" />
          </TouchableOpacity>
          <Text style={styles.title}>New Chat</Text>
          <TouchableOpacity onPress={handleCreate}>
            <Text style={styles.createButton}>Create</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleButton, !isGroup && styles.activeToggle]}
            onPress={() => setIsGroup(false)}
          >
            <Text style={[styles.toggleText, !isGroup && styles.activeToggleText]}>Private</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleButton, isGroup && styles.activeToggle]}
            onPress={() => setIsGroup(true)}
          >
            <Text style={[styles.toggleText, isGroup && styles.activeToggleText]}>Group</Text>
          </TouchableOpacity>
        </View>

        {isGroup && (
          <TextInput
            style={styles.input}
            placeholder="Group name"
            value={groupName}
            onChangeText={setGroupName}
          />
        )}

        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <FlatList
          data={filteredUsers}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.userItem}
              onPress={() => toggleParticipant(item)}
            >
              <Text style={styles.userName}>{item.name}</Text>
              {selectedParticipants.some(p => p.id === item.id) && (
                <Ionicons name="checkmark" size={20} color="#00873E" />
              )}
            </TouchableOpacity>
          )}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00873E',
  },
  createButton: {
    color: '#00873E',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleContainer: {
    flexDirection: 'row',
    margin: 15,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#00873E',
  },
  toggleButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  activeToggle: {
    backgroundColor: '#00873E',
  },
  toggleText: {
    color: '#00873E',
    fontWeight: 'bold',
  },
  activeToggleText: {
    color: 'white',
  },
  input: {
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchInput: {
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  userName: {
    fontSize: 16,
    color: '#333',
  },
});

export default NewChatModal;