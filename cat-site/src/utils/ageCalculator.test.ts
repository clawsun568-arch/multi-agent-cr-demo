/**
 * Tests for the age calculator utility.
 *
 * The calculateAge function takes a birth date string (e.g. "2022-03-15")
 * and returns a human-readable age like "3 years old" or "4 months old".
 *
 * We test:
 * - Normal cases: years old, months old, weeks old, days old
 * - Edge cases: future dates, invalid strings, today's date
 *
 * Note: We use `vi.useFakeTimers()` to freeze "now" so tests don't break
 * as real time passes. Without this, a test expecting "2 years old" would
 * fail once the cat's birthday passes and they turn 3.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { calculateAge } from './ageCalculator';

describe('calculateAge', () => {
  afterEach(() => {
    // Restore real timers after each test so they don't leak
    vi.useRealTimers();
  });

  it('returns years for cats older than 1 year', () => {
    // Freeze time to 2026-02-26 so we get predictable results
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-26T12:00:00Z'));

    // Born 2022-03-15 → almost 4 years but birthday hasn't passed yet → 3 years
    expect(calculateAge('2022-03-15')).toBe('3 years old');

    // Born 2024-01-01 → birthday has passed this year → 2 years
    expect(calculateAge('2024-01-01')).toBe('2 years old');
  });

  it('returns "1 year old" (singular) for exactly 1 year', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-26T12:00:00Z'));

    // Born 2025-02-01 → 1 year old (birthday passed this month)
    expect(calculateAge('2025-02-01')).toBe('1 year old');
  });

  it('returns months for cats less than 1 year old', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-26T12:00:00Z'));

    // Born 2025-10-26 → 4 months old
    expect(calculateAge('2025-10-26')).toBe('4 months old');

    // Born 2026-01-20 → 1 month old
    expect(calculateAge('2026-01-20')).toBe('1 month old');
  });

  it('returns weeks for kittens less than 1 month old', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-26T12:00:00Z'));

    // Born 2026-02-12 → 14 days = 2 weeks old
    expect(calculateAge('2026-02-12')).toBe('2 weeks old');
  });

  it('returns days for very young kittens (less than 1 week)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-26T12:00:00Z'));

    // Born 2026-02-23 → 3 days old
    expect(calculateAge('2026-02-23')).toBe('3 days old');
  });

  it('returns "Unknown age" for future birth dates', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-26T12:00:00Z'));

    expect(calculateAge('2027-01-01')).toBe('Unknown age');
  });

  it('returns "Unknown age" for invalid date strings', () => {
    expect(calculateAge('not-a-date')).toBe('Unknown age');
    expect(calculateAge('')).toBe('Unknown age');
  });
});
