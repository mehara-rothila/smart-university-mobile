import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import {
  getAchievementById,
  likeAchievement,
  unlikeAchievement,
  getAchievementComments,
  addAchievementComment,
} from '../../api/achievements';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { formatDateTime } from '../../utils/helpers';

const AchievementDetailScreen = ({ route }) => {
  const { achievementId } = route.params;
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');

  // Fetch achievement details
  const {
    data: achievement,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['achievement', achievementId],
    queryFn: async () => {
      const response = await getAchievementById(achievementId);
      if (response.success) return response.data;
      throw new Error(response.message);
    },
  });

  // Fetch comments
  const { data: comments = [] } = useQuery({
    queryKey: ['achievementComments', achievementId],
    queryFn: async () => {
      const response = await getAchievementComments(achievementId);
      if (response.success) return response.data;
      return [];
    },
  });

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: () => likeAchievement(achievementId),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries(['achievement', achievementId]);
        queryClient.invalidateQueries(['achievements']);
      } else {
        Alert.alert('Error', response.message);
      }
    },
  });

  // Unlike mutation
  const unlikeMutation = useMutation({
    mutationFn: () => unlikeAchievement(achievementId),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries(['achievement', achievementId]);
        queryClient.invalidateQueries(['achievements']);
      } else {
        Alert.alert('Error', response.message);
      }
    },
  });

  // Add comment mutation
  const commentMutation = useMutation({
    mutationFn: (commentText) => addAchievementComment(achievementId, commentText),
    onSuccess: (response) => {
      if (response.success) {
        setComment('');
        queryClient.invalidateQueries(['achievementComments', achievementId]);
      } else {
        Alert.alert('Error', response.message);
      }
    },
  });

  const handleLike = () => {
    if (achievement?.isLikedByUser) {
      unlikeMutation.mutate();
    } else {
      likeMutation.mutate();
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
    return <LoadingSpinner fullScreen message="Loading achievement..." />;
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <ErrorMessage message={error.message} onRetry={refetch} />
      </View>
    );
  }

  if (!achievement) {
    return (
      <View style={styles.centerContainer}>
        <Text>Achievement not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Achievement Image */}
        {achievement.imageUrl && (
          <Image
            source={{ uri: achievement.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        )}

        {/* Achievement Details Card */}
        <Card style={styles.detailsCard}>
          <Text style={styles.title}>{achievement.title}</Text>

          <View style={styles.categoryContainer}>
            <View
              style={[styles.categoryBadge, { backgroundColor: colors.secondary }]}
            >
              <Text style={styles.categoryText}>{achievement.category}</Text>
            </View>
          </View>

          <Text style={styles.description}>{achievement.description}</Text>

          {/* Student Info */}
          {achievement.studentName && (
            <View style={styles.infoRow}>
              <Text style={styles.icon}>👤</Text>
              <Text style={styles.infoText}>{achievement.studentName}</Text>
            </View>
          )}

          {achievement.achievedDate && (
            <View style={styles.infoRow}>
              <Text style={styles.icon}>📅</Text>
              <Text style={styles.infoText}>
                {formatDateTime(achievement.achievedDate)}
              </Text>
            </View>
          )}

          {/* Stats */}
          <View style={styles.statsContainer}>
            <TouchableOpacity
              style={styles.statButton}
              onPress={handleLike}
              disabled={likeMutation.isPending || unlikeMutation.isPending}
            >
              <Text style={styles.icon}>
                {achievement.isLikedByUser ? '❤️' : '🤍'}
              </Text>
              <Text style={styles.statText}>
                {achievement.likesCount || 0} Likes
              </Text>
            </TouchableOpacity>

            <View style={styles.stat}>
              <Text style={styles.icon}>🔄</Text>
              <Text style={styles.statText}>
                {achievement.sharesCount || 0} Shares
              </Text>
            </View>

            <View style={styles.stat}>
              <Text style={styles.icon}>💬</Text>
              <Text style={styles.statText}>
                {comments.length} Comments
              </Text>
            </View>
          </View>
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
    paddingBottom: 16,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: '100%',
    height: 300,
  },
  detailsCard: {
    margin: 16,
    marginBottom: 8,
    padding: 20,
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
  statsContainer: {
    flexDirection: 'row',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 8,
  },
  statButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  statText: {
    fontSize: typography.fontSize.base,
    color: colors.text,
    marginLeft: 4,
  },
  commentsCard: {
    margin: 16,
    marginTop: 8,
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

export default AchievementDetailScreen;
