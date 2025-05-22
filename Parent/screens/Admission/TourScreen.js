import React, { useState, useEffect, useRef } from 'react';
import { Video } from 'expo-av';
import { View, Text, TouchableOpacity, Animated, SafeAreaView, StyleSheet, Dimensions, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const tourData = [
  {
    title: 'Campus Overview',
    description: 'Explore our beautiful school environment with a 360° virtual tour.',
    video: require('../../assets/videos/campus-overview.mp4'),
    icon: 'school-outline',
    color: '#4caf50',
  },
  {
    title: 'Facilities Highlights',
    description: 'Discover our well-equipped library, science labs, and sports facilities.',
    video: require('../../assets/videos/facilities.mp4'),
    icon: 'library-outline',
    color: '#2196f3',
  },
  {
    title: 'Academic Programs',
    description: 'Learn about our diverse academic programs, including STEM and Arts.',
    video: require('../../assets/videos/academics.mp4'),
    icon: 'book-outline',
    color: '#9c27b0',
  },
  {
    title: 'Safety and Security',
    description: 'We prioritize the safety of every child with top-notch security systems.',
    video: require('../../assets/videos/security.mp4'),
    icon: 'shield-checkmark-outline',
    color: '#ff9800',
  },
  {
    title: 'Teacher Profiles',
    description: 'Meet some of our highly qualified and dedicated teachers.',
    video: require('../../assets/videos/teacher.mp4'),
    icon: 'people-outline',
    color: '#e91e63',
  },
  {
    title: 'School Events',
    description: 'Check out our recent events and outstanding achievements.',
    video: require('../../assets/videos/achievements.mp4'),
    icon: 'trophy-outline',
    color: '#00bcd4',
  },
  {
    title: 'Enrollment Process',
    description: 'Understand the simple steps to enroll your child in our school.',
    video: require('../../assets/videos/enrollment.mp4'),
    icon: 'document-text-outline',
    color: '#673ab7',
  },
];

const TourScreen = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const nextSlide = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % tourData.length);
      slideAnim.setValue(width);
      animateSlideIn();
    });
  };

  const prevSlide = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + tourData.length) % tourData.length);
      slideAnim.setValue(-width);
      animateSlideIn();
    });
  };

  const animateSlideIn = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const togglePlayPause = async () => {
    if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const skipTour = () => {
    navigation.navigate('Admission');
  };

  const handleEnroll = () => {
    navigation.navigate('Admission');
  };

  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(0);
    animateSlideIn();
    return () => {
      if (videoRef.current) {
        videoRef.current.unloadAsync();
      }
    };
  }, [currentIndex]);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View 
        style={[
          styles.slideContainer,
          { transform: [{ translateX: slideAnim }], opacity: fadeAnim }
        ]}
      >
        <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            source={tourData[currentIndex].video}
            style={styles.video}
            resizeMode="cover"
            isLooping
            shouldPlay={isPlaying}
            isMuted={false}
          />
          <TouchableOpacity 
            style={styles.playButton} 
            onPress={togglePlayPause}
            activeOpacity={0.8}
          >
            <Icon 
              name={isPlaying ? "pause" : "play"} 
              size={36} 
              color="#fff" 
            />
          </TouchableOpacity>
        </View>

        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'transparent']}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: tourData[currentIndex].color }]}>
              <Icon name={tourData[currentIndex].icon} size={24} color="#fff" />
            </View>
            <Text style={styles.title}>{tourData[currentIndex].title}</Text>
          </View>
        </LinearGradient>

        <View style={styles.contentContainer}>
          <Text style={styles.description}>{tourData[currentIndex].description}</Text>
          
          <View style={styles.progressContainer}>
            {tourData.map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.progressDot,
                  index === currentIndex && styles.activeDot,
                  index === currentIndex && { backgroundColor: tourData[currentIndex].color }
                ]}
              />
            ))}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.navButton, currentIndex === 0 && styles.buttonDisabled]}
              onPress={prevSlide}
              disabled={currentIndex === 0}
              activeOpacity={0.7}
            >
              <Icon name="chevron-back" size={24} color={currentIndex === 0 ? '#ccc' : '#000080'} />
              <Text style={[styles.navButtonText, currentIndex === 0 && { color: '#ccc' }]}>
                Previous
              </Text>
            </TouchableOpacity>

            {currentIndex === tourData.length - 1 ? (
              <TouchableOpacity 
                style={[styles.enrollButton, { backgroundColor: tourData[currentIndex].color }]}
                onPress={handleEnroll}
                activeOpacity={0.7}
              >
                <Text style={styles.enrollButtonText}>Enroll Now</Text>
                <Icon name="arrow-forward" size={20} color="#fff" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.navButton, { flexDirection: 'row-reverse' }]}
                onPress={nextSlide}
                activeOpacity={0.7}
              >
                <Icon name="chevron-forward" size={24} color="#000080" />
                <Text style={styles.navButtonText}>Next</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Animated.View>

      <TouchableOpacity 
        style={styles.skipButton} 
        onPress={skipTour}
        activeOpacity={0.7}
      >
        <Text style={styles.skipText}>Skip Tour</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  slideContainer: {
    flex: 1,
    width: '100%',
  },
  videoContainer: {
    width: '100%',
    height: height * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    flexShrink: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 25,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    marginBottom: 30,
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 5,
  },
  activeDot: {
    width: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000080',
    marginHorizontal: 5,
  },
  enrollButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  enrollButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 10,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  skipButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    padding: 10,
  },
  skipText: {
    color: '#000080',
    fontSize: 16,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});

export default TourScreen;