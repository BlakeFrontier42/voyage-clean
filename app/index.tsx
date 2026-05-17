import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  withRepeat,
} from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';
import { Colors, FontSize, Spacing } from '../constants/theme';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.5);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);
  const subtitleOpacity = useSharedValue(0);
  const pulseScale = useSharedValue(1);
  const scanLineY = useSharedValue(-2);

  useEffect(() => {
    // Animate logo
    logoOpacity.value = withTiming(1, { duration: 800 });
    logoScale.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.back(1.5)) });

    // Animate title
    titleOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    titleTranslateY.value = withDelay(400, withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) }));

    // Animate subtitle
    subtitleOpacity.value = withDelay(800, withTiming(1, { duration: 600 }));

    // Pulse effect
    pulseScale.value = withDelay(1000, withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1
    ));

    // Scan line
    scanLineY.value = withDelay(600, withRepeat(
      withTiming(height, { duration: 4000, easing: Easing.linear }),
      -1,
      false
    ));

    // Navigate after delay
    const timer = setTimeout(() => {
      router.replace('/(auth)/login');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: 2 - pulseScale.value,
  }));

  const scanLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanLineY.value }],
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0E1A', '#0D1117', '#111827']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Grid lines background */}
      <View style={styles.gridOverlay}>
        {Array.from({ length: 20 }).map((_, i) => (
          <View key={`h${i}`} style={[styles.gridLineH, { top: i * (height / 20) }]} />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <View key={`v${i}`} style={[styles.gridLineV, { left: i * (width / 10) }]} />
        ))}
      </View>

      {/* Scan line */}
      <Animated.View style={[styles.scanLine, scanLineStyle]} />

      {/* Pulse ring */}
      <Animated.View style={[styles.pulseRing, pulseAnimatedStyle]} />

      {/* Logo */}
      <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
        <Svg width={120} height={120} viewBox="0 0 120 120">
          <Circle cx="60" cy="60" r="55" stroke={Colors.neonCyan} strokeWidth="1" fill="none" opacity={0.3} />
          <Circle cx="60" cy="60" r="45" stroke={Colors.neonPurple} strokeWidth="0.5" fill="none" opacity={0.2} />
          <Path
            d="M40 30 L60 90 L80 30 L72 30 L60 72 L48 30 Z"
            fill={Colors.neonCyan}
          />
          <Circle cx="60" cy="55" r="12" stroke={Colors.neonPurple} strokeWidth="1" fill="none" opacity={0.4} />
        </Svg>
      </Animated.View>

      {/* Title */}
      <Animated.View style={titleAnimatedStyle}>
        <Text style={styles.title}>VOYAGE</Text>
      </Animated.View>

      {/* Subtitle */}
      <Animated.View style={subtitleAnimatedStyle}>
        <Text style={styles.subtitle}>CAREER COMMAND CENTER</Text>
        <View style={styles.divider} />
        <Text style={styles.tagline}>Chart your course through the stars</Text>
      </Animated.View>

      {/* Bottom status */}
      <Animated.View style={[styles.bottomStatus, subtitleAnimatedStyle]}>
        <View style={styles.statusDot} />
        <Text style={styles.statusText}>INITIALIZING SYSTEMS...</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.spaceBlack,
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.03,
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: Colors.neonCyan,
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: Colors.neonCyan,
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.neonCyan,
    opacity: 0.08,
    shadowColor: Colors.neonCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  pulseRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.neonCyan,
    opacity: 0.1,
  },
  logoContainer: {
    marginBottom: Spacing.xxl,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: Colors.neonCyan,
    letterSpacing: 16,
    textAlign: 'center',
    textShadowColor: Colors.neonCyan,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    letterSpacing: 6,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
  divider: {
    width: 60,
    height: 1,
    backgroundColor: Colors.neonPurple,
    alignSelf: 'center',
    marginVertical: Spacing.lg,
    opacity: 0.5,
  },
  tagline: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  bottomStatus: {
    position: 'absolute',
    bottom: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.neonCyan,
    shadowColor: Colors.neonCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  statusText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    letterSpacing: 3,
  },
});
