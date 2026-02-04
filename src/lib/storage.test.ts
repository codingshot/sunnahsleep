import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getStorageJson, setStorageJson } from './storage';

describe('storage', () => {
  const KEY = 'test-key';

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('getStorageJson returns null for missing key', () => {
    expect(getStorageJson(KEY)).toBeNull();
  });

  it('getStorageJson returns parsed data for valid JSON', () => {
    const data = { foo: 'bar' };
    localStorage.setItem(KEY, JSON.stringify(data));
    expect(getStorageJson<typeof data>(KEY)).toEqual(data);
  });

  it('getStorageJson returns null for invalid JSON', () => {
    localStorage.setItem(KEY, 'not valid json {');
    expect(getStorageJson(KEY)).toBeNull();
  });

  it('setStorageJson stores data', () => {
    const data = { count: 42 };
    setStorageJson(KEY, data);
    expect(JSON.parse(localStorage.getItem(KEY)!)).toEqual(data);
  });
});
