import React, { useContext, useState } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, Animated } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import { appConfig } from '../config';
import * as Haptics from 'expo-haptics';

const CustomDrawer = (props) => {
  const navigation = useNavigation();
  const { userInfo, logout } = useContext(AuthContext);
  const { profileInfo, students, userType } = useProfile();
  const [scaleValue] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleLogout = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await logout();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navigateWithHaptic = (screenName, params = {}) => {
    Haptics.selectionAsync();
    navigation.navigate(screenName, params);
  };

  const getDisplayName = () => {
    if (userType === 'student') {
      return profileInfo?.fullName || 'Student';
    }
    return profileInfo?.fullName || `${profileInfo?.firstName} ${profileInfo?.lastName}` || 'Parent';
  };

  const getSubtitle = () => {
    if (userType === 'student') {
      return profileInfo?.className ? `Class: ${profileInfo.className}` : 'No class assigned';
    }
    return profileInfo?.relationship || 'Parent/Guardian';
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView 
        {...props} 
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.drawerHeader}>
          <Image
            source={require('../assets/icons/OAIS-logo.png')}
            style={styles.logo}
          />
          <Text style={styles.appName}>{appConfig.APP_NAME}</Text>
        </View>

        <View style={styles.profileSection}>
          <Image
            source={
              profileInfo?.profileImagePath 
                ? { uri: profileInfo.profileImagePath } 
                : require('../assets/images/default-profile.png')
            }
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              {getDisplayName()}
            </Text>
            <Text style={styles.userEmail} numberOfLines={1}>
              {getSubtitle()}
            </Text>
            <TouchableOpacity 
              onPress={() => navigateWithHaptic('Profile', { 
                userId: profileInfo?.id,
                type: userType
              })}
              activeOpacity={0.7}
            >
              <View style={styles.profileButton}>
                <Text style={styles.viewProfile}>View Profile</Text>
                <Icon name="chevron-forward" size={16} color="#234F1E" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider} />
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View style={styles.drawerFooter}>
        <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
          <TouchableOpacity
            style={styles.footerItem}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={() => navigateWithHaptic('Settings')}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Icon name="settings-outline" size={20} color="#03AC13" />
            </View>
            <Text style={styles.footerItemText}>Settings</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
          <TouchableOpacity
            style={styles.footerItem}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={() => navigateWithHaptic('HelpCenter')}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Icon name="help-circle-outline" size={20} color="#03AC13" />
            </View>
            <Text style={styles.footerItemText}>Help Center</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
          <TouchableOpacity
            style={[styles.footerItem, styles.logoutItem]}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, styles.logoutIcon]}>
              <Icon name="log-out-outline" size={20} color="#ef4444" />
            </View>
            <Text style={[styles.footerItemText, styles.logoutText]}>Logout</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03AC13',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 12,
    marginRight: 12,
  },
  appName: {
    fontSize: 18,
    fontWeight: '700',
    color: 'aliceblue',
  },
  profileSection: {
    padding: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
    borderWidth: 2,
    borderColor: 'aliceblue',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'aliceblue',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewProfile: {
    fontSize: 14,
    color: '#234f1e',
    fontWeight: '500',
    marginRight: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginVertical: 8,
    marginHorizontal: 20,
  },
  drawerFooter: {
    padding: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  footerItemText: {
    fontSize: 15,
    fontWeight: '500',
    color: 'aliceblue',
  },
  logoutItem: {
    marginTop: 8,
    backgroundColor: '#fee2e2',
  },
  logoutIcon: {
    backgroundColor: '#fee2e2',
  },
  logoutText: {
    color: '#ef4444',
    fontWeight: '600',
  },
});

export default CustomDrawer;