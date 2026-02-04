import { useCallback } from 'react';
import { useSleepTracker, SleepRecord } from './useSleepTracker';
import { useSleepDiary } from './useSleepDiary';
import type { DiaryEntry } from '@/components/SleepDiaryDialog';

export type HistoryRange = 7 | 30 | 90 | 0; // 0 = all

export interface DaySummary {
  date: string;
  sleepRecord: SleepRecord | null;
  diaryEntry: DiaryEntry | null;
  hasData: boolean;
}

export function useSleepHistory() {
  const {
    sleepRecords,
    getRecordByDate,
    addManualRecord,
    updateRecord,
    deleteRecord,
    formatDuration,
  } = useSleepTracker();

  const { entries: diaryEntries, getEntryByDate } = useSleepDiary();

  const getDaySummaries = useCallback(
    (range: HistoryRange): DaySummary[] => {
      let dateSet = new Set<string>();

      if (range === 0) {
        sleepRecords.forEach((r) => dateSet.add(r.date));
        diaryEntries.forEach((e) => dateSet.add(e.date));
      } else {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - range);
        const cutoffStr = cutoff.toISOString().split('T')[0];
        sleepRecords.forEach((r) => {
          if (r.date >= cutoffStr) dateSet.add(r.date);
        });
        diaryEntries.forEach((e) => {
          if (e.date >= cutoffStr) dateSet.add(e.date);
        });
      }

      const dates = Array.from(dateSet).sort(
        (a, b) => new Date(b).getTime() - new Date(a).getTime()
      );

      return dates.map((date) => {
        const sleepRecord = getRecordByDate(date) ?? null;
        const diaryEntry = getEntryByDate(date) ?? null;
        return {
          date,
          sleepRecord,
          diaryEntry,
          hasData: !!(sleepRecord || diaryEntry),
        };
      });
    },
    [sleepRecords, diaryEntries, getRecordByDate, getEntryByDate]
  );

  return {
    getDaySummaries,
    addManualRecord,
    updateRecord,
    deleteRecord,
    formatDuration,
  };
}
