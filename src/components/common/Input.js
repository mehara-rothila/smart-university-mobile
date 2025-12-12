import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

/**
 * Reusable Input Component
 */
const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
  icon,
  rightIcon,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  multiline = false,
  numberOfLines = 1,
  editable = true,
  style,
  inputStyle,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const getContainerStyle = () => {
    const styles = [inputStyles.container];
    if (isFocused) styles.push(inputStyles.containerFocused);
    if (error) styles.push(inputStyles.containerError);
    return styles;
  };

  return (
    <View style={[inputStyles.wrapper, style]}>
      {label && <Text style={inputStyles.label}>{label}</Text>}

      <View style={getContainerStyle()}>
        {icon && <View style={inputStyles.iconLeft}>{icon}</View>}

        <TextInput
          style={[
            inputStyles.input,
            multiline && inputStyles.inputMultiline,
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.gray400}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />

        {secureTextEntry && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={inputStyles.iconRight}
          >
            <Text style={inputStyles.passwordToggle}>
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </Text>
          </TouchableOpacity>
        )}

        {!secureTextEntry && rightIcon && (
          <View style={inputStyles.iconRight}>{rightIcon}</View>
        )}
      </View>

      {error && <Text style={inputStyles.errorText}>{error}</Text>}
    </View>
  );
};

const inputStyles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
    marginBottom: 8,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  containerFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  containerError: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.text,
    paddingVertical: 12,
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  passwordToggle: {
    fontSize: 20,
  },
  errorText: {
    fontSize: typography.fontSize.sm,
    color: colors.error,
    marginTop: 4,
  },
});

export default Input;
