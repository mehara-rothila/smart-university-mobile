import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

/**
 * Reusable Loading Spinner Component
 */
const LoadingSpinner = ({
  size = 'large',
  color = colors.primary,
  message,
  fullScreen = false,
  style,
}) => {
  const containerStyle = [
    styles.container,
    fullScreen && styles.fullScreen,
    style,
  ];

  return (
    <View style={containerStyle}>
      <ActivityIndicator size={size} color={color} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  message: {
    marginTop: 12,
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default LoadingSpinner;
