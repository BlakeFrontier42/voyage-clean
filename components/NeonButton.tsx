import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors, FontSize, BorderRadius, Spacing, Shadows } from '../constants/theme';

interface NeonButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
}

export default function NeonButton({ title, onPress, variant = 'primary', size = 'md', loading, disabled, style, icon }: NeonButtonProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  const sizeStyles = {
    sm: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg, fontSize: FontSize.sm },
    md: { paddingVertical: Spacing.md + 2, paddingHorizontal: Spacing.xl, fontSize: FontSize.md },
    lg: { paddingVertical: Spacing.lg, paddingHorizontal: Spacing.xxl, fontSize: FontSize.lg },
  };

  if (variant === 'primary') {
    return (
      <Pressable
        onPress={handlePress}
        disabled={disabled || loading}
        style={({ pressed }) => [{ opacity: pressed ? 0.8 : disabled ? 0.5 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] }, style]}
      >
        <LinearGradient
          colors={[Colors.neonCyan, Colors.neonPurple]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.button, { paddingVertical: sizeStyles[size].paddingVertical, paddingHorizontal: sizeStyles[size].paddingHorizontal }, Shadows.glowCyan]}
        >
          {loading ? (
            <ActivityIndicator color={Colors.spaceBlack} />
          ) : (
            <>
              {icon}
              <Text style={[styles.primaryText, { fontSize: sizeStyles[size].fontSize }]}>{title}</Text>
            </>
          )}
        </LinearGradient>
      </Pressable>
    );
  }

  const variantStyles = {
    secondary: { bg: Colors.neonCyanGlow, border: Colors.borderGlow, text: Colors.neonCyan },
    ghost: { bg: 'transparent', border: Colors.borderDim, text: Colors.textSecondary },
    danger: { bg: Colors.danger + '15', border: Colors.danger + '40', text: Colors.danger },
  };

  const vs = variantStyles[variant];

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: vs.bg, borderColor: vs.border, borderWidth: 1, paddingVertical: sizeStyles[size].paddingVertical, paddingHorizontal: sizeStyles[size].paddingHorizontal, opacity: pressed ? 0.8 : disabled ? 0.5 : 1 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={vs.text} />
      ) : (
        <>
          {icon}
          <Text style={[styles.secondaryText, { color: vs.text, fontSize: sizeStyles[size].fontSize }]}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  primaryText: {
    color: Colors.spaceBlack,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  secondaryText: {
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
