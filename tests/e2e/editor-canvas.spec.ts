import { test, expect } from "@playwright/test";

test("EditorCanvas renders and shows controls", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: /Center/i })).toBeVisible();
  const canvas = page.getByRole("application", { name: /Flow editor canvas/i });
  await expect(canvas).toBeVisible();
  await expect(canvas).toHaveScreenshot("editor-canvas-initial.png");
});

