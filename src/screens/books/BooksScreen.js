import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { getApprovedBooks, searchBooks } from '../../api/books';
import BookCard from '../../components/BookCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const BooksScreen = ({ navigation }) => {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const {
    data: books = [],
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['books', activeFilter, searchQuery],
    queryFn: async () => {
      if (searchQuery.trim()) {
        setIsSearching(true);
        const response = await searchBooks(searchQuery.trim());
        setIsSearching(false);
        if (response.success) {
          // Filter by type if not ALL
          if (activeFilter === 'ALL') return response.data;
          return response.data.filter((book) => book.bookType === activeFilter);
        }
        return [];
      }

      const response = await getApprovedBooks();
      if (response.success) {
        // Filter by type if not ALL
        if (activeFilter === 'ALL') return response.data;
        return response.data.filter((book) => book.bookType === activeFilter);
      }
      return [];
    },
  });

  const filters = [
    { label: 'All', value: 'ALL' },
    { label: 'For Sale', value: 'SELL' },
    { label: 'Donate', value: 'DONATE' },
    { label: 'Exchange', value: 'EXCHANGE' },
  ];

  const handleFilterPress = (filterValue) => {
    setActiveFilter(filterValue);
  };

  const handleBookPress = (book) => {
    navigation.navigate('BookDetail', { bookId: book.id });
  };

  const handleCreatePress = () => {
    navigation.navigate('CreateBook');
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  if (isLoading && !isSearching) {
    return <LoadingSpinner fullScreen message="Loading books..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search books by title or author..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

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
        {isSearching ? (
          <LoadingSpinner message="Searching..." />
        ) : (
          <FlatList
            data={books}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <BookCard book={item} onPress={() => handleBookPress(item)} />
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
                <Text style={styles.emptyIcon}>📚</Text>
                <Text style={styles.emptyText}>
                  {searchQuery ? 'No books found' : 'No books available'}
                </Text>
                <Text style={styles.emptySubtext}>
                  {searchQuery
                    ? 'Try a different search term'
                    : 'Be the first to add a book'}
                </Text>
              </View>
            }
          />
        )}

        {/* Create Button */}
        <View style={styles.createButtonContainer}>
          <Button title="Add Book" onPress={handleCreatePress} icon="+" />
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
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.text,
  },
  clearIcon: {
    fontSize: 18,
    color: colors.textSecondary,
    paddingHorizontal: 4,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
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

export default BooksScreen;
