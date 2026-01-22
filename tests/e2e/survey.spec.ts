import { test, expect } from "@playwright/test";

test("fills first survey step and navigates", async ({ page }) => {
  await page.goto("/survey");
  await expect(page.getByRole("heading", { name: /Identity & Scope/i })).toBeVisible();
  await page.getByLabel(/Role/i).selectOption("Architect");
  await page.getByLabel(/Anonymity/i).selectOption("Anonymous");
  await page.getByLabel(/Consent/i).selectOption("Yes");
  await page.getByRole("button", { name: /Next/i }).click();
  await expect(page.getByRole("heading", { name: /Current Workflow Pain Points/i })).toBeVisible();
});

