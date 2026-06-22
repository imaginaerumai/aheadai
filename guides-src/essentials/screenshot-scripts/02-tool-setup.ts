import { Page } from "playwright";
import { join } from "path";

export default async function capture(page: Page, outputDir: string) {
  // Example: capture Cursor download page
  await page.goto("https://cursor.sh");
  await page.waitForLoadState("networkidle");

  await page.screenshot({
    path: join(outputDir, "cursor-download.png"),
    fullPage: false,
  });

  // TODO: Add cursor settings screenshot when auth is available
  // await page.goto("cursor://settings/ai");
  // await page.screenshot({
  //   path: join(outputDir, "cursor-settings.png"),
  //   fullPage: false,
  // });
}
