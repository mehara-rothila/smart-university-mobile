import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import LoadingSpinner from '../components/common/LoadingSpinner';

/**
 * Root App Navigator
 * Switches between Auth and Main navigation based on authentication state
 */
const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading..." />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
