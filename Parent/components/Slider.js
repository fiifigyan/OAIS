import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  Animated, 
  Image,
  ImageBackground
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const SLIDE_INTERVAL = 5000; // 5 seconds per slide
const SLIDE_HEIGHT = 200; // Increased height for images

const Slider = ({ events }) => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const sliderRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % events.length;
      setCurrentIndex(nextIndex);
      sliderRef.current.scrollToIndex({ index: nextIndex, animated: true });
    }, SLIDE_INTERVAL);

    return () => clearInterval(timer);
  }, [currentIndex, events.length]);

  const handleEventPress = (event) => {
    navigation.navigate('EventDetail', { eventId: event.id });
  };

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={sliderRef}
        data={events}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.slide} 
            activeOpacity={0.8}
            onPress={() => handleEventPress(item)}
          >
            {item.image ? (
              <ImageBackground 
                source={{ uri: item.image }} 
                style={styles.imageBackground}
                imageStyle={styles.imageStyle}
              >
                <View style={styles.overlay}>
                  <View style={styles.textContainer}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.date}>{item.date}</Text>
                  </View>
                </View>
              </ImageBackground>
            ) : (
              <View style={[styles.slideContent, { backgroundColor: item.color || '#000080' }]}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.date}>{item.date}</Text>
                <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      />
      
      <View style={styles.pagination}>
        {events.map((_, index) => (
          <View 
            key={index} 
            style={[
              styles.paginationDot,
              currentIndex === index && styles.activeDot
            ]} 
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: SLIDE_HEIGHT,
    marginVertical: 15,
  },
  slide: {
    width: width - 10,
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageStyle: {
    borderRadius: 12,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    padding: 15,
  },
  textContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 8,
  },
  slideContent: {
    padding: 20,
    height: '100%',
    justifyContent: 'center',
    borderRadius: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#000080',
    width: 16,
  },
});

export default Slider;