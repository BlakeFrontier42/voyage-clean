import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, FontSize, Spacing, BorderRadius, MicroCopy } from '../../constants/theme';
import { demoCoachingActions, demoHabits, demoProfile } from '../../lib/store';
import GlowCard from '../../components/GlowCard';
import NeonButton from '../../components/NeonButton';
import ProgressRing from '../../components/ProgressRing';

const DAYS_OF_WEEK = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function CoachingScreen() {
  const insets = useSafeAreaInsets();
  const [coachMode, setCoachMode] = useState<'chill' | 'drill_sergeant'>(demoProfile.coach_mode);
  const [actions, setActions] = useState(demoCoachingActions);
  const [completedHabits, setCompletedHabits] = useState<string[]>(['h1', 'h3']);
  const [showRetro, setShowRetro] = useState(false);
  const [northStar, setNorthStar] = useState(demoProfile.north_star_goal || '');
  const [editingNorthStar, setEditingNorthStar] = useState(false);

  // Streak data (mock: last 14 days)
  const streakData = [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1];

  const toggleAction = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setActions(prev => prev.map(a => a.id === id ? { ...a, completed: !a.completed } : a));
  };

  const toggleHabit = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCompletedHabits(prev => prev.includes(id) ? prev.filter(h => h !== id) : [...prev, id]);
  };

  const habitProgress = Math.round((completedHabits.length / demoHabits.length) * 100);
  const completedActions = actions.filter(a => a.completed).length;

  const greetingMessage = coachMode === 'drill_sergeant'
    ? "No excuses today, Commander. Execute these orders."
    : "Good morning! Here are some gentle suggestions for today.";

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={[Colors.spaceBlack, Colors.deepSpace]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerLabel}>{MicroCopy.missionBriefing.toUpperCase()}</Text>
          <Text style={styles.headerTitle}>Coaching</Text>
        </View>
        <View style={styles.streakBadge}>
          <Ionicons name="flame" size={16} color={Colors.warning} />
          <Text style={styles.streakText}>{demoProfile.streak_count}d</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Coach Mode Toggle */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <GlowCard variant={coachMode === 'drill_sergeant' ? 'accent' : 'subtle'} style={styles.coachModeCard}>
            <View style={styles.coachModeRow}>
              <View style={styles.coachModeInfo}>
                <Text style={styles.coachModeLabel}>COACH MODE</Text>
                <Text style={styles.coachModeValue}>
                  {coachMode === 'drill_sergeant' ? 'Drill Sergeant' : 'Chill Mode'}
                </Text>
              </View>
              <View style={styles.toggleRow}>
                <Text style={[styles.toggleLabel, coachMode === 'chill' && { color: Colors.success }]}>Chill</Text>
                <Switch
                  value={coachMode === 'drill_sergeant'}
                  onValueChange={(val) => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                    setCoachMode(val ? 'drill_sergeant' : 'chill');
                  }}
                  trackColor={{ false: Colors.success + '40', true: Colors.neonCyan + '40' }}
                  thumbColor={coachMode === 'drill_sergeant' ? Colors.neonCyan : Colors.success}
                  ios_backgroundColor={Colors.success + '40'}
                />
                <Text style={[styles.toggleLabel, coachMode === 'drill_sergeant' && { color: Colors.neonCyan }]}>Drill</Text>
              </View>
            </View>
            <Text style={styles.coachMessage}>{greetingMessage}</Text>
          </GlowCard>
        </Animated.View>

        {/* Morning Mission Brief */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <GlowCard style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionLabel}>TODAY'S ORDERS</Text>
                <Text style={styles.sectionTitle}>Mission Brief</Text>
              </View>
              <View style={styles.completionBadge}>
                <Text style={styles.completionText}>{completedActions}/{actions.length}</Text>
              </View>
            </View>

            {actions.map((action, index) => (
              <Pressable
                key={action.id}
                onPress={() => toggleAction(action.id)}
                style={[styles.actionItem, action.completed && styles.actionItemCompleted]}
              >
                <View style={[styles.actionCheckbox, action.completed && styles.actionCheckboxDone]}>
                  {action.completed && <Ionicons name="checkmark" size={14} color={Colors.spaceBlack} />}
                </View>
                <View style={styles.actionContent}>
                  <Text style={[styles.actionTitle, action.completed && styles.actionTitleDone]}>
                    {action.title}
                  </Text>
                  <Text style={styles.actionDesc}>{action.description}</Text>
                </View>
                <View style={[styles.priorityDot, {
                  backgroundColor: action.priority === 'high' ? Colors.danger : action.priority === 'medium' ? Colors.warning : Colors.success,
                }]} />
              </Pressable>
            ))}
          </GlowCard>
        </Animated.View>

        {/* Habit Tracker */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <GlowCard variant="purple" style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionLabel}>DAILY HABITS</Text>
                <Text style={styles.sectionTitle}>Habit Tracker</Text>
              </View>
              <ProgressRing progress={habitProgress} size={52} color={Colors.neonPurple} strokeWidth={4} label="" />
            </View>

            {demoHabits.map(habit => {
              const isDone = completedHabits.includes(habit.id);
              return (
                <Pressable
                  key={habit.id}
                  onPress={() => toggleHabit(habit.id)}
                  style={[styles.habitItem, isDone && styles.habitItemDone]}
                >
                  <View style={[styles.habitIcon, isDone && { backgroundColor: Colors.neonPurple + '20' }]}>
                    <Ionicons name={habit.icon as any} size={18} color={isDone ? Colors.neonPurple : Colors.textMuted} />
                  </View>
                  <Text style={[styles.habitLabel, isDone && styles.habitLabelDone]}>{habit.label}</Text>
                  {isDone && <Ionicons name="checkmark-circle" size={20} color={Colors.neonPurple} />}
                </Pressable>
              );
            })}

            {/* Streak Visualization */}
            <Text style={[styles.sectionLabel, { marginTop: Spacing.xl }]}>STREAK — LAST 14 DAYS</Text>
            <View style={styles.streakGrid}>
              {streakData.map((val, i) => (
                <View
                  key={i}
                  style={[
                    styles.streakCell,
                    val === 1 && { backgroundColor: Colors.neonPurple, borderColor: Colors.neonPurple },
                  ]}
                />
              ))}
            </View>
          </GlowCard>
        </Animated.View>

        {/* Weekly Retrospective */}
        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
          <GlowCard style={styles.section}>
            <Pressable
              style={styles.sectionHeaderRow}
              onPress={() => setShowRetro(!showRetro)}
            >
              <View>
                <Text style={styles.sectionLabel}>WEEKLY RETRO</Text>
                <Text style={styles.sectionTitle}>Course Correction</Text>
              </View>
              <Ionicons name={showRetro ? 'chevron-up' : 'chevron-down'} size={20} color={Colors.textMuted} />
            </Pressable>

            {showRetro && (
              <View style={styles.retroForm}>
                <View style={styles.retroField}>
                  <Text style={styles.retroFieldLabel}>Wins this week</Text>
                  <TextInput
                    style={styles.retroInput}
                    placeholder="What went well?"
                    placeholderTextColor={Colors.textMuted}
                    multiline
                    selectionColor={Colors.neonCyan}
                  />
                </View>
                <View style={styles.retroField}>
                  <Text style={styles.retroFieldLabel}>Challenges</Text>
                  <TextInput
                    style={styles.retroInput}
                    placeholder="What was difficult?"
                    placeholderTextColor={Colors.textMuted}
                    multiline
                    selectionColor={Colors.neonCyan}
                  />
                </View>
                <View style={styles.retroField}>
                  <Text style={styles.retroFieldLabel}>Learnings</Text>
                  <TextInput
                    style={styles.retroInput}
                    placeholder="What did you learn?"
                    placeholderTextColor={Colors.textMuted}
                    multiline
                    selectionColor={Colors.neonCyan}
                  />
                </View>
                <View style={styles.retroField}>
                  <Text style={styles.retroFieldLabel}>Next week goals</Text>
                  <TextInput
                    style={styles.retroInput}
                    placeholder="What will you focus on?"
                    placeholderTextColor={Colors.textMuted}
                    multiline
                    selectionColor={Colors.neonCyan}
                  />
                </View>
                <NeonButton
                  title="SUBMIT RETRO"
                  onPress={() => {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    setShowRetro(false);
                  }}
                  variant="secondary"
                  size="md"
                />
              </View>
            )}
          </GlowCard>
        </Animated.View>

        {/* North Star Editor */}
        <Animated.View entering={FadeInDown.delay(500).duration(400)}>
          <GlowCard variant="accent" style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
                <Ionicons name="star" size={20} color={Colors.neonCyan} />
                <Text style={styles.sectionLabel}>NORTH STAR GOAL</Text>
              </View>
              <Pressable onPress={() => setEditingNorthStar(!editingNorthStar)}>
                <Ionicons name={editingNorthStar ? 'checkmark' : 'create-outline'} size={18} color={Colors.neonCyan} />
              </Pressable>
            </View>
            {editingNorthStar ? (
              <TextInput
                style={styles.northStarInput}
                value={northStar}
                onChangeText={setNorthStar}
                multiline
                selectionColor={Colors.neonCyan}
                autoFocus
              />
            ) : (
              <Text style={styles.northStarText}>{northStar}</Text>
            )}
          </GlowCard>
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
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
  headerLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    letterSpacing: 2,
  },
  headerTitle: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.warning + '15',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.warning + '30',
  },
  streakText: {
    fontSize: FontSize.sm,
    color: Colors.warning,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
  },
  coachModeCard: {
    marginBottom: Spacing.lg,
  },
  coachModeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  coachModeInfo: {},
  coachModeLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    letterSpacing: 2,
  },
  coachModeValue: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  toggleLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  coachMessage: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  completionBadge: {
    backgroundColor: Colors.neonCyanGlow,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.borderGlow,
  },
  completionText: {
    fontSize: FontSize.sm,
    color: Colors.neonCyan,
    fontWeight: '700',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDim,
    gap: Spacing.md,
  },
  actionItemCompleted: {
    opacity: 0.6,
  },
  actionCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.borderGlow,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  actionCheckboxDone: {
    backgroundColor: Colors.neonCyan,
    borderColor: Colors.neonCyan,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  actionTitleDone: {
    textDecorationLine: 'line-through',
    color: Colors.textMuted,
  },
  actionDesc: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 2,
    lineHeight: 20,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDim,
    gap: Spacing.md,
  },
  habitItemDone: {},
  habitIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.panelBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  habitLabel: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  habitLabelDone: {
    color: Colors.neonPurple,
  },
  streakGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    flexWrap: 'wrap',
  },
  streakCell: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: Colors.panelBg,
    borderWidth: 1,
    borderColor: Colors.borderDim,
  },
  retroForm: {
    gap: Spacing.md,
  },
  retroField: {},
  retroFieldLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  retroInput: {
    backgroundColor: Colors.panelBg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderDim,
    padding: Spacing.md,
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  northStarInput: {
    backgroundColor: Colors.panelBg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.neonCyan,
    padding: Spacing.md,
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  northStarText: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    lineHeight: 24,
    fontWeight: '500',
  },
});
