import { afterEach, describe, expect, it, vi } from "vitest";
import { createClient } from "../../lib/supabase";

vi.mock("@supabase/ssr", () => ({
	createServerClient: vi.fn((url, key, options) => ({
		url,
		key,
		options,
		auth: {
			getUser: vi.fn(),
		},
		from: vi.fn(),
	})),
}));

vi.mock("next/headers", () => ({
	cookies: vi.fn(() => ({
		getAll: vi.fn(() => []),
		set: vi.fn(),
	})),
}));

describe("Supabase", () => {
	const originalEnv = process.env;

	afterEach(() => {
		process.env = originalEnv;
		vi.clearAllMocks();
	});

	it("should create a client with cookies by default", async () => {
		process.env["NEXT_PUBLIC_SUPABASE_URL"] = "https://example.com";
		process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"] = "anon-key";

		// biome-ignore lint/suspicious/noExplicitAny: accessing mock properties
		const supabaseClient = (await createClient()) as any;
		expect(supabaseClient).toBeDefined();
		expect(supabaseClient.url).toBe("https://example.com");
		expect(supabaseClient.key).toBe("anon-key");
		expect(supabaseClient.options.cookies).toBeDefined();
		expect(supabaseClient.options.cookies.getAll).toBeDefined();
		expect(supabaseClient.options.cookies.setAll).toBeDefined();
	});

	it("should create a client without cookies when useCookies is false", async () => {
		process.env["NEXT_PUBLIC_SUPABASE_URL"] = "https://example.com";
		process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"] = "anon-key";

		// biome-ignore lint/suspicious/noExplicitAny: accessing mock properties
		const supabaseClient = (await createClient(false)) as any;
		expect(supabaseClient).toBeDefined();
		expect(supabaseClient.options.cookies.getAll()).toEqual([]);
	});

	it("should throw error if env vars are missing", async () => {
		process.env["NEXT_PUBLIC_SUPABASE_URL"] = "";
		await expect(createClient()).rejects.toThrow(
			"Missing env NEXT_PUBLIC_SUPABASE_URL",
		);

		process.env["NEXT_PUBLIC_SUPABASE_URL"] = "https://example.com";
		process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"] = "";
		await expect(createClient()).rejects.toThrow(
			"Missing env NEXT_PUBLIC_SUPABASE_ANON_KEY",
		);
	});
});
