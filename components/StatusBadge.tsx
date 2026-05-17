import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MissionStatusConfig, FontSize, BorderRadius, Spacing } from '../constants/theme';
import { MissionStatus } from '../types';

interface StatusBadgeProps {
  status: MissionStatus;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = MissionStatusConfig[status];
  const isSmall = size === 'sm';

  return (
    <View style={[styles.badge, { backgroundColor: config.color + '20', borderColor: config.color + '40' }, isSmall && styles.badgeSm]}>
      <Ionicons name={config.icon as any} size={isSmall ? 10 : 12} color={config.color} />
      <Text style={[styles.label, { color: config.color }, isSmall && styles.labelSm]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  badgeSm: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  labelSm: {
    fontSize: FontSize.xs,
  },
});
