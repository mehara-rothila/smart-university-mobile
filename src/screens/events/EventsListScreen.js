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
import { useAuth } from '../../context/AuthContext';
import { getUpcomingEvents, getPastEvents, getMyEvents } from '../../api/events';
import EventCard from '../../components/EventCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const EventsListScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [filter, setFilter] = useState('upcoming'); // upcoming, past, my

  // Fetch events based on filter
  const fetchEvents = async () => {
    let response;
    if (filter === 'upcoming') {
      response = await getUpcomingEvents();
    } else if (filter === 'past') {
      response = await getPastEvents();
    } else if (filter === 'my') {
      response = await getMyEvents(user?.id);
    }

    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch events');
  };

  const {
    data: events = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['events', filter, user?.id],
    queryFn: fetchEvents,
    enabled: !!user,
  });

  const handleEventPress = (event) => {
    navigation.navigate('EventDetail', { eventId: event.id });
  };

  const handleCreateEvent = () => {
    navigation.navigate('CreateEvent');
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
      <Text style={styles.emptyIcon}>📅</Text>
      <Text style={styles.emptyText}>No events found</Text>
      <Text style={styles.emptySubtext}>
        {filter === 'upcoming' && 'Check back later for upcoming events'}
        {filter === 'past' && 'No past events to display'}
        {filter === 'my' && 'You haven\'t created any events yet'}
      </Text>
    </View>
  );

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading events..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Filters */}
      <View style={styles.filtersContainer}>
        {renderFilterButton('upcoming', 'Upcoming')}
        {renderFilterButton('past', 'Past')}
        {renderFilterButton('my', 'My Events')}
      </View>

      {/* Error */}
      {error && (
        <ErrorMessage
          message={error.message}
          onRetry={refetch}
          style={styles.error}
        />
      )}

      {/* Events List */}
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <EventCard event={item} onPress={() => handleEventPress(item)} />
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
      />

      {/* Create Event FAB */}
      {(user?.role === 'FACULTY' || user?.role === 'ADMIN') && (
        <TouchableOpacity
          style={styles.fab}
          onPress={handleCreateEvent}
          activeOpacity={0.8}
        >
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      )}
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
    backgroundColor: colors.primary,
    borderColor: colors.primary,
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
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  fabIcon: {
    fontSize: 32,
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
  },
});

export default EventsListScreen;
