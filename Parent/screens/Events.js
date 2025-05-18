import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking, Share, ActivityIndicator, Alert, SafeAreaView, Dimensions, Platform, PermissionsAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import { addEventToCalendar } from '../utils/calendar';

const { width } = Dimensions.get('window');

// Initialize Geocoder with your Google Maps API key
Geocoder.init('GOOGLE_MAPS_API_KEY', { language: 'en' });

const EventScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { event } = route.params || {};
  
  const [registering, setRegistering] = useState(false);
  const [addingToCalendar, setAddingToCalendar] = useState(false);
  const [mapRegion, setMapRegion] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);
  const [loadingMap, setLoadingMap] = useState(true);

  useEffect(() => {
    if (event?.location) {
      checkLocationPermission();
      geocodeLocation(event.location);
    }
  }, [event]);

  const checkLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        setLocationPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
      } catch (err) {
        console.warn(err);
        setLocationPermission(false);
      }
    } else {
      try {
        const { status } = await MapView.requestPermissions();
        setLocationPermission(status === 'granted');
      } catch (e) {
        setLocationPermission(false);
      }
    }
  };

  const geocodeLocation = async (address) => {
    try {
      setLoadingMap(true);
      const response = await Geocoder.from(address);
      const { lat, lng } = response.results[0].geometry.location;
      
      setMapRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (error) {
      console.error('Geocoding error:', error);
      // Fallback coordinates if geocoding fails
      setMapRegion({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } finally {
      setLoadingMap(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this event: ${event.title}\n\n${event.description}\n\nDate: ${event.date}\nTime: ${event.time}\nLocation: ${event.location}`,
        title: event.title,
        url: event.image || 'https://your-school-website.com/events',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share event');
    }
  };

  const handleOpenMaps = () => {
    if (!event?.location) return;
    
    const url = Platform.select({
      ios: `maps://?q=${encodeURIComponent(event.location)}`,
      android: `geo:0,0?q=${encodeURIComponent(event.location)}`,
    });
    
    Linking.openURL(url).catch(err => {
      // Fallback to web Google Maps
      const webUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`;
      Linking.openURL(webUrl).catch(() => 
        Alert.alert('Error', "Couldn't open maps")
      );
    });
  };

  const handleRegister = async () => {
    if (!event || event.registered) return;
    
    try {
      setRegistering(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      Alert.alert('Success', 'Registration successful!');
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to register for event');
    } finally {
      setRegistering(false);
    }
  };

  const handleAddToCalendar = async () => {
    try {
      setAddingToCalendar(true);
      await addEventToCalendar(event);
      Alert.alert('Success', 'Event added to your calendar');
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to add to calendar');
    } finally {
      setAddingToCalendar(false);
    }
  };

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Icon name="alert-circle-outline" size={48} color="#03AC13" />
          <Text style={styles.emptyText}>No event data available</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#03AC13" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <Icon name="share-variant" size={24} color="#03AC13" />
        </TouchableOpacity>
      </View>

      <Animatable.View animation="fadeIn" duration={500}>
        <Image 
          source={{ uri: event.image || 'https://via.placeholder.com/800x400?text=Event+Image' }} 
          style={styles.eventImage}
          resizeMode="cover"
        />
      </Animatable.View>

      <View style={styles.content}>
        <Animatable.View animation="fadeInUp" delay={200} style={styles.titleContainer}>
          <Text style={styles.title}>{event.title}</Text>
          <View style={styles.dateContainer}>
            <Icon name="calendar" size={18} color="#03AC13" />
            <Text style={styles.date}>
              {new Date(event.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
              {' • '}
              {event.time}
            </Text>
          </View>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={300}>
          <TouchableOpacity 
            style={styles.locationContainer} 
            onPress={handleOpenMaps}
          >
            <Icon name="map-marker" size={20} color="#03AC13" />
            <Text style={styles.location}>{event.location}</Text>
            <Icon name="open-in-new" size={18} color="#03AC13" />
          </TouchableOpacity>
        </Animatable.View>

        {loadingMap ? (
          <View style={[styles.mapContainer, styles.loadingMap]}>
            <ActivityIndicator size="large" color="#03AC13" />
          </View>
        ) : mapRegion && (
          <Animatable.View animation="fadeInUp" delay={400} style={styles.mapContainer}>
            <MapView
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              region={mapRegion}
              scrollEnabled={false}
              zoomEnabled={false}
              loadingEnabled={true}
              loadingIndicatorColor="#03AC13"
              loadingBackgroundColor="#f5f5f5"
              showsUserLocation={locationPermission}
              showsMyLocationButton={false}
            >
              <Marker 
                coordinate={mapRegion}
                title={event.title}
                description={event.location}
              >
                <View style={styles.marker}>
                  <Icon name="map-marker" size={40} color="#03AC13" />
                </View>
              </Marker>
            </MapView>
          </Animatable.View>
        )}

        <Animatable.View animation="fadeInUp" delay={500} style={styles.section}>
          <Text style={styles.sectionTitle}>About This Event</Text>
          <Text style={styles.description}>{event.description}</Text>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={600} style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleRegister}
            disabled={registering}
          >
            {registering ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Icon name="calendar-check" size={20} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Register Now</Text>
              </>
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={handleAddToCalendar}
            disabled={addingToCalendar}
          >
            {addingToCalendar ? (
              <ActivityIndicator color="#03AC13" />
            ) : (
              <>
                <Icon name="calendar-plus" size={20} color="#03AC13" style={styles.buttonIcon} />
                <Text style={styles.secondaryButtonText}>Add to Calendar</Text>
              </>
            )}
          </TouchableOpacity>
        </Animatable.View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#03AC13',
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
    padding: 8,
  },
  shareButton: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
    padding: 8,
  },
  eventImage: {
    width: '100%',
    height: width * 0.6,
  },
  content: {
    padding: 20,
  },
  titleContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
  location: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
    marginRight: 10,
    flex: 1,
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  loadingMap: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#03AC13',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
  buttonContainer: {
    marginTop: 20,
  },
  primaryButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#03AC13',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#03AC13',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    overflow: 'hidden',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  secondaryButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#03AC13',
    padding: 16,
    borderRadius: 12,
  },
  secondaryButtonText: {
    color: '#03AC13',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  marker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default EventScreen;