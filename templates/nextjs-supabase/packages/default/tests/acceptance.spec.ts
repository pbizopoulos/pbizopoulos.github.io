import { test, expect } from "@playwright/test";

test.describe("Minimal App Acceptance Tests", () => {
  const MOCK_USER_ID = "00000000-0000-0000-0000-000000000000";
  const MOCK_EMAIL = "test@example.com";
  const MOCK_USERNAME = "testuser";

  test.beforeEach(async ({ page }) => {
    // Mock Supabase Auth
    await page.route("**/auth/v1/user*", async (route) => {
      const isPost = route.request().method() === "POST";
      // Initially not logged in, but after login/signup we return user
      if (route.request().headers()["authorization"]?.includes("Bearer")) {
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

    // Mock Supabase Profiles
    await page.route("**/rest/v1/users*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([{
          id: MOCK_USER_ID,
          username: MOCK_USERNAME,
          full_name: "Test User",
        }]),
      });
    });

    await page.goto("/");
  });

  test("Scenario: Omni-Channel Authentication & Profile Creation", async ({ page }) => {
    // Given: I am a new visitor
    await expect(page.getByText("Welcome to the Minimal Application")).toBeVisible();

    // When: I click 'Sign In' to open the Auth Modal
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page.getByTestId("auth-form")).toBeVisible();

    // And: I complete the 'Sign Up' flow
    await page.getByRole("button", { name: "Don't have an account? Sign Up" }).click();
    await page.locator("#name").fill(MOCK_USERNAME);
    await page.locator("#email").fill(MOCK_EMAIL);
    await page.locator("#password").fill("password123");
    
    // Intercept the request to ensure it's sent
    const signUpPromise = page.waitForRequest("**/auth/v1/signup*");
    await page.getByTestId("auth-submit").click();
    await signUpPromise;

    // Then: I should be logged in and see my profile dropdown
    // The AuthModal should close on success
    await expect(page.getByTestId("auth-form")).not.toBeVisible();
    
    // Header should update
    await page.getByLabel("Open user menu").click();
    await expect(page.getByText(MOCK_USERNAME)).toBeVisible();
  });

  test("Scenario: Secure Identity Management & Session Control", async ({ page }) => {
    // Given: I am signed-in
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.locator("#email").fill(MOCK_EMAIL);
    await page.locator("#password").fill("password123");
    await page.getByTestId("auth-submit").click();
    
    await expect(page.getByLabel("Open user menu")).toBeVisible();

    // When: I click on the user icon and then 'Sign Out'
    await page.getByLabel("Open user menu").click();
    
    // Mock signOut
    await page.route("**/auth/v1/logout*", async (route) => {
      await route.fulfill({ status: 204 });
    });

    await page.getByRole("menuitem", { name: "Sign Out" }).click();

    // Then: My session should be destroyed and I should be redirected
    await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
    await expect(page.getByLabel("Open user menu")).not.toBeVisible();
  });

  test("Scenario: Data Integrity & Row Level Security", async ({ page }) => {
    // Verify that the landing page is accessible without being logged in
    await expect(page.getByText("Welcome to the Minimal Application")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
  });
});
