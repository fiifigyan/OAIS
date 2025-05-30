import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SwitchAccountScreen = ({ navigation }) => {
  const [accounts, setAccounts] = useState([
    { id: '1', name: 'Account 1', email: 'account1@example.com' },
    { id: '2', name: 'Account 2', email: 'account2@example.com' },
  ]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAccounts = accounts.filter((account) =>
    account.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddAccount = () => {
    navigation.navigate('AddAccount');
  };

  const renderAccountItem = ({ item }) => (
    <TouchableOpacity style={styles.item}>
      <Icon name="account-circle" size={40} color="#00873E" style={styles.accountIcon} />
      <View style={styles.accountInfo}>
        <Text style={styles.itemText}>{item.name}</Text>
        <Text style={styles.itemEmail}>{item.email}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search accounts..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        data={filteredAccounts}
        renderItem={renderAccountItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddAccount}>
        <Icon name="add" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Add New Account</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SwitchAccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    color: '#333',
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  accountIcon: {
    marginRight: 15,
  },
  accountInfo: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemEmail: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00873E',
    borderRadius: 10,
    padding: 15,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});