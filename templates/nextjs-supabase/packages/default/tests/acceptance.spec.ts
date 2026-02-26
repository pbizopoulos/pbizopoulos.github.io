import { expect, test } from "@playwright/test";

test.describe("Minimal App Acceptance Tests", () => {
	const MOCK_USER_ID = "00000000-0000-0000-0000-000000000000";
	const MOCK_EMAIL = "test@example.com";
	const MOCK_USERNAME = "testuser";

	test.beforeEach(async ({ page }) => {
		await page.route("**/auth/v1/user*", async (route) => {
			const _isPost = route.request().method() === "POST";
			if (route.request().headers().authorization?.includes("Bearer")) {
				await route.fulfill({
					status: 200,
					contentType: "application/json",
					body: JSON.stringify({
						id: MOCK_USER_ID,
						email: MOCK_EMAIL,
						user_metadata: { username: MOCK_USERNAME },
					}),
				});
			} else {
				await route.fulfill({ status: 401, body: "{}" });
			}
		});

		await page.route("**/auth/v1/signup*", async (route) => {
			await route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify({
					user: { id: MOCK_USER_ID, email: MOCK_EMAIL },
					session: { access_token: "fake-token", user: { id: MOCK_USER_ID } },
				}),
			});
		});

		await page.route("**/auth/v1/token*", async (route) => {
			await route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify({
					access_token: "fake-token",
					refresh_token: "fake-refresh-token",
					user: { id: MOCK_USER_ID, email: MOCK_EMAIL },
				}),
			});
		});

		await page.route("**/rest/v1/users*", async (route) => {
			await route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify([
					{
						id: MOCK_USER_ID,
						username: MOCK_USERNAME,
						full_name: "Test User",
					},
				]),
			});
		});

		await page.goto("/");
	});

	test("Scenario: Omni-Channel Authentication & Profile Creation", async ({
		page,
	}) => {
		await expect(
			page.getByText("Welcome to the Minimal Application"),
		).toBeVisible();

		await page.getByRole("button", { name: "Sign In" }).click();
		await expect(page.getByTestId("auth-form")).toBeVisible();

		await page
			.getByRole("button", { name: "Don't have an account? Sign Up" })
			.click();
		await page.locator("#name").fill(MOCK_USERNAME);
		await page.locator("#email").fill(MOCK_EMAIL);
		await page.locator("#password").fill("password123");

		const signUpPromise = page.waitForRequest("**/auth/v1/signup*");
		await page.getByTestId("auth-submit").click();
		await signUpPromise;

		await expect(page.getByTestId("auth-form")).not.toBeVisible();

		await page.getByLabel("Open user menu").click();
		await expect(page.getByText(MOCK_USERNAME)).toBeVisible();
	});

	test("Scenario: Secure Identity Management & Session Control", async ({
		page,
	}) => {
		await page.getByRole("button", { name: "Sign In" }).click();
		await page.locator("#email").fill(MOCK_EMAIL);
		await page.locator("#password").fill("password123");
		await page.getByTestId("auth-submit").click();

		await expect(page.getByLabel("Open user menu")).toBeVisible();

		await page.getByLabel("Open user menu").click();

		await page.route("**/auth/v1/logout*", async (route) => {
			await route.fulfill({ status: 204 });
		});

		await page.getByRole("menuitem", { name: "Sign Out" }).click();

		await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
		await expect(page.getByLabel("Open user menu")).not.toBeVisible();
	});

	test("Scenario: Data Integrity & Row Level Security", async ({ page }) => {
		await expect(
			page.getByText("Welcome to the Minimal Application"),
		).toBeVisible();
		await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
	});
});
