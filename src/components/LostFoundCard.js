import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Card from './common/Card';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { formatDate, truncateText } from '../utils/helpers';

const LostFoundCard = ({ item, onPress }) => {
  const getTypeColor = (type) => {
    return type === 'LOST' ? colors.error : colors.success;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      ELECTRONICS: '📱',
      BOOKS: '📚',
      CLOTHING: '👕',
      ACCESSORIES: '👜',
      DOCUMENTS: '📄',
      OTHER: '📦',
    };
    return icons[category] || '📦';
  };

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.typeBadge, { backgroundColor: getTypeColor(item.type) }]}>
            <Text style={styles.typeText}>{item.type}</Text>
          </View>
          {item.status && (
            <Text style={styles.statusText}>
              {item.status === 'CLAIMED' ? '✓ Claimed' : 'Available'}
            </Text>
          )}
        </View>

        {item.imageUrl && (
          <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
        )}

        <View style={styles.details}>
          <Text style={styles.icon}>{getCategoryIcon(item.category)}</Text>
          <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {truncateText(item.description, 80)}
        </Text>

        <View style={styles.footer}>
          {item.location && (
            <Text style={styles.location}>📍 {item.location}</Text>
          )}
          {item.dateReported && (
            <Text style={styles.date}>{formatDate(item.dateReported)}</Text>
          )}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  content: {
    padding: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.white,
  },
  statusText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  title: {
    flex: 1,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text,
  },
  description: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  location: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
  },
  date: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
});

export default LostFoundCard;
