import puppeteer from "puppeteer";
import { readFileSync, readdirSync, existsSync, mkdirSync } from "fs";
import { join, resolve } from "path";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";

const ROOT = resolve(__dirname, "..");
const GUIDES_SRC = join(ROOT, "guides-src");
const GUIDES_OUT = join(ROOT, "guides-private");
const SCRIPTS_DIR = join(ROOT, "scripts");

// Parse args
const args = process.argv.slice(2);
const guideFlag = args.indexOf("--guide");
const guideName = guideFlag !== -1 ? args[guideFlag + 1] : null;
const preview = args.includes("--preview");

if (!guideName) {
  console.error("Usage: tsx scripts/build-pdf.ts --guide <name> [--preview]");
  process.exit(1);
}

const guideDir = join(GUIDES_SRC, guideName);
if (!existsSync(guideDir)) {
  console.error(`Guide not found: ${guideDir}`);
  process.exit(1);
}

// Initialize Markdown renderer with syntax highlighting
const md = new MarkdownIt({
  html: true,
  highlight: (str: string, lang: string) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre><code class="hljs language-${lang}">${hljs.highlight(str, { language: lang }).value}</code></pre>`;
      } catch {
        // fallback
      }
    }
    return `<pre><code class="hljs">${md.utils.escapeHtml(str)}</code></pre>`;
  },
});

interface TocEntry {
  level: number;
  text: string;
  id: string;
}

function buildGuide() {
  const chaptersDir = join(guideDir, "chapters");
  const screenshotsDir = join(guideDir, "screenshots");

  // Read chapter files in order
  const files = readdirSync(chaptersDir)
    .filter((f) => f.endsWith(".md"))
    .sort();

  if (files.length === 0) {
    console.error(`No chapter files found in ${chaptersDir}`);
    process.exit(1);
  }

  // Collect ToC entries and render chapters
  const tocEntries: TocEntry[] = [];
  const chapters: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const content = readFileSync(join(chaptersDir, files[i]), "utf-8");

    // Extract headings for ToC
    const headingRegex = /^(#{1,2})\s+(.+)$/gm;
    let match;
    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2];
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      tocEntries.push({ level, text, id });
    }

    // Render markdown to HTML
    let html = md.render(content);

    // Fix image paths to be absolute file:// URLs
    html = html.replace(
      /src="\.\/screenshots\//g,
      `src="file://${screenshotsDir}/`
    );

    // Add chapter break (except first chapter)
    if (i > 0) {
      html = `<div class="chapter-break"></div>\n${html}`;
    }

    // Add IDs to headings for ToC linking
    html = html.replace(
      /<(h[12])>(.*?)<\/\1>/g,
      (_match, tag, text) => {
        const id = text
          .replace(/<[^>]*>/g, "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
        return `<${tag} id="${id}">${text}</${tag}>`;
      }
    );

    chapters.push(html);
  }

  // Build ToC HTML
  const tocHtml = tocEntries
    .map(
      (entry) =>
        `<li class="toc-h${entry.level}">${entry.text}</li>`
    )
    .join("\n");

  // Read guide metadata (use guideName for display)
  const displayName =
    guideName.charAt(0).toUpperCase() + guideName.slice(1);

  // Guide-specific taglines
  const taglines: Record<string, string> = {
    essentials: "Everything you need to build with AI, nothing you don't",
    frontier:
      "Advanced patterns that change how you build. No going back.",
  };
  const tagline = taglines[guideName] || "";

  // Read CSS
  const sharedCss = readFileSync(
    join(SCRIPTS_DIR, "shared-style.css"),
    "utf-8"
  );
  const guideStylePath = join(guideDir, "style.css");
  const guideCss = existsSync(guideStylePath)
    ? readFileSync(guideStylePath, "utf-8")
    : "";

  // Fix font paths in CSS to absolute file:// URLs
  const fontsDir = join(SCRIPTS_DIR, "fonts");
  const css = sharedCss
    .replace(/url\('\.\/fonts\//g, `url('file://${fontsDir}/`)
    .concat("\n", guideCss);

  // Highlight.js dark theme for code blocks
  const hljsCss = `
    .hljs { color: #f5f5f7; }
    .hljs-keyword, .hljs-selector-tag { color: #ff7b72; }
    .hljs-string, .hljs-attr { color: #a5d6ff; }
    .hljs-comment { color: #8b949e; }
    .hljs-function, .hljs-title { color: #d2a8ff; }
    .hljs-number, .hljs-literal { color: #79c0ff; }
    .hljs-built_in { color: #ffa657; }
    .hljs-type, .hljs-class { color: #7ee787; }
    .hljs-variable { color: #ffa657; }
    .hljs-params { color: #f5f5f7; }
  `;

  // Assemble full HTML
  const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>${css}\n${hljsCss}</style>
</head>
<body>
  <!-- Cover -->
  <div class="cover">
    <h1>${displayName}</h1>
    <p class="tagline">${tagline}</p>
    <p class="brand">Ahead <span>AI</span></p>
  </div>

  <!-- Table of Contents -->
  <div class="toc">
    <h2>Contents</h2>
    <ul>
      ${tocHtml}
    </ul>
  </div>

  <!-- Chapters -->
  ${chapters.join("\n\n")}
</body>
</html>`;

  return { fullHtml, displayName };
}

async function generatePdf(html: string, displayName: string) {
  if (!existsSync(GUIDES_OUT)) {
    mkdirSync(GUIDES_OUT, { recursive: true });
  }

  const outputPath = join(GUIDES_OUT, `${guideName}.pdf`);

  console.log(`Building PDF: ${guideName}...`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  await page.pdf({
    path: outputPath,
    format: "A4",
    printBackground: true,
    margin: {
      top: "25mm",
      bottom: "25mm",
      left: "30mm",
      right: "30mm",
    },
    displayHeaderFooter: true,
    headerTemplate: "<span></span>",
    footerTemplate: `
      <div style="width: 100%; font-size: 9px; color: #86868b; padding: 0 30mm; display: flex; justify-content: space-between; font-family: Inter, sans-serif;">
        <span>Ahead AI - ${displayName}</span>
        <span class="pageNumber"></span>
      </div>
    `,
  });

  await browser.close();

  console.log(`PDF saved: ${outputPath}`);

  if (preview) {
    const { exec } = await import("child_process");
    exec(`open "${outputPath}"`);
    console.log("Opening preview...");
  }
}

// Main
const { fullHtml, displayName } = buildGuide();
generatePdf(fullHtml, displayName);
