// Voyage Deep-Space Command Center Theme
export const Colors = {
  // Core backgrounds
  spaceBlack: '#0A0E1A',
  deepSpace: '#0D1117',
  nebulaDark: '#111827',
  panelBg: '#141B2D',
  cardBg: '#1A2332',
  surfaceElevated: '#1E293B',
  
  // Neon accents
  neonCyan: '#00F5FF',
  neonCyanDim: '#00C4CC',
  neonCyanGlow: 'rgba(0, 245, 255, 0.15)',
  neonCyanSoft: 'rgba(0, 245, 255, 0.08)',
  neonPurple: '#8A2BE2',
  neonPurpleDim: '#6B21A8',
  neonPurpleGlow: 'rgba(138, 43, 226, 0.15)',
  neonMagenta: '#FF00FF',
  neonMagentaDim: '#CC00CC',
  
  // Status colors
  statusApplied: '#3B82F6',
  statusInterviewing: '#F59E0B',
  statusOffer: '#10B981',
  statusRejected: '#EF4444',
  statusSaved: '#6B7280',
  statusAccepted: '#00F5FF',
  
  // Text
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textAccent: '#00F5FF',
  
  // Borders
  borderDim: 'rgba(148, 163, 184, 0.1)',
  borderGlow: 'rgba(0, 245, 255, 0.3)',
  borderPurple: 'rgba(138, 43, 226, 0.3)',
  
  // Gradients
  gradientCyanStart: '#00F5FF',
  gradientCyanEnd: '#8A2BE2',
  gradientDarkStart: '#0A0E1A',
  gradientDarkEnd: '#141B2D',
  
  // Utility
  danger: '#EF4444',
  warning: '#F59E0B',
  success: '#10B981',
  info: '#3B82F6',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

export const FontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
  xxxl: 28,
  hero: 36,
};

export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  xxl: 24,
  full: 999,
};

export const Shadows = {
  glowCyan: {
    shadowColor: Colors.neonCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  glowPurple: {
    shadowColor: Colors.neonPurple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
};

export const MissionStatusConfig: Record<string, { color: string; label: string; icon: string }> = {
  saved: { color: Colors.statusSaved, label: 'Saved', icon: 'bookmark-outline' },
  applied: { color: Colors.statusApplied, label: 'Applied', icon: 'send' },
  interviewing: { color: Colors.statusInterviewing, label: 'Interviewing', icon: 'chatbubbles-outline' },
  offer: { color: Colors.statusOffer, label: 'Offer', icon: 'trophy-outline' },
  accepted: { color: Colors.statusAccepted, label: 'Accepted', icon: 'checkmark-circle-outline' },
  rejected: { color: Colors.statusRejected, label: 'Rejected', icon: 'close-circle-outline' },
};

// Sci-fi micro-copy
export const MicroCopy = {
  followUp: 'Lock on: Follow-up in 48 hours',
  escapeVelocity: 'Escape velocity detected',
  courseCorrection: 'Course correction confirmed',
  missionBriefing: 'Morning Mission Brief',
  engageWarp: 'Engage warp drive',
  systemsOnline: 'All systems online',
  scanComplete: 'Scan complete',
  targetAcquired: 'Target acquired',
  missionAccepted: 'Mission accepted',
  transmissionSent: 'Transmission sent',
  shieldsUp: 'Shields up — Privacy enabled',
  redAlert: 'Red Alert — Action required',
};
