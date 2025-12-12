import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import useWebSocket from '../hooks/useWebSocket';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import LoadingSpinner from '../components/common/LoadingSpinner';

/**
 * Root App Navigator
 * Switches between Auth and Main navigation based on authentication state
 */
const AppNavigator = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const queryClient = useQueryClient();

  // Handle incoming WebSocket notifications
  const handleNotificationReceived = (notification) => {
    console.log('New notification received:', notification);

    // Invalidate notifications query to refresh the list
    queryClient.invalidateQueries(['notifications']);

    // Optionally invalidate other queries based on notification type
    if (notification.type === 'EVENT') {
      queryClient.invalidateQueries(['upcomingEvents']);
      queryClient.invalidateQueries(['events']);
    } else if (notification.type === 'ACHIEVEMENT') {
      queryClient.invalidateQueries(['achievements']);
    } else if (notification.type === 'BOOK_REQUEST') {
      queryClient.invalidateQueries(['bookRequests']);
    } else if (notification.type === 'LOST_FOUND') {
      queryClient.invalidateQueries(['lostFoundItems']);
    }
  };

  // Connect to WebSocket when authenticated
  const { isConnected } = useWebSocket(
    isAuthenticated ? user?.id : null,
    handleNotificationReceived
  );

  useEffect(() => {
    if (isAuthenticated && isConnected) {
      console.log('WebSocket connected for user:', user?.id);
    }
  }, [isAuthenticated, isConnected, user?.id]);

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
