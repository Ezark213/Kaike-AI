import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

const ROOT = join(__dirname, '..', '..');

describe('sitemap.xml accessibility', () => {
  describe('vercel.json rewrites', () => {
    it('should have a rewrite rule from /sitemap.xml to /sitemap-index.xml', () => {
      const vercelConfig = JSON.parse(
        readFileSync(join(ROOT, 'vercel.json'), 'utf-8')
      );
      expect(vercelConfig.rewrites).toBeDefined();
      expect(Array.isArray(vercelConfig.rewrites)).toBe(true);

      const sitemapRewrite = vercelConfig.rewrites.find(
        (r: { source: string; destination: string }) =>
          r.source === '/sitemap.xml'
      );
      expect(sitemapRewrite).toBeDefined();
      expect(sitemapRewrite.destination).toBe('/sitemap-index.xml');
    });
  });

  describe('robots.txt', () => {
    it('should reference sitemap.xml as the Sitemap URL', () => {
      const robotsTxt = readFileSync(
        join(ROOT, 'public', 'robots.txt'),
        'utf-8'
      );
      expect(robotsTxt).toContain('Sitemap: https://kaikei-ai.jp/sitemap.xml');
    });
  });

  describe('astro.config.mjs sitemap integration', () => {
    it('should have @astrojs/sitemap integration configured', () => {
      const astroConfig = readFileSync(
        join(ROOT, 'astro.config.mjs'),
        'utf-8'
      );
      expect(astroConfig).toContain("import sitemap from '@astrojs/sitemap'");
      expect(astroConfig).toContain('sitemap(');
      expect(astroConfig).toContain("site: 'https://kaikei-ai.jp'");
    });
  });
});
