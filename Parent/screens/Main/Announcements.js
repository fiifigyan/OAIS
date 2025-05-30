import React, { useState, useEffect } from 'react';
import { 
  View, 
  FlatList, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  SafeAreaView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAnnouncements } from '../../services/CommService';

const AnnouncementsScreen = ({ navigation }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAnnouncements = async () => {
  // Mock data for development
  return [
    {
      id: 1,
      title: "System Maintenance",
      content: "There will be a scheduled maintenance on June 20th from 2-4 AM.",
      date: "2023-06-15T00:00:00Z"
    },
    {
      id: 2,
      title: "New Features",
      content: "We've added new features to the app. Check them out!",
      date: "2023-06-10T00:00:00Z"
    }
  ];
};

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await getAnnouncements();
        setAnnouncements(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch announcements', err);
        setError('Failed to load announcements. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#00873E" />
        </TouchableOpacity>
        <Text style={styles.title}>Announcements</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#00873E" />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="warning" size={40} color="#FFA500" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setLoading(true);
              setError(null);
              fetchAnnouncements();
            }}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={announcements}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.announcementCard}>
              <View style={styles.announcementHeader}>
                <View style={styles.announcementIcon}>
                  <Ionicons name="megaphone" size={20} color="white" />
                </View>
                <Text style={styles.announcementTitle}>{item.title}</Text>
              </View>
              <Text style={styles.announcementDate}>
                {new Date(item.date).toLocaleDateString()}
              </Text>
              <Text style={styles.announcementContent}>{item.content}</Text>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="megaphone" size={50} color="#e0e0e0" />
              <Text style={styles.emptyText}>No announcements yet</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00873E',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#333',
    marginVertical: 15,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#00873E',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
  },
  announcementCard: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  announcementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  announcementIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFA500',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  announcementDate: {
    fontSize: 12,
    color: '#757575',
    marginLeft: 40,
    marginBottom: 10,
  },
  announcementContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
    marginTop: 15,
  },
});

export default AnnouncementsScreen;