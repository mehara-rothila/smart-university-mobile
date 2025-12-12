import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import {
  getApprovedAchievements,
  getPopularAchievements,
  getRecentAchievements,
} from '../../api/achievements';
import AchievementCard from '../../components/AchievementCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const AchievementsScreen = ({ navigation }) => {
  const [filter, setFilter] = useState('all'); // all, popular, recent

  // Fetch achievements based on filter
  const fetchAchievements = async () => {
    let response;
    if (filter === 'all') {
      response = await getApprovedAchievements();
    } else if (filter === 'popular') {
      response = await getPopularAchievements();
    } else if (filter === 'recent') {
      response = await getRecentAchievements();
    }

    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch achievements');
  };

  const {
    data: achievements = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['achievements', filter],
    queryFn: fetchAchievements,
  });

  const handleAchievementPress = (achievement) => {
    navigation.navigate('AchievementDetail', { achievementId: achievement.id });
  };

  const renderFilterButton = (filterValue, label) => {
    const isActive = filter === filterValue;
    return (
      <TouchableOpacity
        style={[
          styles.filterButton,
          isActive && styles.filterButtonActive,
        ]}
        onPress={() => setFilter(filterValue)}
      >
        <Text
          style={[
            styles.filterButtonText,
            isActive && styles.filterButtonTextActive,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🏆</Text>
      <Text style={styles.emptyText}>No achievements found</Text>
      <Text style={styles.emptySubtext}>
        {filter === 'all' && 'No achievements to display'}
        {filter === 'popular' && 'No popular achievements yet'}
        {filter === 'recent' && 'No recent achievements'}
      </Text>
    </View>
  );

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading achievements..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Filters */}
      <View style={styles.filtersContainer}>
        {renderFilterButton('all', 'All')}
        {renderFilterButton('popular', 'Popular')}
        {renderFilterButton('recent', 'Recent')}
      </View>

      {/* Error */}
      {error && (
        <ErrorMessage
          message={error.message}
          onRetry={refetch}
          style={styles.error}
        />
      )}

      {/* Achievements List */}
      <FlatList
        data={achievements}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <AchievementCard
            achievement={item}
            onPress={() => handleAchievementPress(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={renderEmptyState}
        numColumns={1}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  filtersContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  filterButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  filterButtonTextActive: {
    color: colors.white,
  },
  error: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});

export default AchievementsScreen;
