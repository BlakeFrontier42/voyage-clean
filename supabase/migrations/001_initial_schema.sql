-- Voyage Career OS — Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  bio TEXT,
  avatar_url TEXT,
  skills TEXT[] DEFAULT '{}',
  north_star_goal TEXT,
  archetypes TEXT[] DEFAULT '{}',
  risk_tolerance INTEGER DEFAULT 5 CHECK (risk_tolerance >= 1 AND risk_tolerance <= 10),
  coach_mode TEXT DEFAULT 'chill' CHECK (coach_mode IN ('chill', 'drill_sergeant')),
  is_job_seeker BOOLEAN DEFAULT TRUE,
  streak_count INTEGER DEFAULT 0,
  career_energy INTEGER DEFAULT 50,
  theme_primary TEXT DEFAULT '#00F5FF',
  theme_accent TEXT DEFAULT '#8A2BE2',
  theme_mode TEXT DEFAULT 'dark' CHECK (theme_mode IN ('dark', 'light', 'custom')),
  notification_prefs JSONB DEFAULT '{"daily_brief": true, "follow_up_reminders": true, "streak_alerts": true, "weekly_retro": true}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MISSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  salary_min INTEGER,
  salary_max INTEGER,
  status TEXT DEFAULT 'saved' CHECK (status IN ('saved', 'applied', 'interviewing', 'offer', 'accepted', 'rejected')),
  description TEXT,
  url TEXT,
  location TEXT,
  notes TEXT,
  applied_date DATE,
  follow_up_date DATE,
  interview_dates DATE[] DEFAULT '{}',
  readiness_score INTEGER DEFAULT 0 CHECK (readiness_score >= 0 AND readiness_score <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CONTACTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  company TEXT,
  role TEXT,
  email TEXT,
  phone TEXT,
  birthday DATE,
  hobbies TEXT[] DEFAULT '{}',
  how_we_met TEXT,
  last_interaction DATE,
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- HABIT ENTRIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS habit_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  habits_completed TEXT[] DEFAULT '{}',
  notes TEXT,
  UNIQUE(user_id, date)
);

-- ============================================
-- WEEKLY RETROS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS weekly_retros (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  wins TEXT[] DEFAULT '{}',
  challenges TEXT[] DEFAULT '{}',
  learnings TEXT[] DEFAULT '{}',
  next_week_goals TEXT[] DEFAULT '{}',
  energy_level INTEGER DEFAULT 5 CHECK (energy_level >= 1 AND energy_level <= 10),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_retros ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only access their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Missions: users can only access their own missions
CREATE POLICY "Users can view own missions" ON missions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own missions" ON missions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own missions" ON missions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own missions" ON missions FOR DELETE USING (auth.uid() = user_id);

-- Contacts: users can only access their own contacts
CREATE POLICY "Users can view own contacts" ON contacts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own contacts" ON contacts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own contacts" ON contacts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own contacts" ON contacts FOR DELETE USING (auth.uid() = user_id);

-- Habit entries: users can only access their own entries
CREATE POLICY "Users can view own habits" ON habit_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own habits" ON habit_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own habits" ON habit_entries FOR UPDATE USING (auth.uid() = user_id);

-- Weekly retros: users can only access their own retros
CREATE POLICY "Users can view own retros" ON weekly_retros FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own retros" ON weekly_retros FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own retros" ON weekly_retros FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_missions_user_id ON missions(user_id);
CREATE INDEX idx_missions_status ON missions(status);
CREATE INDEX idx_contacts_user_id ON contacts(user_id);
CREATE INDEX idx_habit_entries_user_id_date ON habit_entries(user_id, date);
CREATE INDEX idx_weekly_retros_user_id ON weekly_retros(user_id);

-- ============================================
-- TRIGGER: Auto-update updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER missions_updated_at BEFORE UPDATE ON missions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- FUNCTION: Auto-create profile on signup
-- ============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
