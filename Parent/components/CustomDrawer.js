import React, { useContext, useState } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, Animated } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';
import { appConfig } from '../config';
import * as Haptics from 'expo-haptics';

const CustomDrawer = (props) => {
  const navigation = useNavigation();
  const { userInfo, logout } = useContext(AuthContext);
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
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navigateWithHaptic = (screenName) => {
    Haptics.selectionAsync();
    navigation.navigate(screenName);
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
            source={userInfo?.profileImageUrl || require('../assets/images/fiifi1.jpg')}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              {userInfo?.fname || 'John Doe'}
            </Text>
            <Text style={styles.userEmail} numberOfLines={1}>
              {userInfo?.email || 'user@example.com'}
            </Text>
            <TouchableOpacity 
              onPress={() => navigateWithHaptic('Student')}
              activeOpacity={0.7}
            >
              <View style={styles.profileButton}>
                <Text style={styles.viewProfile}>View Profile</Text>
                <Icon name="chevron-forward" size={16} color="#6366f1" />
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
              <Icon name="settings-outline" size={20} color="#6366f1" />
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
              <Icon name="help-circle-outline" size={20} color="#6366f1" />
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
    backgroundColor: '#ffffff',
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
    color: '#111827',
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
    borderColor: '#e0e7ff',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
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
    color: '#6366f1',
    fontWeight: '500',
    marginRight: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginVertical: 8,
    marginHorizontal: 20,
  },
  drawerItem: {
    // borderRadius: 12,
    // marginHorizontal: 10,
    // marginVertical: 4,
  },
  drawerLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
    // marginLeft: -16,
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
    color: '#374151',
  },
  logoutItem: {
    marginTop: 8,
  },
  logoutIcon: {
    backgroundColor: '#fee2e2',
  },
  logoutText: {
    color: '#ef4444',
  },
});

export default CustomDrawer;