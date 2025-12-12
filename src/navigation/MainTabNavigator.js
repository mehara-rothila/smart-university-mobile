import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/home/HomeScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const Tab = createBottomTabNavigator();

/**
 * Main Tab Navigator
 * Bottom tab navigation for authenticated users
 */
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: typography.fontWeight.semiBold,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray400,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: typography.fontSize.sm,
          fontWeight: typography.fontWeight.medium,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <HomeIcon color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <ProfileIcon color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Simple icon components (using emoji for now)
const HomeIcon = ({ color, size }) => (
  <Text style={{ fontSize: size, color }}>🏠</Text>
);

const ProfileIcon = ({ color, size }) => (
  <Text style={{ fontSize: size, color }}>👤</Text>
);

export default MainTabNavigator;
