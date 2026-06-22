import { chromium, Browser, BrowserContext } from "playwright";
import { readdirSync, existsSync, mkdirSync } from "fs";
import { join, resolve, basename } from "path";
import * as readline from "readline";

const ROOT = resolve(__dirname, "..");
const GUIDES_SRC = join(ROOT, "guides-src");

// Parse args
const args = process.argv.slice(2);
const guideFlag = args.indexOf("--guide");
const guideName = guideFlag !== -1 ? args[guideFlag + 1] : null;
const chapterFlag = args.indexOf("--chapter");
const chapterFilter = chapterFlag !== -1 ? args[chapterFlag + 1] : null;

if (!guideName) {
  console.error(
    "Usage: tsx scripts/capture-screenshots.ts --guide <name> [--chapter <chapter-prefix>]"
  );
  process.exit(1);
}

const guideDir = join(GUIDES_SRC, guideName);
const scriptsDir = join(guideDir, "screenshot-scripts");
const screenshotsDir = join(guideDir, "screenshots");

if (!existsSync(scriptsDir)) {
  console.error(`No screenshot-scripts directory found: ${scriptsDir}`);
  process.exit(1);
}

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  // Find screenshot scripts
  let scripts = readdirSync(scriptsDir)
    .filter((f) => f.endsWith(".ts"))
    .sort();

  if (chapterFilter) {
    scripts = scripts.filter((f) => f.startsWith(chapterFilter));
  }

  if (scripts.length === 0) {
    console.log("No screenshot scripts found to run.");
    process.exit(0);
  }

  console.log(`Found ${scripts.length} screenshot script(s):`);
  scripts.forEach((s) => console.log(`  - ${s}`));
  console.log("");

  // Launch visible browser for manual login
  console.log("Launching browser for authentication...");
  const browser: Browser = await chromium.launch({
    headless: false,
    args: ["--start-maximized"],
  });

  const context: BrowserContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();
  await page.goto("about:blank");

  console.log("");
  console.log("=".repeat(60));
  console.log("  MANUAL LOGIN REQUIRED");
  console.log("  Log in to any services needed for screenshots.");
  console.log("  Use the browser window that just opened.");
  console.log("=".repeat(60));
  console.log("");

  await prompt("Press Enter when you're done logging in...");

  console.log("\nStarting automated screenshot capture...\n");

  // Run each screenshot script
  for (const script of scripts) {
    const chapterName = basename(script, ".ts");
    const outputDir = join(screenshotsDir, chapterName);

    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    console.log(`Capturing: ${chapterName}...`);

    try {
      // Dynamic import of the screenshot script
      const scriptPath = join(scriptsDir, script);
      const module = await import(scriptPath);
      const captureFn = module.default || module.capture;

      if (typeof captureFn !== "function") {
        console.error(
          `  ERROR: ${script} does not export a default function or 'capture' function`
        );
        continue;
      }

      // Create a fresh page for each script (reuses auth context)
      const scriptPage = await context.newPage();
      await captureFn(scriptPage, outputDir);
      await scriptPage.close();

      console.log(`  Done: screenshots saved to ${chapterName}/`);
    } catch (error) {
      console.error(`  ERROR in ${script}:`, error);
    }
  }

  console.log("\nAll screenshots captured. Closing browser.");
  await browser.close();
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
