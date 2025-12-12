import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const HomeScreen = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.firstName || user?.username || 'User'}!</Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>🎓</Text>
            <Text style={styles.statLabel}>Events</Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={styles.statValue}>🏆</Text>
            <Text style={styles.statLabel}>Achievements</Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={styles.statValue}>📚</Text>
            <Text style={styles.statLabel}>Books</Text>
          </Card>
        </View>

        {/* Welcome Message */}
        <Card style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Smart University Mobile</Text>
          <Text style={styles.welcomeText}>
            Your campus companion is now in your pocket! Explore events, achievements, lost & found items, and more.
          </Text>
        </Card>

        {/* Coming Soon */}
        <Card style={styles.comingSoonCard}>
          <Text style={styles.comingSoonTitle}>🚧 Phase 2 Features Coming Soon</Text>
          <Text style={styles.comingSoonText}>
            • Events module with registration{'\n'}
            • Achievements showcase{'\n'}
            • Lost & Found{'\n'}
            • Books exchange{'\n'}
            • Real-time notifications{'\n'}
            • And much more!
          </Text>
        </Card>

        {/* User Info */}
        <Card style={styles.userInfoCard}>
          <Text style={styles.userInfoTitle}>Your Profile</Text>
          <Text style={styles.userInfoText}>Username: {user?.username}</Text>
          <Text style={styles.userInfoText}>Email: {user?.email}</Text>
          <Text style={styles.userInfoText}>
            Role: {user?.role?.charAt(0) + user?.role?.slice(1).toLowerCase()}
          </Text>
        </Card>

        {/* Logout Button */}
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="danger"
          style={styles.logoutButton}
        />
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
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: typography.fontSize.lg,
    color: colors.textSecondary,
  },
  userName: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    padding: 16,
  },
  statValue: {
    fontSize: 32,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  welcomeCard: {
    marginBottom: 16,
    padding: 20,
  },
  welcomeTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginBottom: 12,
  },
  welcomeText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  comingSoonCard: {
    marginBottom: 16,
    padding: 20,
    backgroundColor: colors.gray50,
  },
  comingSoonTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text,
    marginBottom: 12,
  },
  comingSoonText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  userInfoCard: {
    marginBottom: 16,
    padding: 20,
  },
  userInfoTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text,
    marginBottom: 12,
  },
  userInfoText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  logoutButton: {
    marginTop: 8,
    marginBottom: 24,
  },
});

export default HomeScreen;
