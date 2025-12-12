import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LostFoundScreen from '../screens/lostFound/LostFoundScreen';
import LostFoundDetailScreen from '../screens/lostFound/LostFoundDetailScreen';
import CreateLostFoundScreen from '../screens/lostFound/CreateLostFoundScreen';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator();

/**
 * Lost & Found Stack Navigator
 */
const LostFoundNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen
        name="LostFoundList"
        component={LostFoundScreen}
        options={{ title: 'Lost & Found' }}
      />
      <Stack.Screen
        name="LostFoundDetail"
        component={LostFoundDetailScreen}
        options={{ title: 'Item Details' }}
      />
      <Stack.Screen
        name="CreateLostFound"
        component={CreateLostFoundScreen}
        options={{ title: 'Post Item' }}
      />
    </Stack.Navigator>
  );
};

export default LostFoundNavigator;
