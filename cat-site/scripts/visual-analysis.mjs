#!/usr/bin/env node

/**
 * Visual Analysis Script
 *
 * Screenshots every route at desktop + mobile viewports, sends each
 * to Claude Sonnet Vision for layout/image quality analysis, and
 * outputs a markdown report.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-... node scripts/visual-analysis.mjs
 *
 * Output:
 *   visual-report.md  — markdown report suitable for posting as a PR comment
 */

import { chromium } from '@playwright/test';
import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCREENSHOT_DIR = join(__dirname, '..', 'e2e', 'screenshots');
const REPORT_PATH = join(__dirname, '..', 'visual-report.md');
const BASE_URL = process.env.BASE_URL || 'http://localhost:4173';

const ROUTES = [
  { path: '/', name: 'Home' },
  { path: '/about', name: 'About' },
  { path: '/our-cats', name: 'Our Cats' },
  { path: '/our-cats/cat_001', name: 'Cat Profile' },
  { path: '/kittens', name: 'Kittens' },
  { path: '/gallery', name: 'Gallery' },
  { path: '/contact', name: 'Contact' },
];

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 720 },
  { name: 'mobile', width: 375, height: 667 },
];

const VISION_PROMPT = `You are a professional UI/UX reviewer. Analyze this screenshot of a cat cattery website and report any issues you see. Focus on:

1. **Image sizing** — Are images in the same section roughly the same size? Is one abnormally large or small?
2. **Aspect ratio** — Do any images look stretched or squished?
3. **Layout** — Are there overlapping elements, unexpected gaps, or broken layouts?
4. **Text readability** — Is all text clearly readable against its background?
5. **Overall quality** — Does this look professional and polished?

If everything looks good, say "No issues found."
If you find problems, list them as bullet points. Be concise (1-2 sentences per issue).
Do NOT suggest design improvements — only flag actual problems.`;

async function takeScreenshots() {
  mkdirSync(SCREENSHOT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const screenshots = [];

  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
    });
    const page = await context.newPage();

    for (const route of ROUTES) {
      const url = `${BASE_URL}${route.path}`;
      console.log(`📸 ${viewport.name} — ${route.name} (${url})`);

      await page.goto(url, { waitUntil: 'networkidle' });
      // Extra wait for async data loading
      await page.waitForTimeout(1000);

      const filename = `${route.name.toLowerCase().replace(/\s+/g, '-')}-${viewport.name}.png`;
      const filepath = join(SCREENSHOT_DIR, filename);

      await page.screenshot({ path: filepath, fullPage: true });
      screenshots.push({
        route: route.name,
        viewport: viewport.name,
        path: filepath,
        filename,
      });
    }

    await context.close();
  }

  await browser.close();
  return screenshots;
}

async function analyzeWithVision(screenshots) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.warn('⚠️  ANTHROPIC_API_KEY not set — skipping AI analysis');
    return screenshots.map(s => ({
      ...s,
      analysis: '_Skipped: ANTHROPIC_API_KEY not set_',
    }));
  }

  const client = new Anthropic();
  const results = [];

  for (const screenshot of screenshots) {
    console.log(`🔍 Analyzing ${screenshot.viewport} — ${screenshot.route}...`);

    const imageData = readFileSync(screenshot.path);
    const base64 = imageData.toString('base64');

    try {
      const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/png',
                  data: base64,
                },
              },
              {
                type: 'text',
                text: `${VISION_PROMPT}\n\nPage: ${screenshot.route} | Viewport: ${screenshot.viewport} (${screenshot.viewport === 'desktop' ? '1280×720' : '375×667'})`,
              },
            ],
          },
        ],
      });

      const analysis = response.content
        .filter(c => c.type === 'text')
        .map(c => c.text)
        .join('\n');

      results.push({ ...screenshot, analysis });
    } catch (err) {
      console.error(`❌ Failed to analyze ${screenshot.filename}: ${err.message}`);
      results.push({
        ...screenshot,
        analysis: `_Error: ${err.message}_`,
      });
    }
  }

  return results;
}

function generateReport(results) {
  const lines = [
    '## 🔍 Visual Analysis Report',
    '',
    `> Auto-generated by AI visual analysis — ${new Date().toISOString().split('T')[0]}`,
    '> This is an **advisory** check. Issues listed below are suggestions, not blocking.',
    '',
  ];

  let issueCount = 0;

  for (const viewport of VIEWPORTS) {
    lines.push(`### ${viewport.name === 'desktop' ? '🖥️ Desktop' : '📱 Mobile'} (${viewport.width}×${viewport.height})`);
    lines.push('');

    const viewportResults = results.filter(r => r.viewport === viewport.name);

    for (const result of viewportResults) {
      const hasIssues = !result.analysis.toLowerCase().includes('no issues found');
      if (hasIssues) issueCount++;

      const icon = hasIssues ? '⚠️' : '✅';
      lines.push(`#### ${icon} ${result.route}`);
      lines.push('');
      lines.push(result.analysis);
      lines.push('');
    }
  }

  lines.push('---');
  lines.push('');
  if (issueCount === 0) {
    lines.push('✅ **All pages look good!** No visual issues detected.');
  } else {
    lines.push(`⚠️ **${issueCount} page(s) with potential issues.** Please review above.`);
  }
  lines.push('');

  return lines.join('\n');
}

async function main() {
  console.log('🚀 Starting visual analysis...\n');

  const screenshots = await takeScreenshots();
  console.log(`\n📸 Took ${screenshots.length} screenshots\n`);

  const results = await analyzeWithVision(screenshots);
  console.log(`\n🔍 Analyzed ${results.length} screenshots\n`);

  const report = generateReport(results);
  writeFileSync(REPORT_PATH, report);
  console.log(`📝 Report written to ${REPORT_PATH}`);

  // Also print to stdout for CI
  console.log('\n' + report);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
