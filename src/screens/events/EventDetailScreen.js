import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import {
  getEventById,
  registerForEvent,
  cancelEventRegistration,
  isRegisteredForEvent,
  getEventComments,
  addEventComment,
} from '../../api/events';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { formatDateTime } from '../../utils/helpers';

const EventDetailScreen = ({ route }) => {
  const { eventId } = route.params;
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');

  // Fetch event details
  const {
    data: event,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      const response = await getEventById(eventId);
      if (response.success) return response.data;
      throw new Error(response.message);
    },
  });

  // Check registration status
  const { data: registrationStatus } = useQuery({
    queryKey: ['eventRegistration', eventId],
    queryFn: async () => {
      const response = await isRegisteredForEvent(eventId);
      if (response.success) return response.data;
      return false;
    },
    enabled: !!user,
  });

  // Fetch comments
  const { data: comments = [] } = useQuery({
    queryKey: ['eventComments', eventId],
    queryFn: async () => {
      const response = await getEventComments(eventId);
      if (response.success) return response.data;
      return [];
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: () => registerForEvent(eventId),
    onSuccess: (response) => {
      if (response.success) {
        Alert.alert('Success', response.message);
        queryClient.invalidateQueries(['eventRegistration', eventId]);
        queryClient.invalidateQueries(['event', eventId]);
      } else {
        Alert.alert('Error', response.message);
      }
    },
  });

  // Cancel registration mutation
  const cancelMutation = useMutation({
    mutationFn: () => cancelEventRegistration(eventId),
    onSuccess: (response) => {
      if (response.success) {
        Alert.alert('Success', response.message);
        queryClient.invalidateQueries(['eventRegistration', eventId]);
        queryClient.invalidateQueries(['event', eventId]);
      } else {
        Alert.alert('Error', response.message);
      }
    },
  });

  // Add comment mutation
  const commentMutation = useMutation({
    mutationFn: (commentText) => addEventComment(eventId, commentText),
    onSuccess: (response) => {
      if (response.success) {
        setComment('');
        queryClient.invalidateQueries(['eventComments', eventId]);
      } else {
        Alert.alert('Error', response.message);
      }
    },
  });

  const handleRegister = () => {
    if (registrationStatus?.isRegistered) {
      Alert.alert(
        'Cancel Registration',
        'Are you sure you want to cancel your registration?',
        [
          { text: 'No', style: 'cancel' },
          { text: 'Yes', onPress: () => cancelMutation.mutate() },
        ]
      );
    } else {
      registerMutation.mutate();
    }
  };

  const handleAddComment = () => {
    if (!comment.trim()) {
      Alert.alert('Error', 'Please enter a comment');
      return;
    }
    commentMutation.mutate(comment.trim());
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading event..." />;
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <ErrorMessage message={error.message} onRetry={refetch} />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.centerContainer}>
        <Text>Event not found</Text>
      </View>
    );
  }

  const isEventFull = event.registeredCount >= event.maxParticipants;
  const canRegister = !registrationStatus?.isRegistered && !isEventFull;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Event Details Card */}
        <Card style={styles.detailsCard}>
          <Text style={styles.title}>{event.title}</Text>

          <View style={styles.categoryContainer}>
            <View
              style={[styles.categoryBadge, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.categoryText}>{event.category}</Text>
            </View>
          </View>

          <Text style={styles.description}>{event.description}</Text>

          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.icon}>📅</Text>
              <Text style={styles.infoText}>{formatDateTime(event.eventDate)}</Text>
            </View>

            {event.location && (
              <View style={styles.infoRow}>
                <Text style={styles.icon}>📍</Text>
                <Text style={styles.infoText}>{event.location}</Text>
              </View>
            )}

            <View style={styles.infoRow}>
              <Text style={styles.icon}>👥</Text>
              <Text style={styles.infoText}>
                {event.registeredCount}/{event.maxParticipants} registered
              </Text>
            </View>

            {event.creatorName && (
              <View style={styles.infoRow}>
                <Text style={styles.icon}>👤</Text>
                <Text style={styles.infoText}>Created by {event.creatorName}</Text>
              </View>
            )}
          </View>

          {/* Registration Button */}
          {user && (
            <Button
              title={
                registrationStatus?.isRegistered
                  ? 'Cancel Registration'
                  : isEventFull
                  ? 'Event Full'
                  : 'Register'
              }
              onPress={handleRegister}
              variant={registrationStatus?.isRegistered ? 'danger' : 'primary'}
              disabled={
                (!canRegister && !registrationStatus?.isRegistered) ||
                registerMutation.isPending ||
                cancelMutation.isPending
              }
              loading={registerMutation.isPending || cancelMutation.isPending}
              style={styles.registerButton}
            />
          )}
        </Card>

        {/* Comments Section */}
        <Card style={styles.commentsCard}>
          <Text style={styles.sectionTitle}>
            Comments ({comments.length})
          </Text>

          {/* Add Comment */}
          {user && (
            <View style={styles.addCommentContainer}>
              <TextInput
                style={styles.commentInput}
                value={comment}
                onChangeText={setComment}
                placeholder="Add a comment..."
                placeholderTextColor={colors.gray400}
                multiline
              />
              <Button
                title="Post"
                onPress={handleAddComment}
                size="small"
                disabled={!comment.trim()}
                loading={commentMutation.isPending}
              />
            </View>
          )}

          {/* Comments List */}
          {comments.length > 0 ? (
            comments.map((c) => (
              <View key={c.id} style={styles.commentItem}>
                <Text style={styles.commentAuthor}>{c.userName || 'Anonymous'}</Text>
                <Text style={styles.commentText}>{c.comment}</Text>
                {c.createdAt && (
                  <Text style={styles.commentDate}>
                    {formatDateTime(c.createdAt)}
                  </Text>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.noComments}>No comments yet</Text>
          )}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  scrollContent: {
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  detailsCard: {
    padding: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: 12,
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 16,
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
  description: {
    fontSize: typography.fontSize.base,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 20,
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 18,
    marginRight: 8,
  },
  infoText: {
    fontSize: typography.fontSize.base,
    color: colors.text,
  },
  registerButton: {
    marginTop: 8,
  },
  commentsCard: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text,
    marginBottom: 16,
  },
  addCommentContainer: {
    marginBottom: 20,
  },
  commentInput: {
    backgroundColor: colors.gray50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: typography.fontSize.base,
    color: colors.text,
    marginBottom: 8,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  commentItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  commentAuthor: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text,
    marginBottom: 4,
  },
  commentText: {
    fontSize: typography.fontSize.base,
    color: colors.text,
    marginBottom: 4,
  },
  commentDate: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  noComments: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 20,
  },
});

export default EventDetailScreen;
