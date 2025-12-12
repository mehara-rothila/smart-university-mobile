import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBookById, createBookRequest, trackBookDownload } from '../../api/books';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const BookDetailScreen = ({ route, navigation }) => {
  const { bookId } = route.params;
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: book,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['book', bookId],
    queryFn: async () => {
      const response = await getBookById(bookId);
      if (response.success) return response.data;
      throw new Error(response.message);
    },
  });

  const requestMutation = useMutation({
    mutationFn: () => createBookRequest(bookId),
    onSuccess: (response) => {
      if (response.success) {
        Alert.alert('Success', 'Your request has been sent to the owner');
        queryClient.invalidateQueries(['bookRequests']);
      } else {
        Alert.alert('Error', response.message);
      }
    },
    onError: () => {
      Alert.alert('Error', 'Failed to send request. Please try again.');
    },
  });

  const downloadMutation = useMutation({
    mutationFn: () => trackBookDownload(bookId),
    onSuccess: () => {
      queryClient.invalidateQueries(['book', bookId]);
    },
  });

  const getTypeColor = (type) => {
    const typeColors = {
      SELL: colors.accent,
      DONATE: colors.success,
      EXCHANGE: colors.info,
    };
    return typeColors[type] || colors.gray500;
  };

  const handleContactOwner = () => {
    if (!book?.ownerEmail && !book?.ownerPhone) {
      Alert.alert('No Contact', 'Owner contact information not available');
      return;
    }

    const options = [];
    if (book.ownerEmail) options.push({ text: 'Email', type: 'email' });
    if (book.ownerPhone) options.push({ text: 'Call', type: 'phone' });

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
      const subject = `Interested in your book: ${book.title}`;
      Linking.openURL(`mailto:${book.ownerEmail}?subject=${encodeURIComponent(subject)}`);
    } else if (type === 'phone') {
      Linking.openURL(`tel:${book.ownerPhone}`);
    }
  };

  const handleRequestBook = () => {
    const requestType = book.bookType === 'SELL' ? 'purchase' :
                       book.bookType === 'DONATE' ? 'receive' : 'exchange';

    Alert.alert(
      'Request Book',
      `Send a request to ${requestType} this book?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Request',
          onPress: () => requestMutation.mutate(),
        },
      ]
    );
  };

  const handleDownload = () => {
    if (book?.fileUrl) {
      downloadMutation.mutate();
      Linking.openURL(book.fileUrl);
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading book details..." />;
  }

  if (error || !book) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>❌</Text>
          <Text style={styles.errorText}>Failed to load book details</Text>
          <Button title="Go Back" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

  const isOwner = user?.id === book.ownerId;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Card style={styles.card}>
          <View style={styles.header}>
            <View style={[styles.typeBadge, { backgroundColor: getTypeColor(book.bookType) }]}>
              <Text style={styles.typeText}>{book.bookType}</Text>
            </View>
            {book.price && book.bookType === 'SELL' && (
              <Text style={styles.price}>${book.price}</Text>
            )}
          </View>

          <Text style={styles.title}>{book.title}</Text>

          {book.author && (
            <Text style={styles.author}>by {book.author}</Text>
          )}
        </Card>

        {/* Description */}
        {book.description && (
          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{book.description}</Text>
          </Card>
        )}

        {/* Details */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Details</Text>

          {book.isbn && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>ISBN:</Text>
              <Text style={styles.detailValue}>{book.isbn}</Text>
            </View>
          )}

          {book.condition && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Condition:</Text>
              <Text style={styles.detailValue}>{book.condition}</Text>
            </View>
          )}

          {book.category && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Category:</Text>
              <Text style={styles.detailValue}>{book.category}</Text>
            </View>
          )}

          {book.downloadCount !== undefined && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Downloads:</Text>
              <Text style={styles.detailValue}>📥 {book.downloadCount}</Text>
            </View>
          )}
        </Card>

        {/* Owner Info */}
        {book.ownerName && (
          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Owner</Text>
            <View style={styles.ownerInfo}>
              <Text style={styles.ownerIcon}>👤</Text>
              <View style={styles.ownerDetails}>
                <Text style={styles.ownerName}>{book.ownerName}</Text>
                {book.ownerEmail && (
                  <Text style={styles.ownerContact}>{book.ownerEmail}</Text>
                )}
              </View>
            </View>
          </Card>
        )}

        {/* Action Buttons */}
        {!isOwner && (
          <View style={styles.actionsContainer}>
            <Button
              title="Request Book"
              onPress={handleRequestBook}
              loading={requestMutation.isPending}
            />

            {book.fileUrl && (
              <Button
                title="Download File"
                onPress={handleDownload}
                variant="secondary"
                icon="📥"
              />
            )}

            <TouchableOpacity
              style={styles.contactButton}
              onPress={handleContactOwner}
            >
              <Text style={styles.contactButtonText}>Contact Owner</Text>
            </TouchableOpacity>
          </View>
        )}

        {isOwner && (
          <View style={styles.ownerNotice}>
            <Text style={styles.ownerNoticeText}>You are the owner of this book</Text>
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
  price: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.accent,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: 8,
  },
  author: {
    fontSize: typography.fontSize.lg,
    color: colors.textSecondary,
    fontStyle: 'italic',
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
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
    width: 120,
  },
  detailValue: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.text,
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  ownerDetails: {
    flex: 1,
  },
  ownerName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text,
    marginBottom: 4,
  },
  ownerContact: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  actionsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 12,
  },
  contactButton: {
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
  },
  contactButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.primary,
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

export default BookDetailScreen;
