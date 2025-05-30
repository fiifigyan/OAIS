import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MessageMenu = ({ children, onEdit, onDelete, onReply }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View>
      <TouchableOpacity
        onLongPress={() => setMenuVisible(true)}
        onPressOut={() => setMenuVisible(false)}
      >
        {children}
      </TouchableOpacity>

      {menuVisible && (
        <View style={styles.menu}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => {
              onReply();
              setMenuVisible(false);
            }}
          >
            <Ionicons name="arrow-undo" size={20} color="#00873E" />
            <Text style={styles.menuText}>Reply</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => {
              onEdit();
              setMenuVisible(false);
            }}
          >
            <Ionicons name="create" size={20} color="#00873E" />
            <Text style={styles.menuText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => {
              onDelete();
              setMenuVisible(false);
            }}
          >
            <Ionicons name="trash" size={20} color="#e74c3c" />
            <Text style={[styles.menuText, { color: '#e74c3c' }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    bottom: 50,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    elevation: 5,
    minWidth: 150,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  menuText: {
    marginLeft: 10,
    color: '#00873E',
  },
});

export default MessageMenu;