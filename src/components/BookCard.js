import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from './common/Card';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { truncateText } from '../utils/helpers';

const BookCard = ({ book, onPress }) => {
  const getTypeColor = (type) => {
    const typeColors = {
      SELL: colors.accent,
      DONATE: colors.success,
      EXCHANGE: colors.info,
    };
    return typeColors[type] || colors.gray500;
  };

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.typeBadge, { backgroundColor: getTypeColor(book.bookType) }]}>
            <Text style={styles.typeText}>{book.bookType}</Text>
          </View>
          {book.price && book.bookType === 'SELL' && (
            <Text style={styles.price}>${book.price}</Text>
          )}
        </View>

        <Text style={styles.title} numberOfLines={2}>{book.title}</Text>

        {book.author && (
          <Text style={styles.author}>by {book.author}</Text>
        )}

        {book.description && (
          <Text style={styles.description} numberOfLines={2}>
            {truncateText(book.description, 80)}
          </Text>
        )}

        <View style={styles.footer}>
          {book.ownerName && (
            <View style={styles.owner}>
              <Text style={styles.icon}>👤</Text>
              <Text style={styles.ownerText}>{book.ownerName}</Text>
            </View>
          )}
          {book.condition && (
            <Text style={styles.condition}>{book.condition}</Text>
          )}
        </View>

        {book.downloadCount !== undefined && (
          <Text style={styles.downloads}>📥 {book.downloadCount} downloads</Text>
        )}
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
  price: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.accent,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text,
    marginBottom: 4,
  },
  author: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: 8,
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
  owner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 16,
    marginRight: 4,
  },
  ownerText: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
  },
  condition: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  downloads: {
    fontSize: typography.fontSize.xs,
    color: colors.textLight,
    marginTop: 8,
  },
});

export default BookCard;
