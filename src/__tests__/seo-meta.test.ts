import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

const ROOT = join(__dirname, '..', '..');
const SRC = join(__dirname, '..');

function readFile(relativePath: string): string {
  return readFileSync(join(ROOT, relativePath), 'utf-8');
}

function readSrc(relativePath: string): string {
  return readFileSync(join(SRC, relativePath), 'utf-8');
}

describe('BaseLayout.astro SEO meta', () => {
  const layout = readSrc('layouts/BaseLayout.astro');

  it('should have canonical URL', () => {
    expect(layout).toContain('rel="canonical"');
    expect(layout).toContain('canonicalURL');
  });

  it('should have OGP tags', () => {
    expect(layout).toContain('og:title');
    expect(layout).toContain('og:description');
    expect(layout).toContain('og:type');
    expect(layout).toContain('og:url');
    expect(layout).toContain('og:image');
    expect(layout).toContain('og:site_name');
    expect(layout).toContain('og:locale');
  });

  it('should have Twitter Card tags', () => {
    expect(layout).toContain('twitter:card');
    expect(layout).toContain('summary_large_image');
    expect(layout).toContain('twitter:title');
    expect(layout).toContain('twitter:description');
    expect(layout).toContain('twitter:image');
  });

  it('should have GA4 tracking with correct ID', () => {
    expect(layout).toContain('G-HGCVQ13PYZ');
    expect(layout).toContain('googletagmanager.com/gtag/js');
    expect(layout).toContain("gtag('config'");
  });

  it('should have AdSense with correct publisher ID', () => {
    expect(layout).toContain('ca-pub-3306648647011539');
    expect(layout).toContain('pagead2.googlesyndication.com');
  });

  it('should have skip-link for accessibility', () => {
    expect(layout).toContain('skip-link');
    expect(layout).toContain('#main-content');
  });

  it('should support JSON-LD structured data', () => {
    expect(layout).toContain('application/ld+json');
    expect(layout).toContain('structuredData');
  });

  it('should support noindex prop', () => {
    expect(layout).toContain('noindex');
    expect(layout).toContain('noindex, follow');
  });

  it('should have affiliate click tracking script', () => {
    expect(layout).toContain('affiliate_click');
    expect(layout).toContain('rel*="sponsored"');
  });
});

describe('deep-dive/[...slug].astro SEO', () => {
  const template = readSrc('pages/deep-dive/[...slug].astro');

  it('should have BlogPosting or Article schema', () => {
    // Uses 'Article' type in schema
    expect(template).toContain("'@type': 'Article'");
  });

  it('should have BreadcrumbList schema', () => {
    expect(template).toContain("'@type': 'BreadcrumbList'");
    expect(template).toContain('ListItem');
  });

  it('should have A8.net affiliate links in article markdown (not template)', () => {
    // A8 CTAs are in each .md file body, not duplicated in template
    // Verify template does NOT have inline affiliate aside (deduplication fix)
    expect(template).not.toContain('inline-affiliate');
  });

  it('should have affiliate click tracking script', () => {
    expect(template).toContain('affiliate_click');
    expect(template).toContain('rel*="sponsored"');
  });
});

describe('daily/[...slug].astro SEO', () => {
  const template = readSrc('pages/daily/[...slug].astro');

  it('should have NewsArticle schema', () => {
    expect(template).toContain("'@type': 'NewsArticle'");
  });

  it('should use noindex prop', () => {
    expect(template).toContain('noindex={shouldNoindex}');
  });

  it('should have BreadcrumbList schema', () => {
    expect(template).toContain("'@type': 'BreadcrumbList'");
  });

  it('should have affiliate click tracking script', () => {
    expect(template).toContain('affiliate_click');
    expect(template).toContain('rel*="sponsored"');
  });
});

describe('weekly/[...slug].astro SEO', () => {
  const template = readSrc('pages/weekly/[...slug].astro');

  it('should have affiliate click tracking script', () => {
    expect(template).toContain('affiliate_click');
    expect(template).toContain('rel*="sponsored"');
  });
});

describe('tips/[...slug].astro SEO', () => {
  const template = readSrc('pages/tips/[...slug].astro');

  it('should have affiliate click tracking script', () => {
    expect(template).toContain('affiliate_click');
    expect(template).toContain('rel*="sponsored"');
  });
});

describe('robots.txt', () => {
  const robots = readFile('public/robots.txt');

  it('should contain sitemap reference', () => {
    expect(robots).toContain('Sitemap:');
    expect(robots).toContain('sitemap.xml');
  });
});

describe('index.astro JSON-LD structured data', () => {
  const indexPage = readSrc('pages/index.astro');

  it('should have WebSite schema on top page', () => {
    expect(indexPage).toContain("'@type': 'WebSite'");
  });

  it('should have WebSite schema with SearchAction (sitelinks search box)', () => {
    expect(indexPage).toContain('SearchAction');
    expect(indexPage).toContain('potentialAction');
  });

  it('should pass structuredData to BaseLayout', () => {
    expect(indexPage).toContain('structuredData={');
  });
});
