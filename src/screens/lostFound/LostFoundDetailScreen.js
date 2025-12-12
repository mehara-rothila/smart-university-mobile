import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLostFoundItemById, claimItem } from '../../api/lostFound';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { formatDate } from '../../utils/helpers';

const LostFoundDetailScreen = ({ route, navigation }) => {
  const { itemId } = route.params;
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: item,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['lostFoundItem', itemId],
    queryFn: async () => {
      const response = await getLostFoundItemById(itemId);
      if (response.success) return response.data;
      throw new Error(response.message);
    },
  });

  const claimMutation = useMutation({
    mutationFn: claimItem,
    onSuccess: (response) => {
      if (response.success) {
        Alert.alert('Success', 'Item marked as claimed');
        queryClient.invalidateQueries(['lostFoundItem', itemId]);
        queryClient.invalidateQueries(['lostFoundItems']);
      } else {
        Alert.alert('Error', response.message);
      }
    },
    onError: () => {
      Alert.alert('Error', 'Failed to claim item. Please try again.');
    },
  });

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

  const handleContactPress = () => {
    if (!item?.reporterEmail && !item?.reporterPhone) {
      Alert.alert('No Contact', 'Contact information not available');
      return;
    }

    const options = [];
    if (item.reporterEmail) options.push({ text: 'Email', type: 'email' });
    if (item.reporterPhone) options.push({ text: 'Call', type: 'phone' });

    if (options.length === 1) {
      handleContactAction(options[0].type);
    } else {
      Alert.alert(
        'Contact Owner',
        'How would you like to contact?',
        [
          ...options.map((opt) => ({
            text: opt.text,
            onPress: () => handleContactAction(opt.type),
          })),
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    }
  };

  const handleContactAction = (type) => {
    if (type === 'email') {
      const subject = `Regarding ${item.type} item: ${item.title}`;
      Linking.openURL(`mailto:${item.reporterEmail}?subject=${encodeURIComponent(subject)}`);
    } else if (type === 'phone') {
      Linking.openURL(`tel:${item.reporterPhone}`);
    }
  };

  const handleClaimPress = () => {
    Alert.alert(
      'Claim Item',
      'Are you sure you want to mark this item as claimed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Claim',
          onPress: () => claimMutation.mutate(itemId),
        },
      ]
    );
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading item details..." />;
  }

  if (error || !item) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>❌</Text>
          <Text style={styles.errorText}>Failed to load item details</Text>
          <Button title="Go Back" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

  const isOwner = user?.id === item.reporterId;
  const isClaimed = item.status === 'CLAIMED';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Image */}
        {item.imageUrl && (
          <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
        )}

        {/* Header */}
        <Card style={styles.card}>
          <View style={styles.header}>
            <View style={[styles.typeBadge, { backgroundColor: item.type === 'LOST' ? colors.error : colors.success }]}>
              <Text style={styles.typeText}>{item.type}</Text>
            </View>
            {isClaimed && (
              <View style={styles.claimedBadge}>
                <Text style={styles.claimedText}>✓ Claimed</Text>
              </View>
            )}
          </View>

          <View style={styles.titleRow}>
            <Text style={styles.icon}>{getCategoryIcon(item.category)}</Text>
            <Text style={styles.title}>{item.title}</Text>
          </View>

          <Text style={styles.category}>{item.category}</Text>
        </Card>

        {/* Details */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{item.description}</Text>

          {item.location && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>📍 Location:</Text>
              <Text style={styles.detailValue}>{item.location}</Text>
            </View>
          )}

          {item.dateReported && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>📅 Date Reported:</Text>
              <Text style={styles.detailValue}>{formatDate(item.dateReported)}</Text>
            </View>
          )}
        </Card>

        {/* Reporter Info */}
        {item.reporterName && (
          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Reported By</Text>
            <Text style={styles.reporterName}>👤 {item.reporterName}</Text>
          </Card>
        )}

        {/* Action Buttons */}
        {!isOwner && !isClaimed && (
          <View style={styles.actionsContainer}>
            <Button
              title="Contact Owner"
              onPress={handleContactPress}
              style={styles.contactButton}
            />
            {item.type === 'FOUND' && (
              <Button
                title="Mark as Claimed"
                onPress={handleClaimPress}
                variant="secondary"
                loading={claimMutation.isPending}
              />
            )}
          </View>
        )}

        {isOwner && (
          <View style={styles.ownerNotice}>
            <Text style={styles.ownerNoticeText}>You are the owner of this item</Text>
          </View>
        )}
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
    paddingBottom: 30,
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: colors.gray200,
  },
  card: {
    margin: 20,
    marginBottom: 0,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  typeText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.white,
  },
  claimedBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.success,
  },
  claimedText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.white,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 28,
    marginRight: 12,
  },
  title: {
    flex: 1,
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  category: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: typography.fontSize.base,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
    width: 140,
  },
  detailValue: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.text,
  },
  reporterName: {
    fontSize: typography.fontSize.base,
    color: colors.text,
  },
  actionsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 12,
  },
  contactButton: {
    marginBottom: 0,
  },
  ownerNotice: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    backgroundColor: colors.info + '20',
    borderRadius: 8,
    alignItems: 'center',
  },
  ownerNoticeText: {
    fontSize: typography.fontSize.base,
    color: colors.info,
    fontWeight: typography.fontWeight.medium,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorText: {
    fontSize: typography.fontSize.xl,
    color: colors.textSecondary,
    marginBottom: 24,
  },
});

export default LostFoundDetailScreen;
