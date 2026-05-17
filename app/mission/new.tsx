import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors, FontSize, Spacing, BorderRadius, MissionStatusConfig } from '../../constants/theme';
import InputField from '../../components/InputField';
import NeonButton from '../../components/NeonButton';
import ScreenHeader from '../../components/ScreenHeader';
import { MissionStatus } from '../../types';
import { useMissions } from '../../lib/MissionsContext';

function parseSalary(input: string): number | undefined {
  const cleaned = input.replace(/[^0-9.]/g, '');
  if (!cleaned) return undefined;
  const n = parseFloat(cleaned);
  if (!Number.isFinite(n)) return undefined;
  return n < 1000 ? Math.round(n * 1000) : Math.round(n);
}

export default function NewMissionScreen() {
  const router = useRouter();
  const { addMission } = useMissions();
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [location, setLocation] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<MissionStatus>('saved');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!company.trim() || !role.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Missing info', 'Company and role are required.');
      return;
    }
    if (saving) return;
    setSaving(true);
    try {
      await addMission({
        company: company.trim(),
        role: role.trim(),
        salary_min: parseSalary(salaryMin),
        salary_max: parseSalary(salaryMax),
        location: location.trim() || undefined,
        url: url.trim() || undefined,
        description: description.trim() || undefined,
        status,
        notes: notes.trim() || undefined,
        applied_date: status === 'applied' || status === 'interviewing' ? new Date().toISOString().slice(0, 10) : undefined,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (err) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Save failed', String(err));
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.spaceBlack, Colors.deepSpace]}
        style={StyleSheet.absoluteFillObject}
      />
      <ScreenHeader
        title="New Mission"
        subtitle="TARGET ACQUIRED"
        showBack
        onBack={() => router.back()}
      />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <InputField
            label="Company"
            placeholder="Target organization"
            value={company}
            onChangeText={setCompany}
            icon="business-outline"
          />
          <InputField
            label="Role"
            placeholder="Position designation"
            value={role}
            onChangeText={setRole}
            icon="briefcase-outline"
          />

          <View style={styles.row}>
            <InputField
              label="Salary Min"
              placeholder="$000K"
              value={salaryMin}
              onChangeText={setSalaryMin}
              keyboardType="numeric"
              icon="cash-outline"
              style={{ flex: 1 }}
            />
            <InputField
              label="Salary Max"
              placeholder="$000K"
              value={salaryMax}
              onChangeText={setSalaryMax}
              keyboardType="numeric"
              icon="cash-outline"
              style={{ flex: 1 }}
            />
          </View>

          <InputField
            label="Location"
            placeholder="Remote, Hybrid, or On-site"
            value={location}
            onChangeText={setLocation}
            icon="location-outline"
          />

          <InputField
            label="Job URL"
            placeholder="https://..."
            value={url}
            onChangeText={setUrl}
            keyboardType="default"
            autoCapitalize="none"
            icon="link-outline"
          />

          {/* Status selector */}
          <Text style={styles.fieldLabel}>INITIAL STATUS</Text>
          <View style={styles.statusRow}>
            {(['saved', 'applied', 'interviewing'] as MissionStatus[]).map(s => {
              const config = MissionStatusConfig[s];
              const isActive = s === status;
              return (
                <Pressable
                  key={s}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setStatus(s);
                  }}
                  style={[
                    styles.statusChip,
                    isActive && { backgroundColor: config.color + '20', borderColor: config.color },
                  ]}
                >
                  <Ionicons name={config.icon as any} size={14} color={isActive ? config.color : Colors.textMuted} />
                  <Text style={[styles.statusChipText, { color: isActive ? config.color : Colors.textMuted }]}>
                    {config.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <InputField
            label="Description"
            placeholder="Mission briefing details..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            icon="document-text-outline"
          />

          <InputField
            label="Notes"
            placeholder="Intelligence gathered..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            icon="create-outline"
          />

          <NeonButton
            title={saving ? 'LAUNCHING…' : 'LAUNCH MISSION'}
            onPress={handleSave}
            size="lg"
            style={styles.saveButton}
            disabled={saving}
            icon={<Ionicons name="rocket" size={20} color={Colors.spaceBlack} />}
          />

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
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
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  fieldLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  statusRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.borderDim,
  },
  statusChipText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  saveButton: {
    marginTop: Spacing.lg,
  },
});
