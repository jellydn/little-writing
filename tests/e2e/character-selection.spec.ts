import { expect, test } from "@playwright/test";

test.describe("Character Selection", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/");
	});

	test("should navigate to character grid when category is selected", async ({
		page,
	}) => {
		await page.getByRole("button", { name: "Numbers" }).click();
		await expect(page.locator("h1")).toContainText("Select Number");
		await expect(page.getByRole("button", { name: /Back/i })).toBeVisible();
	});

	test("should display character cards", async ({ page }) => {
		await page.getByRole("button", { name: "Numbers" }).click();
		const characterCards = page.getByRole("listitem");
		await expect(characterCards.first()).toBeVisible();
	});

	test("should navigate to tracing screen when character is clicked", async ({
		page,
	}) => {
		await page.getByRole("button", { name: "Numbers" }).click();
		await page.getByRole("listitem").first().click();
		await expect(page.locator("canvas")).toBeVisible();
	});

	test("should navigate back to category selection when back is clicked", async ({
		page,
	}) => {
		await page.getByRole("button", { name: "Numbers" }).click();
		await page.getByRole("button", { name: /Back/i }).click();
		await expect(page.getByRole("button", { name: "Numbers" })).toBeVisible();
		await expect(page.getByRole("button", { name: "Letters" })).toBeVisible();
	});
});
