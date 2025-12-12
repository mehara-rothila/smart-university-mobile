import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import ErrorMessage from '../../components/common/ErrorMessage';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { isValidEmail } from '../../utils/helpers';
import { forgotPassword } from '../../api/auth';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async () => {
    // Validation
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const result = await forgotPassword(email.trim().toLowerCase());

      if (result.success) {
        Alert.alert(
          'OTP Sent',
          'A 6-digit OTP has been sent to your email. Please check your inbox.',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate('OTPVerification', { email: email.trim().toLowerCase() });
              },
            },
          ]
        );
      } else {
        setError(result.message || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Forgot password error:', err);
    } finally {
      setLoading(false);
    }
  };

  const navigateBack = () => {
    navigation.goBack();
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
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.subtitle}>
              Don't worry! Enter your email and we'll send you a code to reset your password.
            </Text>
          </View>

          {/* Illustration */}
          <View style={styles.illustration}>
            <Text style={styles.illustrationText}>🔐</Text>
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
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your registered email"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />

            <Button
              title="Send OTP"
              onPress={handleSendOTP}
              loading={loading}
              disabled={loading}
              style={styles.sendButton}
            />

            <Button
              title="Back to Login"
              onPress={navigateBack}
              variant="outline"
              disabled={loading}
              style={styles.backButton}
            />
          </View>

          {/* Info */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              💡 The OTP will be valid for 1 hour
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
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  illustration: {
    alignItems: 'center',
    marginVertical: 32,
  },
  illustrationText: {
    fontSize: 80,
  },
  form: {
    marginBottom: 24,
  },
  sendButton: {
    width: '100%',
    marginBottom: 12,
  },
  backButton: {
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
  },
});

export default ForgotPasswordScreen;
