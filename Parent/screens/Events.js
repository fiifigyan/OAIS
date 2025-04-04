import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Linking, 
  Share,
  ActivityIndicator,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { fetchEventById, registerForEvent } from '../services/EventService';

const EventScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { event: initialEvent, eventId } = route.params || {};
  
  const [event, setEvent] = useState(initialEvent);
  const [loading, setLoading] = useState(!initialEvent);
  const [error, setError] = useState(null);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    if (!initialEvent && eventId) {
      loadEvent();
    }
  }, [eventId]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      const data = await fetchEventById(eventId);
      setEvent(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this event: ${event.title}\n\n${event.description}\n\nDate: ${event.date}\nLocation: ${event.location}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share event');
    }
  };

  const handleOpenLocation = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`;
    Linking.openURL(url).catch(err => Alert.alert('Error', "Couldn't open maps"));
  };

  const handleRegister = async () => {
    if (!event || event.registered) return;
    
    try {
      setRegistering(true);
      const updatedEvent = await registerForEvent(event.id, '123'); // Replace with actual student ID
      setEvent(updatedEvent);
      Alert.alert('Success', 'Registration successful!');
    } catch (err) {
      Alert.alert('Error', 'Failed to register for event');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#03AC13" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading event: {error}</Text>
        <TouchableOpacity onPress={loadEvent} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.container}>
        <Text>No event data available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#03AC13" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event Details</Text>
        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <Icon name="share-social" size={24} color="#03AC13" />
        </TouchableOpacity>
      </View>

      <Image 
        source={{ uri: event.image }} 
        style={styles.eventImage}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{event.title}</Text>
          <View style={styles.dateContainer}>
            <Icon name="calendar" size={16} color="#03AC13" />
            <Text style={styles.date}>{event.date} • {event.time}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.locationContainer} 
          onPress={handleOpenLocation}
        >
          <Icon name="location" size={18} color="#03AC13" />
          <Text style={styles.location}>{event.location}</Text>
          <Icon name="open-outline" size={16} color="#03AC13" />
        </TouchableOpacity>

        <View style={styles.categoryContainer}>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(event.category) }]}>
            <Text style={styles.categoryText}>{event.category}</Text>
          </View>
          {event.registered && (
            <View style={styles.registeredBadge}>
              <Text style={styles.registeredText}>Registered</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About This Event</Text>
          <Text style={styles.description}>{event.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Information</Text>
          <View style={styles.detailItem}>
            <Icon name="people" size={18} color="#03AC13" />
            <Text style={styles.detailText}>Open to all students and parents</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="time" size={18} color="#03AC13" />
            <Text style={styles.detailText}>Duration: {event.duration || '3 hours'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="information" size={18} color="#03AC13" />
            <Text style={styles.detailText}>Bring your student ID for entry</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[
              styles.primaryButton,
              event.registered && { backgroundColor: '#4CAF50' }
            ]} 
            onPress={handleRegister}
            disabled={event.registered || registering}
          >
            {registering ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {event.registered ? 'Already Registered' : 'Register Now'}
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Add to Calendar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const getCategoryColor = (category) => {
  switch(category.toLowerCase()) {
    case 'academic':
      return '#4CAF50';
    case 'sports':
      return '#2196F3';
    case 'cultural':
      return '#9C27B0';
    default:
      return '#03AC13';
  }
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
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
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#03AC13',
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#03AC13',
  },
  shareButton: {
    padding: 5,
  },
  eventImage: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 20,
  },
  titleContainer: {
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 16,
    color: '#666',
    marginLeft: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  location: {
    fontSize: 16,
    color: '#333',
    marginLeft: 5,
    marginRight: 5,
    flex: 1,
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  registeredBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: '#4CAF50',
  },
  registeredText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#03AC13',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    color: '#555',
    marginLeft: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
  primaryButton: {
    backgroundColor: '#03AC13',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#03AC13',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#03AC13',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EventScreen;