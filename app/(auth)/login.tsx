import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { Colors, FontSize, Spacing, BorderRadius } from '../../constants/theme';
import InputField from '../../components/InputField';
import NeonButton from '../../components/NeonButton';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('All fields are required, Commander.');
      return;
    }
    setLoading(true);
    setError('');

    // Simulate auth — replace with Supabase auth
    setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setLoading(false);
      router.replace('/(tabs)');
    }, 1200);
  };

  const handleDemoLogin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <LinearGradient
        colors={[Colors.spaceBlack, Colors.deepSpace, Colors.nebulaDark]}
        style={StyleSheet.absoluteFillObject}
      />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Logo */}
        <View style={styles.logoSection}>
          <Svg width={80} height={80} viewBox="0 0 120 120">
            <Circle cx="60" cy="60" r="55" stroke={Colors.neonCyan} strokeWidth="1" fill="none" opacity={0.3} />
            <Path d="M40 30 L60 90 L80 30 L72 30 L60 72 L48 30 Z" fill={Colors.neonCyan} />
          </Svg>
          <Text style={styles.logoText}>VOYAGE</Text>
          <Text style={styles.logoSubtext}>COMMAND CENTER ACCESS</Text>
        </View>

        {/* Login Form */}
        <View style={styles.formSection}>
          <Text style={styles.welcomeText}>Welcome back, Commander</Text>
          <Text style={styles.instructionText}>Enter your credentials to access Mission Control</Text>

          {error ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

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
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon="lock-closed-outline"
          />

          <NeonButton
            title="ENGAGE"
            onPress={handleLogin}
            loading={loading}
            size="lg"
            style={styles.loginButton}
          />

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <NeonButton
            title="ENTER DEMO MODE"
            onPress={handleDemoLogin}
            variant="secondary"
            size="lg"
            style={styles.demoButton}
          />

          <Pressable onPress={() => router.push('/(auth)/signup')} style={styles.signupLink}>
            <Text style={styles.signupText}>
              New to the fleet?{' '}
              <Text style={styles.signupAccent}>Create your command profile</Text>
            </Text>
          </Pressable>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: Colors.success }]} />
            <Text style={styles.statusText}>ALL SYSTEMS OPERATIONAL</Text>
          </View>
          <Text style={styles.versionText}>VOYAGE v1.0.0 — STARDATE 2026.090</Text>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xxl,
    justifyContent: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
    paddingTop: Spacing.huge,
  },
  logoText: {
    fontSize: FontSize.hero,
    fontWeight: '900',
    color: Colors.neonCyan,
    letterSpacing: 10,
    marginTop: Spacing.lg,
    textShadowColor: Colors.neonCyan,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  logoSubtext: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    letterSpacing: 4,
    marginTop: Spacing.sm,
  },
  formSection: {
    marginBottom: Spacing.xxxl,
  },
  welcomeText: {
    fontSize: FontSize.xxl,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  instructionText: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    marginBottom: Spacing.xxl,
  },
  errorBanner: {
    backgroundColor: Colors.danger + '15',
    borderColor: Colors.danger + '40',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  errorText: {
    color: Colors.danger,
    fontSize: FontSize.sm,
  },
  loginButton: {
    marginTop: Spacing.sm,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xxl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.borderDim,
  },
  dividerText: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    marginHorizontal: Spacing.lg,
    letterSpacing: 2,
  },
  demoButton: {},
  signupLink: {
    marginTop: Spacing.xxl,
    alignItems: 'center',
  },
  signupText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  signupAccent: {
    color: Colors.neonCyan,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: Spacing.huge,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    letterSpacing: 2,
  },
  versionText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    letterSpacing: 1,
    opacity: 0.5,
  },
});
