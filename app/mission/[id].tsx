import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors, FontSize, Spacing, BorderRadius, MissionStatusConfig, MicroCopy } from '../../constants/theme';
import { useMissions } from '../../lib/MissionsContext';
import ScreenHeader from '../../components/ScreenHeader';
import GlowCard from '../../components/GlowCard';
import NeonButton from '../../components/NeonButton';
import StatusBadge from '../../components/StatusBadge';
import ProgressRing from '../../components/ProgressRing';
import { MissionStatus } from '../../types';

const INTERVIEW_PREP = {
  behavioral: [
    'Tell me about a time you led a team through a difficult project.',
    'Describe a situation where you had to make a tough technical decision.',
    'How do you handle disagreements with teammates?',
    'Tell me about your biggest professional failure and what you learned.',
  ],
  technical: [
    'Design a scalable notification system.',
    'How would you optimize a slow database query?',
    'Explain the trade-offs between SSR and CSR.',
    'Walk me through your approach to debugging a production issue.',
  ],
  culture: [
    'What kind of engineering culture do you thrive in?',
    'How do you stay current with new technologies?',
    'What does work-life balance mean to you?',
    'Why are you interested in this company specifically?',
  ],
};

const FOLLOW_UP_TEMPLATES = [
  { label: 'Thank You Note', icon: 'heart-outline', message: 'Thank you for taking the time to speak with me today...' },
  { label: 'Status Check', icon: 'time-outline', message: 'I wanted to follow up on my application and express my continued interest...' },
  { label: 'Post-Interview', icon: 'chatbubble-outline', message: 'I enjoyed our conversation about the role and wanted to share some additional thoughts...' },
];

const STATUS_FLOW: MissionStatus[] = ['saved', 'applied', 'interviewing', 'offer', 'accepted'];

export default function MissionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getMission, setStatus, updateMission, deleteMission } = useMissions();
  const mission = id ? getMission(id) : undefined;

  const [currentStatus, setCurrentStatus] = useState<MissionStatus>(mission?.status ?? 'saved');
  const [notes, setNotes] = useState(mission?.notes || '');
  const [editingNotes, setEditingNotes] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    if (mission) {
      setCurrentStatus(mission.status);
      setNotes(mission.notes || '');
    }
  }, [mission?.id]);

  if (!mission) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center', padding: Spacing.xl }]}>
        <LinearGradient colors={[Colors.spaceBlack, Colors.deepSpace]} style={StyleSheet.absoluteFillObject} />
        <Ionicons name="alert-circle-outline" size={48} color={Colors.textMuted} />
        <Text style={[styles.descriptionText, { textAlign: 'center', marginTop: Spacing.md }]}>
          Mission not found — it may have been deleted.
        </Text>
        <NeonButton title="Back to Mission Control" onPress={() => router.back()} variant="secondary" size="md" style={{ marginTop: Spacing.lg }} />
      </View>
    );
  }

  const salaryText = mission.salary_min && mission.salary_max
    ? `$${(mission.salary_min / 1000).toFixed(0)}K – $${(mission.salary_max / 1000).toFixed(0)}K`
    : '';

  const handleStatusChange = async (newStatus: MissionStatus) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCurrentStatus(newStatus);
    await setStatus(mission.id, newStatus);
  };

  const handleSaveNotes = async () => {
    setEditingNotes(false);
    await updateMission(mission.id, { notes });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleDelete = async () => {
    await deleteMission(mission.id);
    router.back();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.spaceBlack, Colors.deepSpace]}
        style={StyleSheet.absoluteFillObject}
      />
      <ScreenHeader
        title={mission.company}
        subtitle={`MISSION ${mission.id.toUpperCase()}`}
        showBack
        onBack={() => router.back()}
        rightAction={
          <Pressable hitSlop={12}>
            <Ionicons name="ellipsis-horizontal" size={22} color={Colors.textSecondary} />
          </Pressable>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <GlowCard variant="accent" style={styles.heroCard}>
          <View style={styles.heroRow}>
            <View style={styles.heroInfo}>
              <Text style={styles.heroRole}>{mission.role}</Text>
              <Text style={styles.heroCompany}>{mission.company}</Text>
              {mission.location && (
                <View style={styles.metaRow}>
                  <Ionicons name="location-outline" size={14} color={Colors.textMuted} />
                  <Text style={styles.metaText}>{mission.location}</Text>
                </View>
              )}
              {salaryText && (
                <View style={styles.metaRow}>
                  <Ionicons name="cash-outline" size={14} color={Colors.neonCyan} />
                  <Text style={[styles.metaText, { color: Colors.neonCyan, fontWeight: '600' }]}>{salaryText}</Text>
                </View>
              )}
            </View>
            <ProgressRing
              progress={mission.readiness_score || 0}
              size={72}
              color={Colors.neonCyan}
              label="READY"
            />
          </View>
        </GlowCard>

        {/* Status Pipeline */}
        <GlowCard style={styles.section}>
          <Text style={styles.sectionLabel}>MISSION STATUS</Text>
          <View style={styles.statusPipeline}>
            {STATUS_FLOW.map((status, index) => {
              const config = MissionStatusConfig[status];
              const isActive = status === currentStatus;
              const isPast = STATUS_FLOW.indexOf(currentStatus) > index;
              return (
                <Pressable
                  key={status}
                  onPress={() => handleStatusChange(status)}
                  style={[
                    styles.statusStep,
                    isActive && { backgroundColor: config.color + '20', borderColor: config.color },
                    isPast && { backgroundColor: config.color + '10' },
                  ]}
                >
                  <Ionicons
                    name={isActive ? (config.icon as any) : isPast ? 'checkmark-circle' : 'ellipse-outline'}
                    size={16}
                    color={isActive ? config.color : isPast ? config.color : Colors.textMuted}
                  />
                  <Text style={[
                    styles.statusStepText,
                    { color: isActive ? config.color : isPast ? config.color : Colors.textMuted },
                  ]}>
                    {config.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <Pressable
            onPress={() => handleStatusChange('rejected')}
            style={styles.rejectButton}
          >
            <Ionicons name="close-circle-outline" size={14} color={Colors.danger} />
            <Text style={styles.rejectText}>Mark as Rejected</Text>
          </Pressable>
        </GlowCard>

        {/* Description */}
        {mission.description && (
          <GlowCard style={styles.section}>
            <Text style={styles.sectionLabel}>MISSION BRIEFING</Text>
            <Text style={styles.descriptionText}>{mission.description}</Text>
          </GlowCard>
        )}

        {/* Follow-up Scheduler */}
        <GlowCard style={styles.section} variant="subtle">
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>FOLLOW-UP SCHEDULER</Text>
            <Ionicons name="notifications-outline" size={16} color={Colors.neonCyan} />
          </View>
          {mission.follow_up_date && (
            <View style={styles.followUpDate}>
              <Ionicons name="calendar-outline" size={16} color={Colors.warning} />
              <Text style={styles.followUpDateText}>
                Next follow-up: {new Date(mission.follow_up_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </Text>
            </View>
          )}
          <Text style={styles.subsectionTitle}>Message Templates</Text>
          {FOLLOW_UP_TEMPLATES.map((template, i) => (
            <Pressable
              key={i}
              style={styles.templateRow}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Alert.alert(template.label, template.message);
              }}
            >
              <View style={styles.templateIcon}>
                <Ionicons name={template.icon as any} size={16} color={Colors.neonCyan} />
              </View>
              <Text style={styles.templateLabel}>{template.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
            </Pressable>
          ))}
        </GlowCard>

        {/* Interview Prep */}
        <GlowCard style={styles.section} variant="purple">
          <Text style={styles.sectionLabel}>INTERVIEW PREP</Text>
          <Text style={styles.sectionSubtitle}>Prepare for battle, Commander</Text>

          {Object.entries(INTERVIEW_PREP).map(([category, questions]) => (
            <View key={category}>
              <Pressable
                style={styles.prepCategoryHeader}
                onPress={() => setActiveSection(activeSection === category ? null : category)}
              >
                <Text style={styles.prepCategoryTitle}>
                  {category === 'behavioral' ? 'Behavioral' : category === 'technical' ? 'Technical' : 'Culture Fit'}
                </Text>
                <Ionicons
                  name={activeSection === category ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color={Colors.neonPurple}
                />
              </Pressable>
              {activeSection === category && (
                <View style={styles.prepQuestions}>
                  {questions.map((q, i) => (
                    <View key={i} style={styles.prepQuestion}>
                      <Text style={styles.prepQuestionNumber}>Q{i + 1}</Text>
                      <Text style={styles.prepQuestionText}>{q}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </GlowCard>

        {/* Notes */}
        <GlowCard style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>MISSION LOG</Text>
            <Pressable
              onPress={() => {
                if (editingNotes) {
                  handleSaveNotes();
                } else {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setEditingNotes(true);
                }
              }}
              hitSlop={12}
            >
              <Ionicons
                name={editingNotes ? 'checkmark-circle' : 'create-outline'}
                size={18}
                color={editingNotes ? Colors.success : Colors.neonCyan}
              />
            </Pressable>
          </View>
          {editingNotes ? (
            <TextInput
              value={notes}
              onChangeText={setNotes}
              multiline
              autoFocus
              placeholder="Mission intelligence — recruiter name, JD highlights, who I talked to, salary range discussed…"
              placeholderTextColor={Colors.textMuted}
              style={[styles.notesText, { color: Colors.textPrimary, fontStyle: 'normal', minHeight: 80, textAlignVertical: 'top' }]}
              onBlur={handleSaveNotes}
            />
          ) : (
            <Text style={styles.notesText}>{notes || 'No notes yet. Tap the pencil to add mission intelligence.'}</Text>
          )}
        </GlowCard>

        {/* Actions */}
        <View style={styles.actionRow}>
          <NeonButton
            title="DELETE MISSION"
            onPress={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              Alert.alert('Delete Mission', `Permanently delete "${mission.company} — ${mission.role}"?`, [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: handleDelete },
              ]);
            }}
            variant="danger"
            size="md"
            style={{ flex: 1 }}
            icon={<Ionicons name="trash-outline" size={16} color={Colors.danger} />}
          />
        </View>

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
  scrollContent: {
    padding: Spacing.xl,
  },
  heroCard: {
    marginBottom: Spacing.lg,
  },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroInfo: {
    flex: 1,
    marginRight: Spacing.lg,
  },
  heroRole: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  heroCompany: {
    fontSize: FontSize.lg,
    color: Colors.neonCyan,
    fontWeight: '600',
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  metaText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: Spacing.md,
    fontWeight: '600',
  },
  sectionSubtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
    marginTop: -Spacing.sm,
  },
  statusPipeline: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  statusStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.borderDim,
  },
  statusStepText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  rejectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.md,
    alignSelf: 'flex-start',
  },
  rejectText: {
    fontSize: FontSize.sm,
    color: Colors.danger,
    fontWeight: '500',
  },
  descriptionText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  followUpDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Colors.warning + '10',
    borderRadius: BorderRadius.sm,
    borderLeftWidth: 2,
    borderLeftColor: Colors.warning,
    marginBottom: Spacing.lg,
  },
  followUpDateText: {
    fontSize: FontSize.sm,
    color: Colors.warning,
    fontWeight: '600',
  },
  subsectionTitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  templateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDim,
  },
  templateIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.neonCyanSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  templateLabel: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  prepCategoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDim,
  },
  prepCategoryTitle: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.neonPurple,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  prepQuestions: {
    paddingVertical: Spacing.sm,
  },
  prepQuestion: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  prepQuestionNumber: {
    fontSize: FontSize.xs,
    color: Colors.neonPurple,
    fontWeight: '700',
    width: 24,
    marginTop: 2,
  },
  prepQuestionText: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  notesText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
});
