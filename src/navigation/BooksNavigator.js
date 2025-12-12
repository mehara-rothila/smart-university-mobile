import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BooksScreen from '../screens/books/BooksScreen';
import BookDetailScreen from '../screens/books/BookDetailScreen';
import CreateBookScreen from '../screens/books/CreateBookScreen';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator();

/**
 * Books Stack Navigator
 */
const BooksNavigator = () => {
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
        name="BooksList"
        component={BooksScreen}
        options={{ title: 'Books' }}
      />
      <Stack.Screen
        name="BookDetail"
        component={BookDetailScreen}
        options={{ title: 'Book Details' }}
      />
      <Stack.Screen
        name="CreateBook"
        component={CreateBookScreen}
        options={{ title: 'Add Book' }}
      />
    </Stack.Navigator>
  );
};

export default BooksNavigator;
