import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, RefreshControl, Pressable, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, FontSize, Spacing, BorderRadius, Shadows, MicroCopy } from '../../constants/theme';
import { demoProfile, demoTrajectoryData } from '../../lib/store';
import { useMissions } from '../../lib/MissionsContext';
import GlowCard from '../../components/GlowCard';
import StatsCard from '../../components/StatsCard';
import StatusBadge from '../../components/StatusBadge';
import MiniGraph from '../../components/MiniGraph';
import FloatingActionButton from '../../components/FloatingActionButton';
import ScanLine from '../../components/ScanLine';
import { Mission } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function MissionControlScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const { missions, reload } = useMissions();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await reload();
    setRefreshing(false);
  }, [reload]);

  const activeMissions = missions.filter(m => !['rejected', 'accepted'].includes(m.status));
  const responseRate = Math.round(
    (missions.filter(m => m.status !== 'saved').length / Math.max(missions.length, 1)) * 100
  );

  const statusOrder: Record<string, number> = {
    offer: 0, interviewing: 1, applied: 2, saved: 3, accepted: 4, rejected: 5,
  };
  const sortedMissions = [...missions].sort((a, b) => (statusOrder[a.status] ?? 9) - (statusOrder[b.status] ?? 9));

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={[Colors.spaceBlack, Colors.deepSpace]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning, Commander</Text>
          <Text style={styles.headerTitle}>Mission Control</Text>
        </View>
        <Pressable style={styles.avatarButton}>
          <LinearGradient
            colors={[Colors.neonCyan, Colors.neonPurple]}
            style={styles.avatarGradient}
          >
            <Text style={styles.avatarText}>
              {demoProfile.full_name.split(' ').map(n => n[0]).join('')}
            </Text>
          </LinearGradient>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.neonCyan}
            colors={[Colors.neonCyan]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* System Status Banner */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <GlowCard variant="accent" style={styles.statusBanner}>
            <ScanLine height={60} />
            <View style={styles.statusBannerContent}>
              <View style={styles.statusDotRow}>
                <View style={[styles.statusDot, { backgroundColor: Colors.success }]} />
                <Text style={styles.statusBannerText}>{MicroCopy.systemsOnline}</Text>
              </View>
              <Text style={styles.statusBannerSub}>
                {activeMissions.length} active missions — {MicroCopy.escapeVelocity}
              </Text>
            </View>
          </GlowCard>
        </Animated.View>

        {/* Stats Row */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsRow}>
            <StatsCard
              label="Active Missions"
              value={activeMissions.length}
              icon="rocket-outline"
              color={Colors.neonCyan}
            />
            <StatsCard
              label="Response Rate"
              value={`${responseRate}%`}
              icon="pulse-outline"
              color={Colors.neonPurple}
            />
            <StatsCard
              label="Streak"
              value={`${demoProfile.streak_count}d`}
              icon="flame-outline"
              color={Colors.warning}
              subtitle="Keep it up!"
            />
            <StatsCard
              label="Career Energy"
              value={demoProfile.career_energy}
              icon="flash-outline"
              color={Colors.success}
            />
          </ScrollView>
        </Animated.View>

        {/* Trajectory Preview */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <GlowCard
            variant="subtle"
            style={styles.trajectoryCard}
            onPress={() => {/* navigate to trajectory tab */}}
          >
            <View style={styles.trajectoryHeader}>
              <View>
                <Text style={styles.sectionLabel}>ESCAPE VELOCITY</Text>
                <Text style={styles.sectionTitle}>Career Trajectory</Text>
              </View>
              <Ionicons name="expand-outline" size={18} color={Colors.textMuted} />
            </View>
            <MiniGraph
              data={demoTrajectoryData.map(d => d.energy)}
              width={SCREEN_WIDTH - 80}
              height={100}
              color={Colors.neonCyan}
            />
            <View style={styles.trajectoryFooter}>
              <Text style={styles.trajectoryLabel}>Energy trend: <Text style={{ color: Colors.success }}>+12% this month</Text></Text>
            </View>
          </GlowCard>
        </Animated.View>

        {/* Mission List */}
        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
          <View style={styles.missionListHeader}>
            <Text style={styles.sectionTitle}>Active Missions</Text>
            <Pressable>
              <Text style={styles.seeAllText}>See all</Text>
            </Pressable>
          </View>
        </Animated.View>

        {sortedMissions.length === 0 ? (
          <Animated.View entering={FadeInDown.delay(500).duration(400)}>
            <GlowCard variant="subtle" style={styles.missionCard} onPress={() => router.push('/mission/new')}>
              <View style={{ alignItems: 'center', paddingVertical: Spacing.xl }}>
                <Ionicons name="rocket-outline" size={40} color={Colors.neonCyan} />
                <Text style={[styles.sectionTitle, { marginTop: Spacing.md, textAlign: 'center' }]}>
                  No missions yet
                </Text>
                <Text style={[styles.metaText, { textAlign: 'center', marginTop: Spacing.xs }]}>
                  Tap the + button to log your first application.
                </Text>
              </View>
            </GlowCard>
          </Animated.View>
        ) : (
          sortedMissions.map((mission, index) => (
            <Animated.View key={mission.id} entering={FadeInDown.delay(500 + index * 80).duration(400)}>
              <MissionCard mission={mission} onPress={() => router.push(`/mission/${mission.id}`)} />
            </Animated.View>
          ))
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      <FloatingActionButton onPress={() => router.push('/mission/new')} />
    </View>
  );
}

function MissionCard({ mission, onPress }: { mission: Mission; onPress: () => void }) {
  const salaryText = mission.salary_min && mission.salary_max
    ? `$${Math.round(mission.salary_min / 1000)}K–$${Math.round(mission.salary_max / 1000)}K`
    : mission.salary_min
    ? `$${Math.round(mission.salary_min / 1000)}K+`
    : '';

  return (
    <GlowCard style={styles.missionCard} onPress={onPress} variant="subtle">
      <View style={styles.missionCardHeader}>
        <View style={styles.missionCardInfo}>
          <Text style={styles.missionCompany}>{mission.company}</Text>
          <Text style={styles.missionRole}>{mission.role}</Text>
        </View>
        <StatusBadge status={mission.status} size="sm" />
      </View>

      <View style={styles.missionCardMeta}>
        {mission.location && (
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={12} color={Colors.textMuted} />
            <Text style={styles.metaText}>{mission.location}</Text>
          </View>
        )}
        {salaryText && (
          <View style={styles.metaItem}>
            <Ionicons name="cash-outline" size={12} color={Colors.textMuted} />
            <Text style={styles.metaText}>{salaryText}</Text>
          </View>
        )}
      </View>

      {mission.follow_up_date && (
        <View style={styles.followUpBanner}>
          <Ionicons name="time-outline" size={12} color={Colors.warning} />
          <Text style={styles.followUpText}>
            Follow-up: {new Date(mission.follow_up_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </Text>
        </View>
      )}

      {mission.readiness_score !== undefined && (
        <View style={styles.readinessBar}>
          <View style={styles.readinessTrack}>
            <LinearGradient
              colors={[Colors.neonCyan, Colors.neonPurple]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.readinessFill, { width: `${mission.readiness_score}%` }]}
            />
          </View>
          <Text style={styles.readinessText}>{mission.readiness_score}%</Text>
        </View>
      )}
    </GlowCard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.spaceBlack,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  greeting: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  avatarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  avatarGradient: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.spaceBlack,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
  },
  statusBanner: {
    marginBottom: Spacing.lg,
    overflow: 'hidden',
  },
  statusBannerContent: {
    position: 'relative',
  },
  statusDotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusBannerText: {
    fontSize: FontSize.sm,
    color: Colors.neonCyan,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  statusBannerSub: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  statsRow: {
    gap: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  trajectoryCard: {
    marginBottom: Spacing.lg,
  },
  trajectoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  sectionLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  trajectoryFooter: {
    marginTop: Spacing.sm,
  },
  trajectoryLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  missionListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  seeAllText: {
    fontSize: FontSize.sm,
    color: Colors.neonCyan,
    fontWeight: '600',
  },
  missionCard: {
    marginBottom: Spacing.md,
  },
  missionCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  missionCardInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  missionCompany: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  missionRole: {
    fontSize: FontSize.sm,
    color: Colors.neonCyan,
    marginTop: 2,
    fontWeight: '500',
  },
  missionCardMeta: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginTop: Spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  metaText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  followUpBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.warning + '10',
    borderRadius: BorderRadius.sm,
    borderLeftWidth: 2,
    borderLeftColor: Colors.warning,
  },
  followUpText: {
    fontSize: FontSize.xs,
    color: Colors.warning,
    fontWeight: '600',
  },
  readinessBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  readinessTrack: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.borderDim,
    borderRadius: 2,
    overflow: 'hidden',
  },
  readinessFill: {
    height: '100%',
    borderRadius: 2,
  },
  readinessText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontWeight: '600',
    width: 32,
    textAlign: 'right',
  },
});
