import { Page } from "playwright";
import { join } from "path";

export default async function capture(page: Page, outputDir: string) {
  // Example: capture a Claude or Cursor prompt interaction
  // This script will be customized once real content is finalized

  await page.goto("https://claude.ai");
  await page.waitForLoadState("networkidle");

  await page.screenshot({
    path: join(outputDir, "cursor-prompt-example.png"),
    fullPage: false,
  });
}
