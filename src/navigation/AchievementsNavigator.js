import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AchievementsScreen from '../screens/achievements/AchievementsScreen';
import AchievementDetailScreen from '../screens/achievements/AchievementDetailScreen';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator();

/**
 * Achievements Stack Navigator
 */
const AchievementsNavigator = () => {
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
        name="AchievementsList"
        component={AchievementsScreen}
        options={{ title: 'Achievements' }}
      />
      <Stack.Screen
        name="AchievementDetail"
        component={AchievementDetailScreen}
        options={{ title: 'Achievement Details' }}
      />
    </Stack.Navigator>
  );
};

export default AchievementsNavigator;
