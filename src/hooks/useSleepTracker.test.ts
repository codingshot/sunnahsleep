import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSleepTracker } from './useSleepTracker';

const SLEEP_RECORDS_KEY = 'sunnahSleepRecords';
const CURRENT_SLEEP_KEY = 'sunnahCurrentSleep';

describe('useSleepTracker', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts with empty records', () => {
    const { result } = renderHook(() => useSleepTracker());
    expect(result.current.sleepRecords).toEqual([]);
    expect(result.current.isSleeping).toBe(false);
  });

  it('startSleep sets isSleeping and currentSleep', () => {
    const { result } = renderHook(() => useSleepTracker());

    act(() => {
      result.current.startSleep(true);
    });

    expect(result.current.isSleeping).toBe(true);
    expect(result.current.currentSleep).toBeTruthy();
    expect(result.current.currentSleep?.madeIsha).toBe(true);
  });

  it('endSleep creates a record and clears current sleep', () => {
    const { result } = renderHook(() => useSleepTracker());

    act(() => {
      result.current.startSleep(true);
    });

    vi.advanceTimersByTime(8 * 60 * 60 * 1000); // 8 hours

    act(() => {
      result.current.endSleep(true, 'good');
    });

    expect(result.current.isSleeping).toBe(false);
    expect(result.current.currentSleep).toBeNull();
    expect(result.current.sleepRecords).toHaveLength(1);
    expect(result.current.sleepRecords[0].madeIsha).toBe(true);
    expect(result.current.sleepRecords[0].madeFajr).toBe(true);
    expect(result.current.sleepRecords[0].quality).toBe('good');
    expect(result.current.sleepRecords[0].duration).toBeGreaterThan(0);
  });

  it('addManualRecord adds a record for a past date', () => {
    const { result } = renderHook(() => useSleepTracker());

    const record = {
      date: '2026-02-01',
      bedtime: '2026-02-01T23:30:00.000Z',
      wakeTime: '2026-02-02T06:00:00.000Z',
      duration: 390, // 6.5 hours
      madeIsha: true,
      madeFajr: true,
      quality: 'good' as const,
    };

    act(() => {
      result.current.addManualRecord(record);
    });

    expect(result.current.sleepRecords).toHaveLength(1);
    expect(result.current.sleepRecords[0].date).toBe('2026-02-01');
    expect(result.current.sleepRecords[0].duration).toBe(390);
    expect(result.current.sleepRecords[0].id).toMatch(/^sleep-/);
  });

  it('addManualRecord returns null if date already exists', () => {
    const { result } = renderHook(() => useSleepTracker());

    const record = {
      date: '2026-02-01',
      bedtime: '2026-02-01T23:30:00.000Z',
      wakeTime: '2026-02-02T06:00:00.000Z',
      duration: 390,
      madeIsha: true,
      madeFajr: true,
      quality: 'good' as const,
    };

    act(() => {
      result.current.addManualRecord(record);
    });

    let addResult: ReturnType<typeof result.current.addManualRecord>;
    act(() => {
      addResult = result.current.addManualRecord(record);
    });

    expect(addResult).toBeNull();
    expect(result.current.sleepRecords).toHaveLength(1);
  });

  it('updateRecord updates an existing record', () => {
    const { result } = renderHook(() => useSleepTracker());

    act(() => {
      result.current.addManualRecord({
        date: '2026-02-01',
        bedtime: '2026-02-01T23:30:00.000Z',
        wakeTime: '2026-02-02T06:00:00.000Z',
        duration: 390,
        madeIsha: true,
        madeFajr: true,
        quality: 'good',
      });
    });

    const id = result.current.sleepRecords[0].id;

    act(() => {
      result.current.updateRecord(id, { quality: 'excellent' });
    });

    expect(result.current.sleepRecords[0].quality).toBe('excellent');
  });

  it('deleteRecord removes a record', () => {
    const { result } = renderHook(() => useSleepTracker());

    act(() => {
      result.current.addManualRecord({
        date: '2026-02-01',
        bedtime: '2026-02-01T23:30:00.000Z',
        wakeTime: '2026-02-02T06:00:00.000Z',
        duration: 390,
        madeIsha: true,
        madeFajr: true,
        quality: 'good',
      });
    });

    const id = result.current.sleepRecords[0].id;

    act(() => {
      result.current.deleteRecord(id);
    });

    expect(result.current.sleepRecords).toHaveLength(0);
  });

  it('getRecordByDate returns record for date', () => {
    const { result } = renderHook(() => useSleepTracker());

    act(() => {
      result.current.addManualRecord({
        date: '2026-02-01',
        bedtime: '2026-02-01T23:30:00.000Z',
        wakeTime: '2026-02-02T06:00:00.000Z',
        duration: 390,
        madeIsha: true,
        madeFajr: true,
        quality: 'good',
      });
    });

    const found = result.current.getRecordByDate('2026-02-01');
    expect(found).toBeTruthy();
    expect(found?.date).toBe('2026-02-01');

    const notFound = result.current.getRecordByDate('2026-02-02');
    expect(notFound).toBeNull();
  });

  it('getRecordsInRange filters by days', () => {
    const { result } = renderHook(() => useSleepTracker());

    const today = new Date();
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const tenDaysAgo = new Date(today);
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

    act(() => {
      result.current.addManualRecord({
        date: threeDaysAgo.toISOString().split('T')[0],
        bedtime: threeDaysAgo.toISOString(),
        wakeTime: new Date(threeDaysAgo.getTime() + 8 * 60 * 60 * 1000).toISOString(),
        duration: 480,
        madeIsha: true,
        madeFajr: true,
        quality: 'good',
      });
      result.current.addManualRecord({
        date: tenDaysAgo.toISOString().split('T')[0],
        bedtime: tenDaysAgo.toISOString(),
        wakeTime: new Date(tenDaysAgo.getTime() + 8 * 60 * 60 * 1000).toISOString(),
        duration: 480,
        madeIsha: true,
        madeFajr: true,
        quality: 'good',
      });
    });

    const inRange = result.current.getRecordsInRange(7);
    expect(inRange).toHaveLength(1);
    expect(inRange[0].date).toBe(threeDaysAgo.toISOString().split('T')[0]);
  });

  it('formatDuration formats correctly', () => {
    const { result } = renderHook(() => useSleepTracker());

    expect(result.current.formatDuration(90)).toBe('1h 30m');
    expect(result.current.formatDuration(480)).toBe('8h 0m');
    expect(result.current.formatDuration(0)).toBe('0h 0m');
    expect(result.current.formatDuration(-10)).toBe('0h 0m');
  });
});
