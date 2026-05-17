import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, BorderRadius, Spacing } from '../constants/theme';

interface InputFieldProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  icon?: string;
  style?: ViewStyle;
  error?: string;
}

export default function InputField({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  multiline,
  numberOfLines = 1,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  icon,
  style,
  error,
}: InputFieldProps) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, focused && styles.inputFocused, error ? styles.inputError : null]}>
        {icon && <Ionicons name={icon as any} size={18} color={focused ? Colors.neonCyan : Colors.textMuted} style={styles.icon} />}
        <TextInput
          style={[styles.input, multiline && { height: numberOfLines * 24, textAlignVertical: 'top' }]}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          multiline={multiline}
          numberOfLines={numberOfLines}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          selectionColor={Colors.neonCyan}
        />
        {secureTextEntry && (
          <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={Colors.textMuted} />
          </Pressable>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.panelBg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderDim,
    paddingHorizontal: Spacing.md,
  },
  inputFocused: {
    borderColor: Colors.neonCyan,
    shadowColor: Colors.neonCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  inputError: {
    borderColor: Colors.danger,
  },
  icon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    paddingVertical: Spacing.md + 2,
  },
  eyeIcon: {
    padding: Spacing.sm,
  },
  errorText: {
    fontSize: FontSize.sm,
    color: Colors.danger,
    marginTop: Spacing.xs,
  },
});
