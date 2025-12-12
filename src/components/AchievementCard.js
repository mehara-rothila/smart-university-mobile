import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Card from './common/Card';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { formatDate, truncateText } from '../utils/helpers';

/**
 * Achievement Card Component
 * Displays achievement information in a card format
 */
const AchievementCard = ({ achievement, onPress }) => {
  const getCategoryColor = (category) => {
    const categoryColors = {
      ACADEMIC: colors.primary,
      SPORTS: colors.accent,
      CULTURAL: colors.secondary,
      TECHNICAL: colors.info,
      SOCIAL: colors.success,
      OTHER: colors.gray500,
    };
    return categoryColors[category] || colors.gray500;
  };

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.content}>
        {/* Image */}
        {achievement.imageUrl && (
          <Image
            source={{ uri: achievement.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        )}

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>
            {achievement.title}
          </Text>
        </View>

        {/* Description */}
        <Text style={styles.description} numberOfLines={3}>
          {truncateText(achievement.description, 120)}
        </Text>

        {/* Student Info */}
        {achievement.studentName && (
          <View style={styles.studentContainer}>
            <Text style={styles.icon}>👤</Text>
            <Text style={styles.studentText}>{achievement.studentName}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: getCategoryColor(achievement.category) },
            ]}
          >
            <Text style={styles.categoryText}>
              {achievement.category || 'OTHER'}
            </Text>
          </View>

          <View style={styles.statsContainer}>
            {achievement.likesCount !== undefined && (
              <View style={styles.stat}>
                <Text style={styles.icon}>❤️</Text>
                <Text style={styles.statText}>{achievement.likesCount}</Text>
              </View>
            )}

            {achievement.sharesCount !== undefined && (
              <View style={styles.stat}>
                <Text style={styles.icon}>🔄</Text>
                <Text style={styles.statText}>{achievement.sharesCount}</Text>
              </View>
            )}

            {achievement.commentsCount !== undefined && (
              <View style={styles.stat}>
                <Text style={styles.icon}>💬</Text>
                <Text style={styles.statText}>{achievement.commentsCount}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Date */}
        {achievement.achievedDate && (
          <Text style={styles.date}>{formatDate(achievement.achievedDate)}</Text>
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
    padding: 0,
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  header: {
    padding: 12,
    paddingBottom: 8,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text,
  },
  description: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  studentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  icon: {
    fontSize: 16,
    marginRight: 6,
  },
  studentText: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
    fontWeight: typography.fontWeight.medium,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.white,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  statText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginLeft: 2,
  },
  date: {
    fontSize: typography.fontSize.xs,
    color: colors.textLight,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
});

export default AchievementCard;
