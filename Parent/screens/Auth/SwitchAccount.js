import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  SafeAreaView, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator, 
  Alert,
  RefreshControl 
} from 'react-native';
import { Text, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AuthService from '../../services/AuthService';

const SwitchAccountScreen = ({ navigation }) => {
  const [accounts, setAccounts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadAccounts = async () => {
    try {
      setIsLoading(true);
      const response = await AuthService.getAccounts();
      setAccounts(response.data || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to load accounts');
      console.error('Failed to load accounts:', error);
      setAccounts([]);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAccounts();
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const filteredAccounts = accounts.filter(account => 
    account.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    account.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddAccount = () => {
    navigation.navigate('AddAccount');
  };

  const handleSelectAccount = (account) => {
    Alert.alert(
      'Switch Account', 
      `Switch to ${account.name} (${account.email})?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Switch', 
          onPress: async () => {
            try {
              // Implement actual switching logic here
              console.log('Switching to account:', account.id);
              Alert.alert('Success', 'Account switched successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to switch account');
            }
          }
        }
      ]
    );
  };

  const renderAccountItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.accountCard}
      onPress={() => handleSelectAccount(item)}
    >
      <View style={styles.accountIconContainer}>
        <Icon name="account-circle" size={36} color="#00873E" />
      </View>
      <View style={styles.accountInfo}>
        <Text style={styles.accountName}>{item.name}</Text>
        <Text style={styles.accountEmail}>{item.email}</Text>
        <Text style={styles.accountDate}>
          Added: {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <Icon name="chevron-right" size={24} color="#666" />
    </TouchableOpacity>
  );

  if (isLoading && !refreshing) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00873E" />
        <Text style={styles.loadingText}>Loading accounts...</Text>
      </SafeAreaView>
    );
  }

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
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="account-circle" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No accounts found</Text>
            {searchQuery ? (
              <Text style={styles.emptyHint}>
                No matches for "{searchQuery}"
              </Text>
            ) : (
              <Text style={styles.emptyHint}>
                You haven't added any accounts yet
              </Text>
            )}
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#00873E']}
          />
        }
      />

      <Button
        mode="contained"
        onPress={handleAddAccount}
        style={styles.addButton}
        labelStyle={styles.addButtonText}
        icon="plus"
      >
        Add New Account
      </Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 50,
    color: '#333',
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  accountIconContainer: {
    marginRight: 16,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  accountEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  accountDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  emptyHint: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#00873E',
    borderRadius: 10,
    margin: 16,
    paddingVertical: 10,
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
  },
});

export default SwitchAccountScreen;