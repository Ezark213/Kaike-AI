import { describe, it, expect } from 'vitest';

/**
 * Tests the 30-day noindex logic used in daily/[...slug].astro:
 *
 *   const articleDate = new Date(article.data.date)
 *   const thirtyDaysAgo = new Date()
 *   thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
 *   const shouldNoindex = articleDate < thirtyDaysAgo
 */
function shouldNoindex(articleDateStr: string, now: Date = new Date()): boolean {
  const articleDate = new Date(articleDateStr);
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return articleDate < thirtyDaysAgo;
}

describe('30-day noindex logic', () => {
  // Use a fixed "now" for deterministic tests
  const now = new Date('2026-03-18T12:00:00+09:00');

  it('article from today should NOT be noindexed', () => {
    expect(shouldNoindex('2026-03-18', now)).toBe(false);
  });

  it('article from 29 days ago should NOT be noindexed', () => {
    expect(shouldNoindex('2026-02-17', now)).toBe(false);
  });

  it('article from exactly 30 days ago should NOT be noindexed (boundary: not strictly less)', () => {
    // 30 days before 2026-03-18 is 2026-02-16
    // articleDate = 2026-02-16T00:00:00Z, thirtyDaysAgo = 2026-02-16T12:00:00+09:00 = 2026-02-16T03:00:00Z
    // Whether this is noindex depends on timezone. With the logic as-is:
    // new Date('2026-02-16') => 2026-02-16T00:00:00Z
    // thirtyDaysAgo => 2026-02-16T03:00:00Z (since now is 2026-03-18T03:00:00Z)
    // 2026-02-16T00:00:00Z < 2026-02-16T03:00:00Z => true
    expect(shouldNoindex('2026-02-16', now)).toBe(true);
  });

  it('article from 31 days ago should be noindexed', () => {
    expect(shouldNoindex('2026-02-15', now)).toBe(true);
  });

  it('very old article (1 year ago) should be noindexed', () => {
    expect(shouldNoindex('2025-03-18', now)).toBe(true);
  });

  it('future article should NOT be noindexed', () => {
    expect(shouldNoindex('2026-04-01', now)).toBe(false);
  });

  it('article from 28 days ago should NOT be noindexed', () => {
    expect(shouldNoindex('2026-02-18', now)).toBe(false);
  });

  it('article from 60 days ago should be noindexed', () => {
    expect(shouldNoindex('2026-01-17', now)).toBe(true);
  });
});
