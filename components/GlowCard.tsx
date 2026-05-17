import React from 'react';
import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, BorderRadius, Spacing, Shadows } from '../constants/theme';

interface GlowCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  glowColor?: string;
  onPress?: () => void;
  variant?: 'default' | 'accent' | 'purple' | 'subtle';
}

export default function GlowCard({ children, style, glowColor, onPress, variant = 'default' }: GlowCardProps) {
  const borderColor = glowColor || (variant === 'purple' ? Colors.borderPurple : variant === 'accent' ? Colors.borderGlow : Colors.borderDim);
  const shadowStyle = variant === 'accent' ? Shadows.glowCyan : variant === 'purple' ? Shadows.glowPurple : Shadows.cardShadow;

  const content = (
    <View style={[styles.card, shadowStyle, { borderColor }, style]}>
      <LinearGradient
        colors={[Colors.cardBg, Colors.panelBg]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.innerContent}>
        {children}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }]}>
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  innerContent: {
    padding: Spacing.lg,
  },
});
