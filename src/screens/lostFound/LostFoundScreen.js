import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { getLostFoundItems } from '../../api/lostFound';
import LostFoundCard from '../../components/LostFoundCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const LostFoundScreen = ({ navigation }) => {
  const [activeFilter, setActiveFilter] = useState('ALL');

  const {
    data: items = [],
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['lostFoundItems', activeFilter],
    queryFn: async () => {
      const type = activeFilter === 'ALL' ? undefined : activeFilter;
      const response = await getLostFoundItems(type);
      if (response.success) return response.data;
      return [];
    },
  });

  const filters = [
    { label: 'All', value: 'ALL' },
    { label: 'Lost', value: 'LOST' },
    { label: 'Found', value: 'FOUND' },
  ];

  const handleFilterPress = (filterValue) => {
    setActiveFilter(filterValue);
  };

  const handleItemPress = (item) => {
    navigation.navigate('LostFoundDetail', { itemId: item.id });
  };

  const handleCreatePress = () => {
    navigation.navigate('CreateLostFound');
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading items..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Filters */}
        <View style={styles.filtersContainer}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.value}
              style={[
                styles.filterButton,
                activeFilter === filter.value && styles.filterButtonActive,
              ]}
              onPress={() => handleFilterPress(filter.value)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === filter.value && styles.filterTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* List */}
        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <LostFoundCard item={item} onPress={() => handleItemPress(item)} />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              colors={[colors.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyText}>No items found</Text>
              <Text style={styles.emptySubtext}>
                {activeFilter === 'ALL'
                  ? 'Be the first to post an item'
                  : `No ${activeFilter.toLowerCase()} items yet`}
              </Text>
            </View>
          }
        />

        {/* Create Button */}
        <View style={styles.createButtonContainer}>
          <Button
            title="Post Item"
            onPress={handleCreatePress}
            icon="+"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  content: {
    flex: 1,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  filterTextActive: {
    color: colors.white,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  createButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
});

export default LostFoundScreen;
