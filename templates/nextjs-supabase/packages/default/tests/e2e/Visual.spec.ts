import { expect, test } from "@playwright/test";

test.describe("Visual Regression", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/");
	});

	test("Landing page should look consistent", async ({ page }) => {
		await expect(page).toHaveScreenshot("landing-page.png", {
			fullPage: true,
		});
	});

	test("Auth modal should look consistent", async ({ page }) => {
		await page.getByRole("button", { name: /Sign In/i }).click();
		await expect(page.getByTestId("auth-form")).toBeVisible();
		await expect(page.getByTestId("auth-form")).toHaveScreenshot(
			"auth-modal-signin.png",
		);

		await page
			.getByRole("button", { name: /Don't have an account\? Sign Up/i })
			.click();
		await expect(page.getByTestId("auth-form")).toHaveScreenshot(
			"auth-modal-signup.png",
		);
	});
});
