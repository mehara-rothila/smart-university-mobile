import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';

/**
 * Reusable Card Component
 */
const Card = ({
  children,
  onPress,
  style,
  elevation = 2,
  padding = 16,
}) => {
  const cardStyle = [
    styles.card,
    {
      padding,
      elevation,
      shadowOpacity: elevation * 0.05,
    },
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
    elevation: 2,
  },
});

export default Card;
