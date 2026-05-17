import AsyncStorage from '@react-native-async-storage/async-storage';
import { Mission, Contact, UserProfile } from '../types';

const KEYS = {
  missions: 'voyage:missions:v1',
  contacts: 'voyage:contacts:v1',
  profile: 'voyage:profile:v1',
  habits: 'voyage:habits:v1',
} as const;

async function readJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJSON<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export const Storage = {
  async loadMissions(): Promise<Mission[]> {
    return readJSON<Mission[]>(KEYS.missions, []);
  },
  async saveMissions(missions: Mission[]): Promise<void> {
    await writeJSON(KEYS.missions, missions);
  },

  async loadContacts(): Promise<Contact[]> {
    return readJSON<Contact[]>(KEYS.contacts, []);
  },
  async saveContacts(contacts: Contact[]): Promise<void> {
    await writeJSON(KEYS.contacts, contacts);
  },

  async loadProfile(fallback: UserProfile): Promise<UserProfile> {
    return readJSON<UserProfile>(KEYS.profile, fallback);
  },
  async saveProfile(profile: UserProfile): Promise<void> {
    await writeJSON(KEYS.profile, profile);
  },

  async loadHabits<T = unknown>(fallback: T): Promise<T> {
    return readJSON<T>(KEYS.habits, fallback);
  },
  async saveHabits<T = unknown>(habits: T): Promise<void> {
    await writeJSON(KEYS.habits, habits);
  },

  async clearAll(): Promise<void> {
    await AsyncStorage.multiRemove(Object.values(KEYS));
  },
};

export function newId(prefix: string = 'm'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
