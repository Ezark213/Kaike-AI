import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const DEEP_DIVE_DIR = join(__dirname, '..', 'content', 'deep-dive');

function parseFrontmatter(content: string): Record<string, unknown> | null {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const fm: Record<string, unknown> = {};
  const lines = match[1].split('\n');
  let currentKey = '';
  let inArray = false;
  let arrayValues: string[] = [];

  for (const line of lines) {
    // Array item
    if (inArray && line.match(/^\s+-\s+/)) {
      arrayValues.push(line.replace(/^\s+-\s+/, '').replace(/^['"]|['"]$/g, ''));
      continue;
    }

    // End of array if we were in one
    if (inArray) {
      fm[currentKey] = arrayValues;
      inArray = false;
      arrayValues = [];
    }

    // Inline array: key: ['a', 'b', 'c']
    const inlineArrayMatch = line.match(/^(\w+):\s*\[(.*)\]$/);
    if (inlineArrayMatch) {
      const key = inlineArrayMatch[1];
      const values = inlineArrayMatch[2]
        .split(',')
        .map((v) => v.trim().replace(/^['"]|['"]$/g, ''));
      fm[key] = values;
      continue;
    }

    // Key-value pair
    const kvMatch = line.match(/^(\w+):\s*(.*)$/);
    if (kvMatch) {
      const key = kvMatch[1];
      const value = kvMatch[2].trim().replace(/^['"]|['"]$/g, '');
      if (value === '') {
        // Could be start of array
        currentKey = key;
        inArray = true;
        arrayValues = [];
      } else {
        fm[key] = value;
      }
    }
  }

  if (inArray) {
    fm[currentKey] = arrayValues;
  }

  return fm;
}

describe('deep-dive frontmatter validation', () => {
  const files = readdirSync(DEEP_DIVE_DIR)
    .filter((f) => f.endsWith('.md'))
    .sort();

  it('should have deep-dive articles', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  // Test first 30 articles in detail
  const filesToTest = files.slice(0, 30);

  filesToTest.forEach((file) => {
    describe(`article: ${file}`, () => {
      const content = readFileSync(join(DEEP_DIVE_DIR, file), 'utf-8');
      const fm = parseFrontmatter(content);

      it('should have valid frontmatter', () => {
        expect(fm).not.toBeNull();
      });

      it('should have a title', () => {
        expect(fm?.title).toBeDefined();
        expect(typeof fm?.title).toBe('string');
        expect((fm?.title as string).length).toBeGreaterThan(0);
      });

      it('should have a valid date in ISO format', () => {
        expect(fm?.date).toBeDefined();
        const dateStr = fm?.date as string;
        // Should match YYYY-MM-DD
        expect(dateStr).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        // Should parse to a valid date
        const parsed = new Date(dateStr);
        expect(parsed.toString()).not.toBe('Invalid Date');
      });

      it('should have a summary', () => {
        expect(fm?.summary).toBeDefined();
        expect(typeof fm?.summary).toBe('string');
        expect((fm?.summary as string).length).toBeGreaterThan(0);
      });

      it('should have tags as an array', () => {
        expect(fm?.tags).toBeDefined();
        expect(Array.isArray(fm?.tags)).toBe(true);
        expect((fm?.tags as string[]).length).toBeGreaterThan(0);
      });

      it('should have a category', () => {
        expect(fm?.category).toBeDefined();
        expect(typeof fm?.category).toBe('string');
        expect((fm?.category as string).length).toBeGreaterThan(0);
      });
    });
  });
});
