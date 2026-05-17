import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, FadeIn, FadeOut } from 'react-native-reanimated';
import { Colors, FontSize, Spacing, BorderRadius } from '../../constants/theme';
import InputField from '../../components/InputField';
import NeonButton from '../../components/NeonButton';
import GlowCard from '../../components/GlowCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SKILL_OPTIONS = [
  'React', 'React Native', 'TypeScript', 'JavaScript', 'Python', 'Node.js',
  'Go', 'Rust', 'Java', 'Swift', 'System Design', 'AWS', 'Docker',
  'Kubernetes', 'GraphQL', 'PostgreSQL', 'MongoDB', 'Redis',
  'Machine Learning', 'Data Science', 'Product Management', 'UX Design',
  'Leadership', 'Communication', 'Project Management',
];

export default function SignUpScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [northStar, setNorthStar] = useState('');

  const steps = [
    { title: 'Create Account', subtitle: 'Join the fleet' },
    { title: 'Commander Profile', subtitle: 'Tell us about yourself' },
    { title: 'Skill Matrix', subtitle: 'Select your core competencies' },
    { title: 'North Star', subtitle: 'Set your destination' },
  ];

  const progress = ((step + 1) / steps.length) * 100;

  const nextStep = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleSignUp();
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const toggleSkill = (skill: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleSignUp = async () => {
    setLoading(true);
    // Simulate signup — replace with Supabase auth
    setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setLoading(false);
      router.replace('/(tabs)');
    }, 1500);
  };

  const canProceed = () => {
    switch (step) {
      case 0: return email.length > 0 && password.length >= 6;
      case 1: return fullName.length > 0;
      case 2: return selectedSkills.length >= 3;
      case 3: return northStar.length > 0;
      default: return true;
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <LinearGradient
        colors={[Colors.spaceBlack, Colors.deepSpace]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={prevStep} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color={Colors.neonCyan} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.stepLabel}>STEP {step + 1} OF {steps.length}</Text>
          <Text style={styles.stepTitle}>{steps[step].title}</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      {/* Progress bar */}
      <View style={styles.progressBar}>
        <LinearGradient
          colors={[Colors.neonCyan, Colors.neonPurple]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.progressFill, { width: `${progress}%` }]}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Step 0: Account */}
        {step === 0 && (
          <Animated.View entering={FadeIn.duration(300)} style={styles.stepContent}>
            <Text style={styles.sectionTitle}>Initialize your command credentials</Text>
            <InputField
              label="Email"
              placeholder="commander@voyage.app"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              icon="mail-outline"
            />
            <InputField
              label="Access Code"
              placeholder="Minimum 6 characters"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              icon="lock-closed-outline"
            />
          </Animated.View>
        )}

        {/* Step 1: Profile */}
        {step === 1 && (
          <Animated.View entering={FadeIn.duration(300)} style={styles.stepContent}>
            <Text style={styles.sectionTitle}>Configure your commander profile</Text>
            <InputField
              label="Full Name"
              placeholder="Your name, Commander"
              value={fullName}
              onChangeText={setFullName}
              icon="person-outline"
            />
            <InputField
              label="Bio"
              placeholder="Tell us about your mission background..."
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={4}
              icon="document-text-outline"
            />
          </Animated.View>
        )}

        {/* Step 2: Skills */}
        {step === 2 && (
          <Animated.View entering={FadeIn.duration(300)} style={styles.stepContent}>
            <Text style={styles.sectionTitle}>Select your core competencies</Text>
            <Text style={styles.sectionHint}>Choose at least 3 skills for your Talent DNA profile</Text>
            <View style={styles.skillGrid}>
              {SKILL_OPTIONS.map(skill => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <Pressable
                    key={skill}
                    onPress={() => toggleSkill(skill)}
                    style={[
                      styles.skillChip,
                      isSelected && styles.skillChipSelected,
                    ]}
                  >
                    <Text style={[styles.skillChipText, isSelected && styles.skillChipTextSelected]}>
                      {skill}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark" size={14} color={Colors.spaceBlack} />
                    )}
                  </Pressable>
                );
              })}
            </View>
            <Text style={styles.selectedCount}>
              {selectedSkills.length} selected — {selectedSkills.length >= 3 ? 'Skill matrix calibrated' : `Need ${3 - selectedSkills.length} more`}
            </Text>
          </Animated.View>
        )}

        {/* Step 3: North Star */}
        {step === 3 && (
          <Animated.View entering={FadeIn.duration(300)} style={styles.stepContent}>
            <GlowCard variant="accent" style={styles.northStarCard}>
              <Ionicons name="star" size={32} color={Colors.neonCyan} style={{ marginBottom: Spacing.md }} />
              <Text style={styles.northStarTitle}>Set Your North Star</Text>
              <Text style={styles.northStarDesc}>
                Your North Star is your ultimate career destination. It guides every mission, every decision, every course correction.
              </Text>
            </GlowCard>
            <InputField
              label="North Star Goal"
              placeholder="e.g., Become a Staff Engineer at a mission-driven company by 2027"
              value={northStar}
              onChangeText={setNorthStar}
              multiline
              numberOfLines={3}
              icon="compass-outline"
            />
          </Animated.View>
        )}

        {/* Action button */}
        <View style={styles.actionSection}>
          <NeonButton
            title={step === steps.length - 1 ? 'LAUNCH VOYAGE' : 'CONTINUE'}
            onPress={nextStep}
            disabled={!canProceed()}
            loading={loading}
            size="lg"
            icon={step === steps.length - 1 ? <Ionicons name="rocket" size={20} color={Colors.spaceBlack} /> : undefined}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.spaceBlack,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: 60,
    paddingBottom: Spacing.md,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  stepLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    letterSpacing: 3,
  },
  stepTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  progressBar: {
    height: 3,
    backgroundColor: Colors.borderDim,
    marginHorizontal: Spacing.xl,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.xxxl,
  },
  stepContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.xxl,
  },
  sectionHint: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    marginBottom: Spacing.lg,
    marginTop: -Spacing.lg,
  },
  skillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.borderDim,
    backgroundColor: Colors.panelBg,
  },
  skillChipSelected: {
    backgroundColor: Colors.neonCyan,
    borderColor: Colors.neonCyan,
  },
  skillChipText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  skillChipTextSelected: {
    color: Colors.spaceBlack,
    fontWeight: '700',
  },
  selectedCount: {
    fontSize: FontSize.sm,
    color: Colors.neonCyan,
    marginTop: Spacing.lg,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  northStarCard: {
    marginBottom: Spacing.xxl,
    alignItems: 'center',
  },
  northStarTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.neonCyan,
    marginBottom: Spacing.sm,
  },
  northStarDesc: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  actionSection: {
    paddingVertical: Spacing.xxxl,
    paddingBottom: Spacing.huge,
  },
});
