import { test, expect } from "@playwright/test";

test("VersionHistoryPanel renders", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText(/Version History/i)).toBeVisible();
  const panel = page.locator("text=Version History").locator("..")
    .first();
  await expect(panel).toBeVisible();
  await expect(panel).toHaveScreenshot("version-history-initial.png");
});

