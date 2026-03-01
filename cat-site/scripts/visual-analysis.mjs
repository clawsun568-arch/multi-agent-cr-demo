#!/usr/bin/env node

/**
 * Visual Analysis Script — Dual AI Review (Claude + GPT)
 *
 * This script does AI-powered visual testing of the cat cattery website
 * using BOTH Claude Sonnet Vision AND GPT-4o Vision for two independent
 * perspectives on layout/image quality.
 *
 * How it works:
 *
 * 1. SCREENSHOTS: Opens Chromium via Playwright, visits every page at two
 *    viewport sizes (desktop 1280×720, mobile 375×667). Takes a full-page
 *    screenshot of each = 14 screenshots total.
 *
 * 2. AI ANALYSIS: Sends each screenshot to BOTH:
 *    - Claude Sonnet Vision (Anthropic API)
 *    - GPT-4o Vision (OpenAI API)
 *    Each AI independently reviews the screenshot for visual issues.
 *
 * 3. REPORT: Combines all AI responses into a markdown report file
 *    (visual-report.md) with both Claude and GPT analyses side by side
 *    for each page. Posted as a PR comment in CI.
 *
 * This is an ADVISORY check — it never blocks PRs. The AIs might flag
 * false positives, so humans review the report before acting on it.
 *
 * Environment variables:
 *   ANTHROPIC_API_KEY — for Claude Vision (optional, skips if missing)
 *   OPENAI_API_KEY    — for GPT Vision (optional, skips if missing)
 *   BASE_URL          — site URL (default: http://localhost:4173)
 *
 * Usage:
 *   npm run build && npm run preview &
 *   ANTHROPIC_API_KEY=sk-... OPENAI_API_KEY=sk-... node scripts/visual-analysis.mjs
 */

// --- Imports ---

import { chromium } from '@playwright/test';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync } from 'node:fs';

// --- Configuration ---

// __dirname doesn't exist in ES modules (.mjs), so we derive it from import.meta.url
const __dirname = dirname(fileURLToPath(import.meta.url));
const SCREENSHOT_DIR = join(__dirname, '..', 'e2e', 'screenshots');
const REPORT_PATH = join(__dirname, '..', 'visual-report.md');
const BASE_URL = process.env.BASE_URL || 'http://localhost:4173';

// All routes to screenshot (includes one dynamic cat profile page)
const ROUTES = [
  { path: '/', name: 'Home' },
  { path: '/about', name: 'About' },
  { path: '/our-cats', name: 'Our Cats' },
  { path: '/our-cats/cat_001', name: 'Cat Profile' },
  { path: '/kittens', name: 'Kittens' },
  { path: '/gallery', name: 'Gallery' },
  { path: '/contact', name: 'Contact' },
];

// Two viewport sizes: desktop and mobile
const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 720 },
  { name: 'mobile', width: 375, height: 667 },
];

// The prompt sent to both AIs along with each screenshot
const VISION_PROMPT = `You are a professional UI/UX reviewer. Analyze this screenshot of a cat cattery website and report any issues you see. Focus on:

1. **Image sizing** — Are images in the same section roughly the same size? Is one abnormally large or small?
2. **Aspect ratio** — Do any images look stretched or squished?
3. **Layout** — Are there overlapping elements, unexpected gaps, or broken layouts?
4. **Text readability** — Is all text clearly readable against its background?
5. **Overall quality** — Does this look professional and polished?

If everything looks good, say "No issues found."
If you find problems, list them as bullet points. Be concise (1-2 sentences per issue).
Do NOT suggest design improvements — only flag actual problems.`;

// --- Step 1: Take Screenshots ---

/**
 * Opens Chromium, visits every route at every viewport size,
 * and saves full-page screenshots as PNG files.
 */
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

      // waitUntil: 'networkidle' waits for all network requests to finish
      await page.goto(url, { waitUntil: 'networkidle' });
      // Extra wait for React state updates and CSS transitions
      await page.waitForTimeout(1000);

      const filename = `${route.name.toLowerCase().replace(/\s+/g, '-')}-${viewport.name}.png`;
      const filepath = join(SCREENSHOT_DIR, filename);

      // fullPage: true captures the entire scrollable page, not just the viewport
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

// --- Step 2a: Claude Vision Analysis ---

/**
 * Sends each screenshot to Claude Sonnet Vision API.
 * Returns analysis text for each screenshot, or "Skipped" if no API key.
 */
async function analyzeWithClaude(screenshots) {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('⚠️  ANTHROPIC_API_KEY not set — skipping Claude analysis');
    return screenshots.map(() => '_Skipped: ANTHROPIC_API_KEY not set_');
  }

  const client = new Anthropic();
  const results = [];

  for (const screenshot of screenshots) {
    console.log(`🔍 Claude: ${screenshot.viewport} — ${screenshot.route}...`);

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
                source: { type: 'base64', media_type: 'image/png', data: base64 },
              },
              {
                type: 'text',
                text: `${VISION_PROMPT}\n\nPage: ${screenshot.route} | Viewport: ${screenshot.viewport}`,
              },
            ],
          },
        ],
      });

      results.push(
        response.content.filter(c => c.type === 'text').map(c => c.text).join('\n')
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`❌ Claude failed on ${screenshot.filename}: ${message}`);
      results.push(`_Error: ${message}_`);
    }
  }

  return results;
}

// --- Step 2b: GPT Vision Analysis ---

/**
 * Sends each screenshot to GPT-4o Vision API.
 * Returns analysis text for each screenshot, or "Skipped" if no API key.
 */
async function analyzeWithGPT(screenshots) {
  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️  OPENAI_API_KEY not set — skipping GPT analysis');
    return screenshots.map(() => '_Skipped: OPENAI_API_KEY not set_');
  }

  const client = new OpenAI();
  const results = [];

  for (const screenshot of screenshots) {
    console.log(`🔍 GPT: ${screenshot.viewport} — ${screenshot.route}...`);

    const imageData = readFileSync(screenshot.path);
    const base64 = imageData.toString('base64');

    try {
      // GPT-4o supports vision via the chat completions API
      const response = await client.chat.completions.create({
        model: 'gpt-4o',
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: { url: `data:image/png;base64,${base64}` },
              },
              {
                type: 'text',
                text: `${VISION_PROMPT}\n\nPage: ${screenshot.route} | Viewport: ${screenshot.viewport}`,
              },
            ],
          },
        ],
      });

      results.push(response.choices[0]?.message?.content || '_No response_');
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`❌ GPT failed on ${screenshot.filename}: ${message}`);
      results.push(`_Error: ${message}_`);
    }
  }

  return results;
}

// --- Step 3: Generate Markdown Report ---

/**
 * Combines Claude and GPT analyses into a markdown report.
 * Each page shows both AIs' feedback side by side.
 */
function generateReport(screenshots, claudeResults, gptResults) {
  const lines = [
    '## 🔍 Visual Analysis Report',
    '',
    '> Auto-generated by dual AI visual analysis (Claude + GPT)',
    `> Date: ${new Date().toISOString().split('T')[0]}`,
    '> This is an **advisory** check. Issues listed below are suggestions, not blocking.',
    '',
  ];

  let issueCount = 0;

  for (const viewport of VIEWPORTS) {
    lines.push(`### ${viewport.name === 'desktop' ? '🖥️ Desktop' : '📱 Mobile'} (${viewport.width}×${viewport.height})`);
    lines.push('');

    // Get screenshots for this viewport
    const viewportIndices = screenshots
      .map((s, i) => (s.viewport === viewport.name ? i : -1))
      .filter(i => i !== -1);

    for (const i of viewportIndices) {
      const screenshot = screenshots[i];
      const claudeAnalysis = claudeResults[i];
      const gptAnalysis = gptResults[i];

      // Check if either AI found issues
      const claudeHasIssues = !claudeAnalysis.toLowerCase().includes('no issues found');
      const gptHasIssues = !gptAnalysis.toLowerCase().includes('no issues found');
      const hasIssues = claudeHasIssues || gptHasIssues;
      if (hasIssues) issueCount++;

      const icon = hasIssues ? '⚠️' : '✅';
      lines.push(`#### ${icon} ${screenshot.route}`);
      lines.push('');

      // Claude's analysis
      lines.push('<details>');
      lines.push(`<summary><strong>🟣 Claude Sonnet</strong> ${claudeHasIssues ? '— issues found' : '— no issues'}</summary>`);
      lines.push('');
      lines.push(claudeAnalysis);
      lines.push('');
      lines.push('</details>');
      lines.push('');

      // GPT's analysis
      lines.push('<details>');
      lines.push(`<summary><strong>🟢 GPT-4o</strong> ${gptHasIssues ? '— issues found' : '— no issues'}</summary>`);
      lines.push('');
      lines.push(gptAnalysis);
      lines.push('');
      lines.push('</details>');
      lines.push('');
    }
  }

  // Summary
  lines.push('---');
  lines.push('');
  if (issueCount === 0) {
    lines.push('✅ **All pages look good!** No visual issues detected by either AI.');
  } else {
    lines.push(`⚠️ **${issueCount} page(s) with potential issues.** Please review above.`);
  }
  lines.push('');

  return lines.join('\n');
}

// --- Main Entry Point ---

async function main() {
  console.log('🚀 Starting dual AI visual analysis...\n');

  // Step 1: Take screenshots
  const screenshots = await takeScreenshots();
  console.log(`\n📸 Took ${screenshots.length} screenshots\n`);

  // Step 2: Run both AIs in parallel for speed
  console.log('🔍 Sending to Claude and GPT in parallel...\n');
  const [claudeResults, gptResults] = await Promise.all([
    analyzeWithClaude(screenshots),
    analyzeWithGPT(screenshots),
  ]);

  console.log(`\n✅ Claude analyzed ${claudeResults.length} screenshots`);
  console.log(`✅ GPT analyzed ${gptResults.length} screenshots\n`);

  // Step 3: Generate and save the markdown report
  const report = generateReport(screenshots, claudeResults, gptResults);
  writeFileSync(REPORT_PATH, report);
  console.log(`📝 Report written to ${REPORT_PATH}`);
  console.log('\n' + report);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
