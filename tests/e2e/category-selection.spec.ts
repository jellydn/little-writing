import { expect, test } from "@playwright/test";

test.describe("Category Selection", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/");
	});

	test("should display category selection screen", async ({ page }) => {
		await expect(page.locator("h1")).toContainText("Select a Category");
		await expect(page.getByRole("button", { name: "Numbers" })).toBeVisible();
		await expect(page.getByRole("button", { name: "Letters" })).toBeVisible();
	});

	test("should navigate to character selection when Numbers is clicked", async ({
		page,
	}) => {
		await page.getByRole("button", { name: "Numbers" }).click();
		await expect(page.locator("h1")).toContainText("Select Number");
	});

	test("should navigate to character selection when Letters is clicked", async ({
		page,
	}) => {
		await page.getByRole("button", { name: "Letters" }).click();
		await expect(page.locator("h1")).toContainText("Select Letter");
	});
});
