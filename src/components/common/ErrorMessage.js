import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

/**
 * Reusable Error Message Component
 */
const ErrorMessage = ({
  message,
  onRetry,
  retryText = 'Try Again',
  style,
}) => {
  if (!message) return null;

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.errorIcon}>⚠️</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryText}>{retryText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.error + '10',
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    alignItems: 'center',
  },
  errorIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  message: {
    fontSize: typography.fontSize.base,
    color: colors.error,
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: colors.error,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  retryText: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
  },
});

export default ErrorMessage;
