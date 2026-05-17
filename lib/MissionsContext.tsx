import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Mission, MissionStatus } from '../types';
import { Storage, newId } from './storage';

type MissionInput = Partial<Mission> & Pick<Mission, 'company' | 'role'>;

interface MissionsContextValue {
  missions: Mission[];
  loading: boolean;
  addMission: (input: MissionInput) => Promise<Mission>;
  updateMission: (id: string, patch: Partial<Mission>) => Promise<Mission | null>;
  setStatus: (id: string, status: MissionStatus) => Promise<void>;
  deleteMission: (id: string) => Promise<void>;
  getMission: (id: string) => Mission | undefined;
  reload: () => Promise<void>;
}

const MissionsContext = createContext<MissionsContextValue | null>(null);

export function MissionsProvider({ children }: { children: React.ReactNode }) {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const loaded = await Storage.loadMissions();
    setMissions(loaded);
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const persist = useCallback(async (next: Mission[]) => {
    setMissions(next);
    await Storage.saveMissions(next);
  }, []);

  const addMission = useCallback(async (input: MissionInput): Promise<Mission> => {
    const now = new Date().toISOString();
    const mission: Mission = {
      id: newId('m'),
      user_id: 'local',
      status: 'saved',
      ...input,
      created_at: now,
      updated_at: now,
    } as Mission;
    const next = [mission, ...missions];
    await persist(next);
    return mission;
  }, [missions, persist]);

  const updateMission = useCallback(async (id: string, patch: Partial<Mission>): Promise<Mission | null> => {
    let updated: Mission | null = null;
    const next = missions.map(m => {
      if (m.id !== id) return m;
      updated = { ...m, ...patch, updated_at: new Date().toISOString() };
      return updated;
    });
    if (!updated) return null;
    await persist(next);
    return updated;
  }, [missions, persist]);

  const setStatus = useCallback(async (id: string, status: MissionStatus) => {
    await updateMission(id, { status });
  }, [updateMission]);

  const deleteMission = useCallback(async (id: string) => {
    const next = missions.filter(m => m.id !== id);
    await persist(next);
  }, [missions, persist]);

  const getMission = useCallback(
    (id: string) => missions.find(m => m.id === id),
    [missions]
  );

  const value = useMemo<MissionsContextValue>(
    () => ({ missions, loading, addMission, updateMission, setStatus, deleteMission, getMission, reload }),
    [missions, loading, addMission, updateMission, setStatus, deleteMission, getMission, reload]
  );

  return <MissionsContext.Provider value={value}>{children}</MissionsContext.Provider>;
}

export function useMissions(): MissionsContextValue {
  const ctx = useContext(MissionsContext);
  if (!ctx) {
    throw new Error('useMissions must be used inside <MissionsProvider>');
  }
  return ctx;
}
