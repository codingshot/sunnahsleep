# Test Implementation Examples

Concrete code examples for SunnahSleep tests.

## localStorage Mock Helper

```ts
// src/test/test-utils.ts
export function createLocalStorageMock() {
  const store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { Object.keys(store).forEach(k => delete store[k]); }),
    _store: store,
  };
}

export function mockLocalStorage() {
  const mock = createLocalStorageMock();
  Object.defineProperty(window, 'localStorage', { value: mock });
  return mock;
}
```

## useChecklist Example

```ts
// src/hooks/useChecklist.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useChecklist } from './useChecklist';

describe('useChecklist', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('toggles item completion', () => {
    const { result } = renderHook(() => useChecklist());
    const firstId = result.current.items[0].id;

    act(() => result.current.toggleItem(firstId));

    expect(result.current.items[0].completed).toBe(true);
    act(() => result.current.toggleItem(firstId));
    expect(result.current.items[0].completed).toBe(false);
  });

  it('incrementTasbih caps subhanAllah at 33', () => {
    const { result } = renderHook(() => useChecklist());

    for (let i = 0; i < 35; i++) {
      act(() => result.current.incrementTasbih('subhanAllah'));
    }

    expect(result.current.tasbih.subhanAllah).toBe(33);
  });

  it('incrementTasbih caps allahuAkbar at 34', () => {
    const { result } = renderHook(() => useChecklist());

    for (let i = 0; i < 40; i++) {
      act(() => result.current.incrementTasbih('allahuAkbar'));
    }

    expect(result.current.tasbih.allahuAkbar).toBe(34);
  });

  it('resetTasbih zeros all counts', () => {
    const { result } = renderHook(() => useChecklist());

    act(() => result.current.incrementTasbih('subhanAllah'));
    act(() => result.current.incrementTasbih('subhanAllah'));
    act(() => result.current.resetTasbih());

    expect(result.current.tasbih).toEqual({
      subhanAllah: 0,
      alhamdulillah: 0,
      allahuAkbar: 0,
    });
  });

  it('computes progressPercentage', () => {
    const { result } = renderHook(() => useChecklist());
    const total = result.current.totalCount;

    act(() => result.current.toggleItem(result.current.items[0].id));

    expect(result.current.progressPercentage).toBeCloseTo((1 / total) * 100);
  });
});
```

## useSleepTracker Example

```ts
// src/hooks/useSleepTracker.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSleepTracker } from './useSleepTracker';

describe('useSleepTracker', () => {
  beforeEach(() => localStorage.clear());

  it('startSleep creates currentSleep and sets isSleeping', () => {
    const { result } = renderHook(() => useSleepTracker());

    act(() => result.current.startSleep(true));

    expect(result.current.isSleeping).toBe(true);
    expect(result.current.currentSleep?.madeIsha).toBe(true);
    expect(result.current.currentSleep?.date).toBeDefined();
  });

  it('endSleep completes record and clears current', () => {
    const { result } = renderHook(() => useSleepTracker());

    act(() => result.current.startSleep(true));
    let record: ReturnType<typeof result.current.endSleep>;
    act(() => {
      record = result.current.endSleep(true, 'good') ?? undefined;
    });

    expect(result.current.isSleeping).toBe(false);
    expect(result.current.currentSleep).toBeNull();
    expect(record!.duration).toBeGreaterThanOrEqual(0);
    expect(record!.quality).toBe('good');
  });

  it('formatDuration returns "Xh Ym"', () => {
    const { result } = renderHook(() => useSleepTracker());

    expect(result.current.formatDuration(90)).toBe('1h 30m');
    expect(result.current.formatDuration(60)).toBe('1h 0m');
  });

  it('getStats returns zeros when no records', () => {
    const { result } = renderHook(() => useSleepTracker());

    const stats = result.current.getStats();

    expect(stats).toEqual({
      averageDuration: 0,
      ishaRate: 0,
      fajrRate: 0,
      totalNights: 0,
      thisWeek: 0,
    });
  });
});
```

## checklistData Example

```ts
// src/data/checklistData.test.ts
import { describe, it, expect } from 'vitest';
import {
  checklistItems,
  duas,
  ayatKursi,
  lastTwoAyahBaqarah,
  threeQuls,
} from './checklistData';

describe('checklistData', () => {
  describe('checklistItems', () => {
    it('each item has required fields', () => {
      checklistItems.forEach((item) => {
        expect(item.id).toBeDefined();
        expect(item.title).toBeDefined();
        expect(item.completed).toBe(false);
      });
    });

    it('has expected phase categories', () => {
      const phases = new Set(checklistItems.map((i) => i.phase));
      expect(phases).toContain('evening');
      expect(phases).toContain('bedtime');
      expect(phases).toContain('morning');
    });
  });

  describe('ayatKursi', () => {
    it('has reference 2:255', () => {
      expect(ayatKursi.reference).toContain('2:255');
    });

    it('has arabic and translation', () => {
      expect(ayatKursi.arabic.length).toBeGreaterThan(50);
      expect(ayatKursi.translation).toBeDefined();
    });
  });

  describe('threeQuls', () => {
    it('has exactly 3 surahs', () => {
      expect(threeQuls).toHaveLength(3);
    });

    it('surahs are 112, 113, 114', () => {
      expect(threeQuls.map((q) => q.surah)).toEqual([112, 113, 114]);
    });
  });
});
```

## HadithTooltip Example

```ts
// src/components/HadithTooltip.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HadithTooltip } from './HadithTooltip';

describe('HadithTooltip', () => {
  it('renders trigger with source text', () => {
    render(
      <HadithTooltip
        source="Bukhari"
        hadithReference={{
          collection: 'bukhari',
          hadithNumber: 6320,
          narrator: 'Abu Hurairah',
        }}
      >
        Bukhari 6320
      </HadithTooltip>
    );

    expect(screen.getByRole('button', { name: /Bukhari 6320/i })).toBeInTheDocument();
  });

  it('shows Sunnah.com link with correct URL when hover content opens', async () => {
    render(
      <HadithTooltip
        source="Bukhari"
        hadithReference={{
          collection: 'bukhari',
          hadithNumber: 6320,
          narrator: 'Abu Hurairah',
        }}
      />
    );

    // Radix HoverCard opens on pointer enter
    const trigger = screen.getByRole('button');
    trigger.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true }));
    const link = await screen.findByRole('link', { name: /View on Sunnah.com/i });
    expect(link).toHaveAttribute('href', 'https://sunnah.com/bukhari:6320');
  });
});
```

## App Routing Example

```ts
// src/App.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from './pages/Index';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

function renderAtRoute(path: string, element: React.ReactNode) {
  const router = createMemoryRouter(
    [{ path, element }],
    { initialEntries: [path] }
  );
  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

describe('App routing', () => {
  it('Index renders at /', () => {
    renderAtRoute('/', <Index />);
    expect(screen.getByText(/Sunnah|checklist|Tasbih/i)).toBeInTheDocument();
  });

  it('Privacy renders at /privacy', () => {
    renderAtRoute('/privacy', <Privacy />);
    expect(screen.getByText(/Privacy/i)).toBeInTheDocument();
  });

  it('NotFound renders for unknown path', () => {
    renderAtRoute('/unknown-xyz', <NotFound />);
    expect(screen.getByText(/404|Not Found|page not found/i)).toBeInTheDocument();
  });
});
```

## Mocking fetch for usePrayerTimes

```ts
beforeEach(() => {
  global.fetch = vi.fn();
});

it('getPrayerTimes fetches from Aladhan API', async () => {
  (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
    ok: true,
    json: () =>
      Promise.resolve({
        data: {
          timings: { Fajr: '05:00', Dhuhr: '12:00', /* ... */ },
        },
      }),
  });

  const { result } = renderHook(() => usePrayerTimes());

  await act(async () => {
    await result.current.fetchPrayerTimes(51.5, -0.12, 'Europe/London');
  });

  expect(result.current.prayerTimes).toBeDefined();
});
```
