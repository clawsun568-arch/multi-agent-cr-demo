#!/usr/bin/env node

/**
 * Visual Analysis Script
 *
 * This script does AI-powered visual testing of the cat cattery website.
 * It is NOT a test runner — it's a standalone Node.js script that:
 *
 * 1. SCREENSHOTS: Opens a real browser (Chromium via Playwright) and visits
 *    every page at two viewport sizes (desktop 1280×720, mobile 375×667).
 *    Takes a full-page screenshot of each = 14 screenshots total.
 *
 * 2. AI ANALYSIS: Sends each screenshot to Claude Sonnet's Vision API,
 *    asking it to check for layout issues, broken images, text readability
 *    problems, and general visual quality.
 *
 * 3. REPORT: Combines all AI responses into a markdown report file
 *    (visual-report.md) that gets posted as a PR comment in CI.
 *
 * This is an ADVISORY check — it never blocks PRs. The AI might flag
 * false positives (e.g., "text contrast is low" on placeholder images),
 * so humans review the report before acting on it.
 *
 * Cost: ~$0.30 per run (14 images × ~$0.02 per image with Sonnet).
 *
 * Usage:
 *   # Locally (requires the site to be running on port 4173):
 *   npm run build && npm run preview &
 *   ANTHROPIC_API_KEY=sk-... node scripts/visual-analysis.mjs
 *
 *   # In CI (see .github/workflows/e2e.yml):
 *   Runs automatically on PRs after E2E tests pass.
 *
 * Output:
 *   visual-report.md — markdown report posted as a GitHub PR comment
 */

// --- Imports ---

// Playwright's chromium browser launcher (used programmatically, not via test runner)
import { chromium } from '@playwright/test';

// Anthropic SDK for calling Claude's Vision API
import Anthropic from '@anthropic-ai/sdk';

// Node.js built-in modules for file I/O and path manipulation
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync } from 'node:fs';

// --- Configuration ---

// __dirname doesn't exist in ES modules (.mjs), so we derive it from import.meta.url.
// import.meta.url is like "file:///Users/.../scripts/visual-analysis.mjs"
// fileURLToPath converts it to a normal file path, then dirname gets the directory.
const __dirname = dirname(fileURLToPath(import.meta.url));

// Where to save screenshot PNG files
const SCREENSHOT_DIR = join(__dirname, '..', 'e2e', 'screenshots');

// Where to write the final markdown report
const REPORT_PATH = join(__dirname, '..', 'visual-report.md');

// Base URL of the running site (default: Vite preview server)
const BASE_URL = process.env.BASE_URL || 'http://localhost:4173';

// All routes to screenshot. Includes one dynamic route (cat profile) to
// test the profile page layout in addition to the list pages.
const ROUTES = [
  { path: '/', name: 'Home' },
  { path: '/about', name: 'About' },
  { path: '/our-cats', name: 'Our Cats' },
  { path: '/our-cats/cat_001', name: 'Cat Profile' },
  { path: '/kittens', name: 'Kittens' },
  { path: '/gallery', name: 'Gallery' },
  { path: '/contact', name: 'Contact' },
];

// Viewport sizes to test. Desktop tests the full layout; mobile tests
// the responsive/hamburger menu layout.
const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 720 },
  { name: 'mobile', width: 375, height: 667 },
];

// The prompt sent to Claude Vision along with each screenshot.
// It focuses on objective visual problems (not subjective design preferences).
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
 * Opens a Chromium browser, visits every route at every viewport size,
 * and saves full-page screenshots as PNG files.
 *
 * Returns an array of screenshot metadata objects:
 * [{ route: "Home", viewport: "desktop", path: "/abs/path/home-desktop.png", filename: "home-desktop.png" }]
 */
async function takeScreenshots() {
  // Create the screenshots directory if it doesn't exist
  mkdirSync(SCREENSHOT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const screenshots = [];

  for (const viewport of VIEWPORTS) {
    // Create a new browser context per viewport (isolated cookies, storage, viewport)
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
    });
    const page = await context.newPage();

    for (const route of ROUTES) {
      const url = `${BASE_URL}${route.path}`;
      console.log(`📸 ${viewport.name} — ${route.name} (${url})`);

      // waitUntil: 'networkidle' waits until there are no network requests
      // for 500ms — ensures all data fetches and images have completed.
      await page.goto(url, { waitUntil: 'networkidle' });

      // Extra wait for React state updates and CSS transitions to settle
      await page.waitForTimeout(1000);

      // Generate filename like "home-desktop.png" or "our-cats-mobile.png"
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

// --- Step 2: AI Vision Analysis ---

/**
 * Sends each screenshot to Claude Sonnet Vision API for analysis.
 * Returns the same screenshot array with an added `analysis` field
 * containing the AI's response text.
 *
 * If ANTHROPIC_API_KEY is not set, returns "Skipped" for all screenshots
 * (allows the script to run locally without an API key for testing).
 */
async function analyzeWithVision(screenshots) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.warn('⚠️  ANTHROPIC_API_KEY not set — skipping AI analysis');
    return screenshots.map(s => ({
      ...s,
      analysis: '_Skipped: ANTHROPIC_API_KEY not set_',
    }));
  }

  // The Anthropic SDK reads ANTHROPIC_API_KEY from env automatically
  const client = new Anthropic();
  const results = [];

  for (const screenshot of screenshots) {
    console.log(`🔍 Analyzing ${screenshot.viewport} — ${screenshot.route}...`);

    // Read the PNG file and convert to base64 for the API
    const imageData = readFileSync(screenshot.path);
    const base64 = imageData.toString('base64');

    try {
      // Send the image + prompt to Claude Sonnet Vision.
      // The messages API supports multimodal content (text + images).
      const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: [
              // First content block: the screenshot image
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/png',
                  data: base64,
                },
              },
              // Second content block: the analysis prompt + context
              {
                type: 'text',
                text: `${VISION_PROMPT}\n\nPage: ${screenshot.route} | Viewport: ${screenshot.viewport} (${screenshot.viewport === 'desktop' ? '1280×720' : '375×667'})`,
              },
            ],
          },
        ],
      });

      // Extract the text response from the API response content blocks
      const analysis = response.content
        .filter(c => c.type === 'text')
        .map(c => c.text)
        .join('\n');

      results.push({ ...screenshot, analysis });
    } catch (err) {
      // Don't crash the whole script if one image fails — log and continue
      console.error(`❌ Failed to analyze ${screenshot.filename}: ${err.message}`);
      results.push({
        ...screenshot,
        analysis: `_Error: ${err.message}_`,
      });
    }
  }

  return results;
}

// --- Step 3: Generate Markdown Report ---

/**
 * Converts the analysis results into a markdown report string.
 * The report is formatted for posting as a GitHub PR comment.
 *
 * Structure:
 * - Header with date and advisory notice
 * - Desktop section (7 routes with ✅ or ⚠️ icons)
 * - Mobile section (7 routes with ✅ or ⚠️ icons)
 * - Summary: total issue count
 *
 * Issue detection: If the AI's response contains "No issues found",
 * the page gets a ✅. Otherwise it gets a ⚠️.
 */
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
      // Simple heuristic: if AI said "no issues found" → clean, otherwise → issues
      const hasIssues = !result.analysis.toLowerCase().includes('no issues found');
      if (hasIssues) issueCount++;

      const icon = hasIssues ? '⚠️' : '✅';
      lines.push(`#### ${icon} ${result.route}`);
      lines.push('');
      lines.push(result.analysis);
      lines.push('');
    }
  }

  // Summary footer
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

// --- Main Entry Point ---

/**
 * Orchestrates the three steps: screenshot → analyze → report.
 * Prints progress to console and writes the final report to a file.
 */
async function main() {
  console.log('🚀 Starting visual analysis...\n');

  // Step 1: Take screenshots of all routes at all viewports
  const screenshots = await takeScreenshots();
  console.log(`\n📸 Took ${screenshots.length} screenshots\n`);

  // Step 2: Send each screenshot to Claude Vision for analysis
  const results = await analyzeWithVision(screenshots);
  console.log(`\n🔍 Analyzed ${results.length} screenshots\n`);

  // Step 3: Generate and save the markdown report
  const report = generateReport(results);
  writeFileSync(REPORT_PATH, report);
  console.log(`📝 Report written to ${REPORT_PATH}`);

  // Also print to stdout so CI logs show the report
  console.log('\n' + report);
}

// Run the script. If anything throws, log it and exit with code 1
// so CI knows the step failed.
main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
