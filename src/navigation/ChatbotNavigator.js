import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatbotScreen from '../screens/chatbot/ChatbotScreen';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator();

/**
 * Chatbot Stack Navigator
 */
const ChatbotNavigator = () => {
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
        name="ChatbotMain"
        component={ChatbotScreen}
        options={{ title: 'AI Assistant' }}
      />
    </Stack.Navigator>
  );
};

export default ChatbotNavigator;
