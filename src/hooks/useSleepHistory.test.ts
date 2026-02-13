import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSleepHistory } from './useSleepHistory';
import { useSleepTracker } from './useSleepTracker';
import { useSleepDiary } from './useSleepDiary';
import { setStorageJson } from '@/lib/storage';

const SLEEP_RECORDS_KEY = 'sunnahSleepRecords';
const DIARY_KEY = 'sunnahSleepDiary';

describe('useSleepHistory', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns empty summaries when no data', () => {
    const { result } = renderHook(() => useSleepHistory());

    expect(result.current.getDaySummaries(7)).toEqual([]);
    expect(result.current.getDaySummaries(0)).toEqual([]);
  });

  it('getDaySummaries merges sleep records and diary entries by date', async () => {
    const d1 = new Date();
    d1.setDate(d1.getDate() - 1);
    const d2 = new Date();
    d2.setDate(d2.getDate() - 5);
    const date1 = d1.toISOString().split('T')[0];
    const date2 = d2.toISOString().split('T')[0];

    setStorageJson(SLEEP_RECORDS_KEY, [
      {
        id: 'sleep-1',
        date: date1,
        bedtime: d1.toISOString(),
        wakeTime: new Date(d1.getTime() + 8 * 60 * 60 * 1000).toISOString(),
        duration: 420,
        madeIsha: true,
        madeFajr: true,
        quality: 'good',
      },
    ]);

    setStorageJson(DIARY_KEY, [
      {
        id: 'diary-1',
        date: date1,
        sleepNotes: '',
        dreamNotes: '',
        mood: 'good',
        dreamType: 'none',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'diary-2',
        date: date2,
        sleepNotes: '',
        dreamNotes: '',
        mood: null,
        dreamType: null,
        createdAt: new Date().toISOString(),
      },
    ]);

    const { result } = renderHook(() => useSleepHistory());

    const summaries = result.current.getDaySummaries(7);
    const day1 = summaries.find((s) => s.date === date1);
    expect(day1).toBeDefined();
    expect(day1?.sleepRecord).toBeTruthy();
    expect(day1?.diaryEntry).toBeTruthy();
    expect(day1?.hasData).toBe(true);
  });

  it('addManualRecord and deleteRecord work through hook', () => {
    const { result } = renderHook(() => useSleepHistory());

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split('T')[0];

    act(() => {
      result.current.addManualRecord({
        date: dateStr,
        bedtime: yesterday.toISOString(),
        wakeTime: new Date(yesterday.getTime() + 8 * 60 * 60 * 1000).toISOString(),
        duration: 420,
        madeIsha: true,
        madeFajr: true,
        quality: 'excellent',
      });
    });

    const summaries = result.current.getDaySummaries(0);
    const day = summaries.find((s) => s.date === dateStr);
    expect(day?.sleepRecord).toBeTruthy();
    expect(day?.sleepRecord?.quality).toBe('excellent');

    act(() => {
      result.current.deleteRecord(day!.sleepRecord!.id);
    });

    const afterDelete = result.current.getDaySummaries(0);
    const dayAfter = afterDelete.find((s) => s.date === dateStr);
    expect(dayAfter?.sleepRecord).toBeNull();
  });

  it('formatDuration is passed through', () => {
    const { result } = renderHook(() => useSleepHistory());
    expect(result.current.formatDuration(90)).toBe('1h 30m');
  });
});
