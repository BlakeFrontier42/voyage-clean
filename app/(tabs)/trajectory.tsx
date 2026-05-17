import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Svg, { Path, Circle, Defs, LinearGradient as SvgGradient, Stop, Line, Text as SvgText } from 'react-native-svg';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, FontSize, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { demoTrajectoryData, demoProfile } from '../../lib/store';
import GlowCard from '../../components/GlowCard';
import ProgressRing from '../../components/ProgressRing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRAPH_WIDTH = SCREEN_WIDTH - 48;
const GRAPH_HEIGHT = 220;
const GRAPH_PADDING = { top: 20, right: 16, bottom: 30, left: 40 };

const TIME_RANGES = ['1M', '3M', '6M', 'ALL'];

const ARCHETYPES = [
  { name: 'Builder', icon: 'construct-outline', score: 92, color: Colors.neonCyan },
  { name: 'Strategist', icon: 'bulb-outline', score: 85, color: Colors.neonPurple },
  { name: 'Explorer', icon: 'compass-outline', score: 78, color: Colors.warning },
  { name: 'Connector', icon: 'people-outline', score: 65, color: Colors.success },
];

export default function TrajectoryScreen() {
  const insets = useSafeAreaInsets();
  const [selectedRange, setSelectedRange] = useState('3M');
  const [selectedMetric, setSelectedMetric] = useState<'energy' | 'applications' | 'interviews'>('energy');
  const [riskTolerance, setRiskTolerance] = useState(demoProfile.risk_tolerance || 7);

  const data = demoTrajectoryData;
  const metricData = data.map(d => d[selectedMetric]);
  const maxVal = Math.max(...metricData);
  const minVal = Math.min(...metricData);
  const range = maxVal - minVal || 1;

  const plotWidth = GRAPH_WIDTH - GRAPH_PADDING.left - GRAPH_PADDING.right;
  const plotHeight = GRAPH_HEIGHT - GRAPH_PADDING.top - GRAPH_PADDING.bottom;

  const points = metricData.map((val, i) => ({
    x: GRAPH_PADDING.left + (i / (metricData.length - 1)) * plotWidth,
    y: GRAPH_PADDING.top + plotHeight - ((val - minVal) / range) * plotHeight,
  }));

  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx1 = prev.x + (curr.x - prev.x) / 3;
    const cpx2 = prev.x + (2 * (curr.x - prev.x)) / 3;
    pathD += ` C ${cpx1} ${prev.y}, ${cpx2} ${curr.y}, ${curr.x} ${curr.y}`;
  }
  const areaD = pathD + ` L ${points[points.length - 1].x} ${GRAPH_HEIGHT - GRAPH_PADDING.bottom} L ${points[0].x} ${GRAPH_HEIGHT - GRAPH_PADDING.bottom} Z`;

  const metricColor = selectedMetric === 'energy' ? Colors.neonCyan : selectedMetric === 'applications' ? Colors.neonPurple : Colors.warning;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={[Colors.spaceBlack, Colors.deepSpace]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerLabel}>ESCAPE VELOCITY</Text>
          <Text style={styles.headerTitle}>Career Trajectory</Text>
        </View>
        <View style={styles.headerBadge}>
          <Ionicons name="trending-up" size={16} color={Colors.success} />
          <Text style={styles.headerBadgeText}>+12%</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Time Range Selector */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <View style={styles.rangeRow}>
            {TIME_RANGES.map(r => (
              <Pressable
                key={r}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedRange(r);
                }}
                style={[styles.rangeChip, selectedRange === r && styles.rangeChipActive]}
              >
                <Text style={[styles.rangeText, selectedRange === r && styles.rangeTextActive]}>{r}</Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Metric Selector */}
        <Animated.View entering={FadeInDown.delay(150).duration(400)}>
          <View style={styles.metricRow}>
            {[
              { key: 'energy', label: 'Energy', icon: 'flash-outline', color: Colors.neonCyan },
              { key: 'applications', label: 'Applied', icon: 'send-outline', color: Colors.neonPurple },
              { key: 'interviews', label: 'Interviews', icon: 'chatbubbles-outline', color: Colors.warning },
            ].map(m => (
              <Pressable
                key={m.key}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedMetric(m.key as any);
                }}
                style={[styles.metricChip, selectedMetric === m.key && { borderColor: m.color, backgroundColor: m.color + '10' }]}
              >
                <Ionicons name={m.icon as any} size={14} color={selectedMetric === m.key ? m.color : Colors.textMuted} />
                <Text style={[styles.metricText, selectedMetric === m.key && { color: m.color }]}>{m.label}</Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Full Graph */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <GlowCard variant="accent" style={styles.graphCard}>
            <Svg width={GRAPH_WIDTH} height={GRAPH_HEIGHT}>
              <Defs>
                <SvgGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor={metricColor} stopOpacity="0.25" />
                  <Stop offset="1" stopColor={metricColor} stopOpacity="0" />
                </SvgGradient>
              </Defs>

              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
                const y = GRAPH_PADDING.top + plotHeight * (1 - pct);
                const val = Math.round(minVal + range * pct);
                return (
                  <React.Fragment key={i}>
                    <Line x1={GRAPH_PADDING.left} y1={y} x2={GRAPH_WIDTH - GRAPH_PADDING.right} y2={y} stroke={Colors.borderDim} strokeWidth={0.5} />
                    <SvgText x={GRAPH_PADDING.left - 6} y={y + 4} fill={Colors.textMuted} fontSize={9} textAnchor="end">{val}</SvgText>
                  </React.Fragment>
                );
              })}

              {/* Date labels */}
              {data.filter((_, i) => i % 2 === 0).map((d, i) => {
                const idx = data.indexOf(d);
                const x = GRAPH_PADDING.left + (idx / (data.length - 1)) * plotWidth;
                const dateStr = new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                return (
                  <SvgText key={i} x={x} y={GRAPH_HEIGHT - 8} fill={Colors.textMuted} fontSize={9} textAnchor="middle">{dateStr}</SvgText>
                );
              })}

              {/* Area fill */}
              <Path d={areaD} fill="url(#areaGradient)" />

              {/* Line */}
              <Path d={pathD} stroke={metricColor} strokeWidth={2.5} fill="none" strokeLinecap="round" />

              {/* Data points */}
              {points.map((p, i) => (
                <React.Fragment key={i}>
                  <Circle cx={p.x} cy={p.y} r={6} fill={metricColor} opacity={0.15} />
                  <Circle cx={p.x} cy={p.y} r={3} fill={metricColor} />
                </React.Fragment>
              ))}

              {/* Glow on last point */}
              <Circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r={8} fill={metricColor} opacity={0.2} />
            </Svg>
          </GlowCard>
        </Animated.View>

        {/* Talent DNA */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <GlowCard variant="purple" style={styles.section}>
            <Text style={styles.sectionLabel}>TALENT DNA</Text>
            <Text style={styles.sectionTitle}>Archetype Profile</Text>

            <View style={styles.archetypeGrid}>
              {ARCHETYPES.map(arch => (
                <View key={arch.name} style={styles.archetypeItem}>
                  <ProgressRing progress={arch.score} size={64} color={arch.color} strokeWidth={5} />
                  <Text style={styles.archetypeName}>{arch.name}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.sectionLabel}>TOP SKILLS</Text>
            <View style={styles.skillsRow}>
              {demoProfile.skills.slice(0, 6).map(skill => (
                <View key={skill} style={styles.skillTag}>
                  <Text style={styles.skillTagText}>{skill}</Text>
                </View>
              ))}
            </View>
          </GlowCard>
        </Animated.View>

        {/* Risk Tolerance */}
        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
          <GlowCard style={styles.section}>
            <Text style={styles.sectionLabel}>RISK TOLERANCE</Text>
            <View style={styles.riskRow}>
              <Text style={styles.riskLabel}>Conservative</Text>
              <View style={styles.riskTrack}>
                {Array.from({ length: 10 }).map((_, i) => (
                  <Pressable
                    key={i}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setRiskTolerance(i + 1);
                    }}
                    style={[
                      styles.riskDot,
                      i < riskTolerance && { backgroundColor: i < 4 ? Colors.success : i < 7 ? Colors.warning : Colors.danger },
                    ]}
                  />
                ))}
              </View>
              <Text style={styles.riskLabel}>Bold</Text>
            </View>
            <Text style={styles.riskValue}>
              Level {riskTolerance}/10 — {riskTolerance <= 3 ? 'Playing it safe' : riskTolerance <= 6 ? 'Balanced approach' : riskTolerance <= 8 ? 'Calculated risks' : 'Maximum warp'}
            </Text>
          </GlowCard>
        </Animated.View>

        {/* North Star */}
        <Animated.View entering={FadeInDown.delay(500).duration(400)}>
          <GlowCard variant="accent" style={styles.section}>
            <View style={styles.northStarRow}>
              <Ionicons name="star" size={24} color={Colors.neonCyan} />
              <View style={styles.northStarInfo}>
                <Text style={styles.sectionLabel}>NORTH STAR</Text>
                <Text style={styles.northStarText}>{demoProfile.north_star_goal}</Text>
              </View>
            </View>
          </GlowCard>
        </Animated.View>

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  headerLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.success + '15',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.success + '30',
  },
  headerBadgeText: {
    fontSize: FontSize.sm,
    color: Colors.success,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
  },
  rangeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  rangeChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.borderDim,
  },
  rangeChipActive: {
    backgroundColor: Colors.neonCyanGlow,
    borderColor: Colors.neonCyan,
  },
  rangeText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  rangeTextActive: {
    color: Colors.neonCyan,
  },
  metricRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  metricChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderDim,
  },
  metricText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  graphCard: {
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  archetypeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.xxl,
  },
  archetypeItem: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  archetypeName: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  skillTag: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.neonPurpleGlow,
    borderWidth: 1,
    borderColor: Colors.borderPurple,
  },
  skillTagText: {
    fontSize: FontSize.sm,
    color: Colors.neonPurple,
    fontWeight: '500',
  },
  riskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  riskLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  riskTrack: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  riskDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.borderDim,
    borderWidth: 1,
    borderColor: Colors.borderDim,
  },
  riskValue: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  northStarRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
    alignItems: 'flex-start',
  },
  northStarInfo: {
    flex: 1,
  },
  northStarText: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    lineHeight: 24,
    fontWeight: '500',
  },
});
