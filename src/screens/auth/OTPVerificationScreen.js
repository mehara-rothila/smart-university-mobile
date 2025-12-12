import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import ErrorMessage from '../../components/common/ErrorMessage';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { isValidPassword } from '../../utils/helpers';
import { resetPassword, forgotPassword } from '../../api/auth';

const OTPVerificationScreen = ({ route, navigation }) => {
  const { email } = route.params;
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');

  const handleResetPassword = async () => {
    // Validation
    if (!otp.trim()) {
      setError('Please enter the OTP code');
      return;
    }

    if (otp.trim().length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    if (!newPassword) {
      setError('Please enter a new password');
      return;
    }

    if (!isValidPassword(newPassword)) {
      setError('Password must be at least 8 characters with letters and numbers');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const result = await resetPassword(email, otp.trim(), newPassword);

      if (result.success) {
        Alert.alert(
          'Success',
          'Your password has been reset successfully. Please login with your new password.',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate('Login');
              },
            },
          ]
        );
      } else {
        setError(result.message || 'Failed to reset password. Please check your OTP and try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Reset password error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResending(true);
    setError('');

    try {
      const result = await forgotPassword(email);

      if (result.success) {
        Alert.alert('OTP Sent', 'A new OTP has been sent to your email.');
      } else {
        setError(result.message || 'Failed to resend OTP');
      }
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
      console.error('Resend OTP error:', err);
    } finally {
      setResending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Enter OTP</Text>
            <Text style={styles.subtitle}>
              We've sent a 6-digit code to{'\n'}
              <Text style={styles.email}>{email}</Text>
            </Text>
          </View>

          {/* Illustration */}
          <View style={styles.illustration}>
            <Text style={styles.illustrationText}>📧</Text>
          </View>

          {/* Error Message */}
          {error && (
            <ErrorMessage
              message={error}
              onRetry={() => setError('')}
              retryText="Dismiss"
            />
          )}

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="OTP Code"
              value={otp}
              onChangeText={setOtp}
              placeholder="Enter 6-digit code"
              keyboardType="number-pad"
              maxLength={6}
              editable={!loading}
            />

            <Input
              label="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter new password"
              secureTextEntry
              editable={!loading}
            />

            <Input
              label="Confirm New Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
              secureTextEntry
              editable={!loading}
            />

            <Button
              title="Reset Password"
              onPress={handleResetPassword}
              loading={loading}
              disabled={loading || resending}
              style={styles.resetButton}
            />

            <Button
              title="Resend OTP"
              onPress={handleResendOTP}
              variant="outline"
              loading={resending}
              disabled={loading || resending}
              style={styles.resendButton}
            />
          </View>

          {/* Info */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              💡 Didn't receive the code? Check your spam folder or click "Resend OTP"
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    marginTop: 40,
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  email: {
    fontWeight: typography.fontWeight.semiBold,
    color: colors.primary,
  },
  illustration: {
    alignItems: 'center',
    marginVertical: 24,
  },
  illustrationText: {
    fontSize: 64,
  },
  form: {
    marginBottom: 24,
  },
  resetButton: {
    width: '100%',
    marginBottom: 12,
  },
  resendButton: {
    width: '100%',
  },
  infoContainer: {
    backgroundColor: colors.gray50,
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  infoText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default OTPVerificationScreen;
