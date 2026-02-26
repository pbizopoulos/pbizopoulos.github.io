import { expect, test } from "@playwright/test";
import { signUpAndLogin } from "./Helpers";

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

	test("Profile page should look consistent", async ({ page }) => {
		const { username } = await signUpAndLogin(page);
		await page.goto(`/${username}`);
		await expect(page.getByText(username)).toBeVisible();
		await expect(page).toHaveScreenshot("profile-page.png", {
			fullPage: true,
		});
	});

	test("404 page should look consistent", async ({ page }) => {
		await page.goto("/non-existent-page");
		await expect(page.getByText("Page Not Found")).toBeVisible();
		await expect(page).toHaveScreenshot("404-page.png", {
			fullPage: true,
		});
	});

	test("Error page should look consistent", async ({ page }) => {
		await page.goto("/non-existent-user");
		await expect(page).toHaveScreenshot("error-page.png", {
			fullPage: true,
		});
	});
});
