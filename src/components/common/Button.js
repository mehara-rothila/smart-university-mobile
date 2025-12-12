import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

/**
 * Reusable Button Component
 */
const Button = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary', // primary, secondary, outline, danger
  size = 'medium', // small, medium, large
  icon = null,
  style,
  textStyle,
}) => {
  const getButtonStyle = () => {
    const styles = [buttonStyles.button];

    // Size styles
    if (size === 'small') styles.push(buttonStyles.buttonSmall);
    else if (size === 'large') styles.push(buttonStyles.buttonLarge);
    else styles.push(buttonStyles.buttonMedium);

    // Variant styles
    if (variant === 'primary') styles.push(buttonStyles.buttonPrimary);
    else if (variant === 'secondary') styles.push(buttonStyles.buttonSecondary);
    else if (variant === 'outline') styles.push(buttonStyles.buttonOutline);
    else if (variant === 'danger') styles.push(buttonStyles.buttonDanger);

    // Disabled state
    if (disabled || loading) styles.push(buttonStyles.buttonDisabled);

    return styles;
  };

  const getTextStyle = () => {
    const styles = [buttonStyles.text];

    // Size styles
    if (size === 'small') styles.push(buttonStyles.textSmall);
    else if (size === 'large') styles.push(buttonStyles.textLarge);

    // Variant text colors
    if (variant === 'outline') styles.push(buttonStyles.textOutline);
    else styles.push(buttonStyles.textDefault);

    return styles;
  };

  return (
    <TouchableOpacity
      style={[...getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? colors.primary : colors.white}
        />
      ) : (
        <View style={buttonStyles.content}>
          {icon && <View style={buttonStyles.icon}>{icon}</View>}
          <Text style={[...getTextStyle(), textStyle]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const buttonStyles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonSmall: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  buttonMedium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  buttonLarge: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonSecondary: {
    backgroundColor: colors.secondary,
  },
  buttonOutline: {
    backgroundColor: colors.transparent,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  buttonDanger: {
    backgroundColor: colors.error,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
  },
  textSmall: {
    fontSize: typography.fontSize.sm,
  },
  textLarge: {
    fontSize: typography.fontSize.lg,
  },
  textDefault: {
    color: colors.white,
  },
  textOutline: {
    color: colors.primary,
  },
});

export default Button;
