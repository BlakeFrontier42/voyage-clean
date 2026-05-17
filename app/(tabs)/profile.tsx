import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Switch, Alert, Share, Modal,
  TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, FontSize, Spacing, BorderRadius, MicroCopy } from '../../constants/theme';
import { demoProfile, demoMissions } from '../../lib/store';
import GlowCard from '../../components/GlowCard';
import NeonButton from '../../components/NeonButton';
import ProgressRing from '../../components/ProgressRing';
import InputField from '../../components/InputField';

type TabView = 'preview' | 'settings';

const THEME_COLORS = [
  { label: 'Cyan', value: '#00F5FF' },
  { label: 'Purple', value: '#8A2BE2' },
  { label: 'Magenta', value: '#FF00FF' },
  { label: 'Green', value: '#10B981' },
  { label: 'Gold', value: '#F59E0B' },
  { label: 'Red', value: '#EF4444' },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabView>('preview');
  const [showEditModal, setShowEditModal] = useState(false);

  // Settings state
  const [isJobSeeker, setIsJobSeeker] = useState(demoProfile.is_job_seeker);
  const [coachMode, setCoachMode] = useState(demoProfile.coach_mode);
  const [primaryColor, setPrimaryColor] = useState(demoProfile.theme_primary || '#00F5FF');
  const [accentColor, setAccentColor] = useState(demoProfile.theme_accent || '#8A2BE2');
  const [themeMode, setThemeMode] = useState(demoProfile.theme_mode);
  const [notifPrefs, setNotifPrefs] = useState(demoProfile.notification_prefs);

  // Edit form state
  const [editName, setEditName] = useState(demoProfile.full_name);
  const [editBio, setEditBio] = useState(demoProfile.bio || '');
  const [editNorthStar, setEditNorthStar] = useState(demoProfile.north_star_goal || '');

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await Share.share({
        message: `Check out my Voyage career profile: https://voyage.app/profile/${demoProfile.id}`,
        title: `${demoProfile.full_name} — Voyage Profile`,
      });
    } catch (e) {}
  };

  const handleExportCSV = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Export Started', 'Your career data CSV is being prepared. You\'ll receive a download link shortly.');
  };

  const activeMissions = demoMissions.filter(m => !['rejected'].includes(m.status)).length;
  const offers = demoMissions.filter(m => m.status === 'offer').length;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={[Colors.spaceBlack, Colors.deepSpace]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <Pressable onPress={() => setShowEditModal(true)} style={styles.editButton}>
          <Ionicons name="create-outline" size={20} color={Colors.neonCyan} />
        </Pressable>
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabRow}>
        <Pressable
          onPress={() => setActiveTab('preview')}
          style={[styles.tab, activeTab === 'preview' && styles.tabActive]}
        >
          <Ionicons name="eye-outline" size={16} color={activeTab === 'preview' ? Colors.neonCyan : Colors.textMuted} />
          <Text style={[styles.tabText, activeTab === 'preview' && styles.tabTextActive]}>Preview</Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab('settings')}
          style={[styles.tab, activeTab === 'settings' && styles.tabActive]}
        >
          <Ionicons name="settings-outline" size={16} color={activeTab === 'settings' ? Colors.neonCyan : Colors.textMuted} />
          <Text style={[styles.tabText, activeTab === 'settings' && styles.tabTextActive]}>Settings</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'preview' ? (
          // PUBLIC PROFILE PREVIEW
          <>
            {/* Profile Card */}
            <Animated.View entering={FadeInDown.delay(100).duration(400)}>
              <GlowCard variant="accent" style={styles.profileCard}>
                <View style={styles.profileHeader}>
                  <LinearGradient
                    colors={[Colors.neonCyan, Colors.neonPurple]}
                    style={styles.profileAvatar}
                  >
                    <Text style={styles.profileAvatarText}>
                      {demoProfile.full_name.split(' ').map(n => n[0]).join('')}
                    </Text>
                  </LinearGradient>
                  <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>{demoProfile.full_name}</Text>
                    <View style={styles.modeBadge}>
                      <Ionicons
                        name={isJobSeeker ? 'search-outline' : 'briefcase-outline'}
                        size={12}
                        color={Colors.neonCyan}
                      />
                      <Text style={styles.modeBadgeText}>
                        {isJobSeeker ? 'Open to Opportunities' : 'Freelance Mode'}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.profileBio}>{demoProfile.bio}</Text>

                {/* Stats Row */}
                <View style={styles.profileStats}>
                  <View style={styles.profileStat}>
                    <Text style={styles.profileStatValue}>{activeMissions}</Text>
                    <Text style={styles.profileStatLabel}>Missions</Text>
                  </View>
                  <View style={styles.profileStatDivider} />
                  <View style={styles.profileStat}>
                    <Text style={styles.profileStatValue}>{demoProfile.streak_count}d</Text>
                    <Text style={styles.profileStatLabel}>Streak</Text>
                  </View>
                  <View style={styles.profileStatDivider} />
                  <View style={styles.profileStat}>
                    <Text style={styles.profileStatValue}>{demoProfile.career_energy}</Text>
                    <Text style={styles.profileStatLabel}>Energy</Text>
                  </View>
                  <View style={styles.profileStatDivider} />
                  <View style={styles.profileStat}>
                    <Text style={styles.profileStatValue}>{offers}</Text>
                    <Text style={styles.profileStatLabel}>Offers</Text>
                  </View>
                </View>
              </GlowCard>
            </Animated.View>

            {/* Skills */}
            <Animated.View entering={FadeInDown.delay(200).duration(400)}>
              <GlowCard style={styles.section}>
                <Text style={styles.sectionLabel}>SKILL MATRIX</Text>
                <View style={styles.skillsGrid}>
                  {demoProfile.skills.map(skill => (
                    <View key={skill} style={styles.skillPill}>
                      <Text style={styles.skillPillText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              </GlowCard>
            </Animated.View>

            {/* Archetypes */}
            <Animated.View entering={FadeInDown.delay(300).duration(400)}>
              <GlowCard variant="purple" style={styles.section}>
                <Text style={styles.sectionLabel}>TALENT DNA</Text>
                <View style={styles.archetypeRow}>
                  {(demoProfile.archetypes || []).map(arch => (
                    <View key={arch} style={styles.archetypeChip}>
                      <Ionicons
                        name={arch === 'Builder' ? 'construct-outline' : arch === 'Strategist' ? 'bulb-outline' : 'compass-outline'}
                        size={16}
                        color={Colors.neonPurple}
                      />
                      <Text style={styles.archetypeText}>{arch}</Text>
                    </View>
                  ))}
                </View>
              </GlowCard>
            </Animated.View>

            {/* North Star */}
            <Animated.View entering={FadeInDown.delay(400).duration(400)}>
              <GlowCard variant="accent" style={styles.section}>
                <View style={styles.northStarHeader}>
                  <Ionicons name="star" size={20} color={Colors.neonCyan} />
                  <Text style={styles.sectionLabel}>NORTH STAR</Text>
                </View>
                <Text style={styles.northStarText}>{demoProfile.north_star_goal}</Text>
              </GlowCard>
            </Animated.View>

            {/* Mode Toggle & Share */}
            <Animated.View entering={FadeInDown.delay(500).duration(400)}>
              <View style={styles.modeToggleRow}>
                <Text style={styles.modeToggleLabel}>
                  {isJobSeeker ? 'Job Seeker Mode' : 'Freelance Mode'}
                </Text>
                <Switch
                  value={!isJobSeeker}
                  onValueChange={(val) => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    setIsJobSeeker(!val);
                  }}
                  trackColor={{ false: Colors.neonCyan + '40', true: Colors.neonPurple + '40' }}
                  thumbColor={isJobSeeker ? Colors.neonCyan : Colors.neonPurple}
                />
              </View>

              <NeonButton
                title="SHARE PROFILE LINK"
                onPress={handleShare}
                size="lg"
                icon={<Ionicons name="share-outline" size={18} color={Colors.spaceBlack} />}
              />
            </Animated.View>
          </>
        ) : (
          // SETTINGS
          <>
            {/* Profile Editing */}
            <Animated.View entering={FadeInDown.delay(100).duration(400)}>
              <GlowCard style={styles.section}>
                <Text style={styles.sectionLabel}>COMMANDER PROFILE</Text>
                <Pressable style={styles.settingsRow} onPress={() => setShowEditModal(true)}>
                  <Ionicons name="person-outline" size={18} color={Colors.neonCyan} />
                  <Text style={styles.settingsRowText}>Edit Profile</Text>
                  <Text style={styles.settingsRowValue}>{demoProfile.full_name}</Text>
                  <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
                </Pressable>
                <Pressable style={styles.settingsRow}>
                  <Ionicons name="image-outline" size={18} color={Colors.neonCyan} />
                  <Text style={styles.settingsRowText}>Change Avatar</Text>
                  <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
                </Pressable>
                <Pressable style={styles.settingsRow}>
                  <Ionicons name="star-outline" size={18} color={Colors.neonCyan} />
                  <Text style={styles.settingsRowText}>North Star Goal</Text>
                  <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
                </Pressable>
              </GlowCard>
            </Animated.View>

            {/* Theme Customization */}
            <Animated.View entering={FadeInDown.delay(200).duration(400)}>
              <GlowCard variant="purple" style={styles.section}>
                <Text style={styles.sectionLabel}>THEME CUSTOMIZATION</Text>

                <Text style={styles.settingsSubLabel}>Primary Color</Text>
                <View style={styles.colorRow}>
                  {THEME_COLORS.map(c => (
                    <Pressable
                      key={c.value}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setPrimaryColor(c.value);
                      }}
                      style={[
                        styles.colorDot,
                        { backgroundColor: c.value },
                        primaryColor === c.value && styles.colorDotSelected,
                      ]}
                    />
                  ))}
                </View>

                <Text style={styles.settingsSubLabel}>Accent Color</Text>
                <View style={styles.colorRow}>
                  {THEME_COLORS.map(c => (
                    <Pressable
                      key={c.value}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setAccentColor(c.value);
                      }}
                      style={[
                        styles.colorDot,
                        { backgroundColor: c.value },
                        accentColor === c.value && styles.colorDotSelected,
                      ]}
                    />
                  ))}
                </View>

                <Text style={styles.settingsSubLabel}>Theme Mode</Text>
                <View style={styles.themeModeRow}>
                  {(['dark', 'light', 'custom'] as const).map(mode => (
                    <Pressable
                      key={mode}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setThemeMode(mode);
                      }}
                      style={[styles.themeModeChip, themeMode === mode && styles.themeModeChipActive]}
                    >
                      <Ionicons
                        name={mode === 'dark' ? 'moon-outline' : mode === 'light' ? 'sunny-outline' : 'color-palette-outline'}
                        size={16}
                        color={themeMode === mode ? Colors.neonPurple : Colors.textMuted}
                      />
                      <Text style={[styles.themeModeText, themeMode === mode && { color: Colors.neonPurple }]}>
                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </GlowCard>
            </Animated.View>

            {/* Notifications */}
            <Animated.View entering={FadeInDown.delay(300).duration(400)}>
              <GlowCard style={styles.section}>
                <Text style={styles.sectionLabel}>NOTIFICATIONS</Text>
                {[
                  { key: 'daily_brief', label: 'Daily Mission Brief', icon: 'newspaper-outline' },
                  { key: 'follow_up_reminders', label: 'Follow-up Reminders', icon: 'notifications-outline' },
                  { key: 'streak_alerts', label: 'Streak Alerts', icon: 'flame-outline' },
                  { key: 'weekly_retro', label: 'Weekly Retrospective', icon: 'calendar-outline' },
                ].map(item => (
                  <View key={item.key} style={styles.notifRow}>
                    <Ionicons name={item.icon as any} size={18} color={Colors.textSecondary} />
                    <Text style={styles.notifLabel}>{item.label}</Text>
                    <Switch
                      value={notifPrefs[item.key as keyof typeof notifPrefs]}
                      onValueChange={(val) => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setNotifPrefs(prev => ({ ...prev, [item.key]: val }));
                      }}
                      trackColor={{ false: Colors.borderDim, true: Colors.neonCyan + '40' }}
                      thumbColor={notifPrefs[item.key as keyof typeof notifPrefs] ? Colors.neonCyan : Colors.textMuted}
                    />
                  </View>
                ))}
              </GlowCard>
            </Animated.View>

            {/* Coach Mode */}
            <Animated.View entering={FadeInDown.delay(400).duration(400)}>
              <GlowCard style={styles.section}>
                <Text style={styles.sectionLabel}>COACH MODE</Text>
                <View style={styles.coachModeRow}>
                  {(['chill', 'drill_sergeant'] as const).map(mode => (
                    <Pressable
                      key={mode}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        setCoachMode(mode);
                      }}
                      style={[styles.coachModeChip, coachMode === mode && styles.coachModeChipActive]}
                    >
                      <Ionicons
                        name={mode === 'chill' ? 'leaf-outline' : 'barbell-outline'}
                        size={18}
                        color={coachMode === mode ? Colors.neonCyan : Colors.textMuted}
                      />
                      <Text style={[styles.coachModeText, coachMode === mode && { color: Colors.neonCyan }]}>
                        {mode === 'chill' ? 'Chill' : 'Drill Sergeant'}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </GlowCard>
            </Animated.View>

            {/* Data & Privacy */}
            <Animated.View entering={FadeInDown.delay(500).duration(400)}>
              <GlowCard style={styles.section}>
                <Text style={styles.sectionLabel}>DATA & PRIVACY</Text>
                <Pressable style={styles.settingsRow} onPress={handleExportCSV}>
                  <Ionicons name="download-outline" size={18} color={Colors.neonCyan} />
                  <Text style={styles.settingsRowText}>Export Data (CSV)</Text>
                  <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
                </Pressable>
                <Pressable style={styles.settingsRow}>
                  <Ionicons name="shield-checkmark-outline" size={18} color={Colors.neonCyan} />
                  <Text style={styles.settingsRowText}>Privacy Controls</Text>
                  <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
                </Pressable>
                <Pressable style={styles.settingsRow}>
                  <Ionicons name="document-text-outline" size={18} color={Colors.textMuted} />
                  <Text style={styles.settingsRowText}>Terms of Service</Text>
                  <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
                </Pressable>
                <Pressable style={styles.settingsRow}>
                  <Ionicons name="lock-closed-outline" size={18} color={Colors.textMuted} />
                  <Text style={styles.settingsRowText}>Privacy Policy</Text>
                  <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
                </Pressable>
              </GlowCard>
            </Animated.View>

            {/* Sign Out */}
            <Animated.View entering={FadeInDown.delay(600).duration(400)}>
              <NeonButton
                title="SIGN OUT"
                onPress={() => {
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                  Alert.alert('Sign Out', 'Are you sure you want to leave the bridge?', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Sign Out', style: 'destructive', onPress: () => router.replace('/(auth)/login') },
                  ]);
                }}
                variant="danger"
                size="lg"
                icon={<Ionicons name="log-out-outline" size={18} color={Colors.danger} />}
              />
              <Text style={styles.versionText}>VOYAGE v1.0.0 — {MicroCopy.shieldsUp}</Text>
            </Animated.View>
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={showEditModal} animationType="slide" presentationStyle="pageSheet">
        <KeyboardAvoidingView style={styles.modalContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <LinearGradient colors={[Colors.spaceBlack, Colors.deepSpace]} style={StyleSheet.absoluteFillObject} />
          <View style={styles.modalHeader}>
            <Pressable onPress={() => setShowEditModal(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </Pressable>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <Pressable onPress={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              setShowEditModal(false);
            }}>
              <Text style={styles.modalSave}>Save</Text>
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.modalContent} keyboardShouldPersistTaps="handled">
            <View style={styles.modalAvatarSection}>
              <LinearGradient colors={[Colors.neonCyan, Colors.neonPurple]} style={styles.modalAvatar}>
                <Text style={styles.modalAvatarText}>
                  {editName.split(' ').map(n => n[0]).join('')}
                </Text>
              </LinearGradient>
              <Pressable style={styles.changeAvatarBtn}>
                <Text style={styles.changeAvatarText}>Change Photo</Text>
              </Pressable>
            </View>
            <InputField label="Full Name" value={editName} onChangeText={setEditName} icon="person-outline" />
            <InputField label="Bio" value={editBio} onChangeText={setEditBio} multiline numberOfLines={4} icon="document-text-outline" />
            <InputField label="North Star Goal" value={editNorthStar} onChangeText={setEditNorthStar} multiline numberOfLines={3} icon="star-outline" />

            <Text style={styles.settingsSubLabel}>Skills</Text>
            <View style={styles.skillsGrid}>
              {demoProfile.skills.map(skill => (
                <View key={skill} style={styles.skillPill}>
                  <Text style={styles.skillPillText}>{skill}</Text>
                  <Ionicons name="close" size={12} color={Colors.neonCyan} />
                </View>
              ))}
              <Pressable style={styles.addSkillBtn}>
                <Ionicons name="add" size={16} color={Colors.neonCyan} />
                <Text style={styles.addSkillText}>Add Skill</Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
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
  headerTitle: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neonCyanSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderGlow,
  },
  tabRow: {
    flexDirection: 'row',
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderDim,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  tabActive: {
    backgroundColor: Colors.neonCyanGlow,
  },
  tabText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tabTextActive: {
    color: Colors.neonCyan,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  // Profile Preview
  profileCard: {
    marginBottom: Spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarText: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.spaceBlack,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  modeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  modeBadgeText: {
    fontSize: FontSize.sm,
    color: Colors.neonCyan,
    fontWeight: '500',
  },
  profileBio: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.borderDim,
  },
  profileStat: {
    alignItems: 'center',
  },
  profileStatValue: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.neonCyan,
  },
  profileStatLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  profileStatDivider: {
    width: 1,
    backgroundColor: Colors.borderDim,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  skillPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.neonCyanGlow,
    borderWidth: 1,
    borderColor: Colors.borderGlow,
  },
  skillPillText: {
    fontSize: FontSize.sm,
    color: Colors.neonCyan,
    fontWeight: '500',
  },
  archetypeRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  archetypeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.neonPurpleGlow,
    borderWidth: 1,
    borderColor: Colors.borderPurple,
  },
  archetypeText: {
    fontSize: FontSize.md,
    color: Colors.neonPurple,
    fontWeight: '600',
  },
  northStarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  northStarText: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    lineHeight: 24,
    fontWeight: '500',
  },
  modeToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.panelBg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderDim,
    marginBottom: Spacing.lg,
  },
  modeToggleLabel: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  // Settings
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md + 2,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDim,
  },
  settingsRowText: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  settingsRowValue: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  settingsSubLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.md,
    marginTop: Spacing.md,
  },
  colorRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  colorDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorDotSelected: {
    borderColor: Colors.white,
    shadowColor: Colors.white,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  themeModeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  themeModeChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderDim,
  },
  themeModeChipActive: {
    borderColor: Colors.neonPurple,
    backgroundColor: Colors.neonPurpleGlow,
  },
  themeModeText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDim,
  },
  notifLabel: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  coachModeRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  coachModeChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderDim,
  },
  coachModeChipActive: {
    borderColor: Colors.neonCyan,
    backgroundColor: Colors.neonCyanGlow,
  },
  coachModeText: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  versionText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.xl,
    letterSpacing: 1,
  },
  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.spaceBlack,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: 60,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDim,
  },
  modalTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  modalCancel: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  modalSave: {
    fontSize: FontSize.md,
    color: Colors.neonCyan,
    fontWeight: '700',
  },
  modalContent: {
    padding: Spacing.xl,
  },
  modalAvatarSection: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  modalAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalAvatarText: {
    fontSize: FontSize.xxxl,
    fontWeight: '800',
    color: Colors.spaceBlack,
  },
  changeAvatarBtn: {
    marginTop: Spacing.md,
  },
  changeAvatarText: {
    fontSize: FontSize.md,
    color: Colors.neonCyan,
    fontWeight: '600',
  },
  addSkillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.borderGlow,
    borderStyle: 'dashed',
  },
  addSkillText: {
    fontSize: FontSize.sm,
    color: Colors.neonCyan,
    fontWeight: '500',
  },
});
