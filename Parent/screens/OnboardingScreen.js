import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';

export const ICONS = {
  SPLASH1: require('../assets/images/welcome.png'),
  SPLASH2: require('../assets/images/updated-resume.png'),
  SPLASH3: require('../assets/images/event-updates.png'),
  SPLASH4: require('../assets/images/secure-files.png'),
}

const slides = [
  {
    key: '1',
    title: 'Welcome to RIS',
    text: 'Simplify admissions and manage school life in one place.',
    image: ICONS.SPLASH1,
    backgroundColor: '#03AC13',
  },
  {
    key: '2',
    title: 'Simplified Admissions',
    text: 'Apply for admissions and track your application easily.',
    image: ICONS.SPLASH2,
    backgroundColor: '#03AC13',
  },
  {
    key: '3',
    title: 'Stay Connected',
    text: 'Get real-time updates and stay informed.',
    image: ICONS.SPLASH3,
    backgroundColor: '#03AC13',
  },
  {
    key: '4',
    title: 'Secure Document Storage',
    text: 'Store and access important documents anytime.',
    image: ICONS.SPLASH4,
    backgroundColor: '#03AC13',
  },
];

const OnboardingScreen = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.text}>{item.text}</Text>
    </View>
  );

  const onDone = () => {
    navigation.navigate('Signup');
  };

  const onSkip = () => {
    navigation.navigate('Signup');
  };

  return (
    <AppIntroSlider
      renderItem={renderItem}
      data={slides}
      onDone={onDone}
      onSkip={onSkip}
      showSkipButton={true}
      activeDotStyle={{ backgroundColor: '#03C013' }}
      dotStyle={{ backgroundColor: 'aliceblue' }}
    />
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'aliceblue',
    textAlign: 'center',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: 'aliceblue',
    textAlign: 'center',
  },
});

export default OnboardingScreen;