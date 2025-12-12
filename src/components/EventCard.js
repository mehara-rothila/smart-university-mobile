import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Card from './common/Card';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { formatDate, formatTime, truncateText } from '../utils/helpers';

/**
 * Event Card Component
 * Displays event information in a card format
 */
const EventCard = ({ event, onPress }) => {
  const getCategoryColor = (category) => {
    const categoryColors = {
      ACADEMIC: colors.primary,
      CULTURAL: colors.secondary,
      SPORTS: colors.accent,
      TECHNICAL: colors.info,
      WORKSHOP: colors.success,
      SEMINAR: colors.warning,
      OTHER: colors.gray500,
    };
    return categoryColors[category] || colors.gray500;
  };

  const getStatusBadgeColor = (status) => {
    const statusColors = {
      APPROVED: colors.success,
      PENDING: colors.warning,
      REJECTED: colors.error,
      CANCELLED: colors.gray500,
    };
    return statusColors[status] || colors.gray500;
  };

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>
            {event.title}
          </Text>
          {event.status && event.status !== 'APPROVED' && (
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusBadgeColor(event.status) },
              ]}
            >
              <Text style={styles.statusText}>{event.status}</Text>
            </View>
          )}
        </View>

        {/* Description */}
        <Text style={styles.description} numberOfLines={2}>
          {truncateText(event.description, 100)}
        </Text>

        {/* Event Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.icon}>📅</Text>
            <Text style={styles.detailText}>
              {formatDate(event.eventDate)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.icon}>🕐</Text>
            <Text style={styles.detailText}>
              {formatTime(event.eventDate)}
            </Text>
          </View>
        </View>

        {event.location && (
          <View style={styles.detailRow}>
            <Text style={styles.icon}>📍</Text>
            <Text style={styles.detailText} numberOfLines={1}>
              {event.location}
            </Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: getCategoryColor(event.category) },
            ]}
          >
            <Text style={styles.categoryText}>
              {event.category || 'OTHER'}
            </Text>
          </View>

          {event.registeredCount !== undefined && event.maxParticipants && (
            <Text style={styles.participantsText}>
              {event.registeredCount}/{event.maxParticipants} registered
            </Text>
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
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.white,
  },
  description: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  detailsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  icon: {
    fontSize: 16,
    marginRight: 6,
  },
  detailText: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
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
  participantsText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
});

export default EventCard;
