export type MissionStatus = 'saved' | 'applied' | 'interviewing' | 'offer' | 'accepted' | 'rejected';

export interface Mission {
  id: string;
  user_id: string;
  company: string;
  role: string;
  salary_min?: number;
  salary_max?: number;
  status: MissionStatus;
  description?: string;
  url?: string;
  location?: string;
  notes?: string;
  applied_date?: string;
  follow_up_date?: string;
  interview_dates?: string[];
  readiness_score?: number;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  bio?: string;
  avatar_url?: string;
  skills: string[];
  north_star_goal?: string;
  archetypes?: string[];
  risk_tolerance?: number;
  coach_mode: 'chill' | 'drill_sergeant';
  is_job_seeker: boolean;
  streak_count: number;
  career_energy: number;
  theme_primary?: string;
  theme_accent?: string;
  theme_mode: 'dark' | 'light' | 'custom';
  notification_prefs: NotificationPrefs;
  created_at: string;
  updated_at: string;
}

export interface NotificationPrefs {
  daily_brief: boolean;
  follow_up_reminders: boolean;
  streak_alerts: boolean;
  weekly_retro: boolean;
}

export interface Contact {
  id: string;
  user_id: string;
  name: string;
  company?: string;
  role?: string;
  email?: string;
  phone?: string;
  birthday?: string;
  hobbies?: string[];
  how_we_met?: string;
  last_interaction?: string;
  notes?: string;
  tags?: string[];
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface HabitEntry {
  id: string;
  user_id: string;
  date: string;
  habits_completed: string[];
  notes?: string;
}

export interface WeeklyRetro {
  id: string;
  user_id: string;
  week_start: string;
  wins: string[];
  challenges: string[];
  learnings: string[];
  next_week_goals: string[];
  energy_level: number;
}

export interface CoachingAction {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  type: 'follow_up' | 'apply' | 'network' | 'skill' | 'self_care';
}

export interface MessageTemplate {
  id: string;
  type: 'birthday' | 'congrats' | 'check_in' | 'restart_thread' | 'thank_you';
  label: string;
  template: string;
}

export interface TrajectoryDataPoint {
  date: string;
  applications: number;
  responses: number;
  interviews: number;
  energy: number;
}
