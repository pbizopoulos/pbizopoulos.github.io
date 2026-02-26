import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "../../app/auth/callback/route";

vi.mock("@supabase/ssr", () => ({
	createServerClient: vi.fn(),
}));

vi.mock("next/headers", () => ({
	cookies: vi.fn(),
}));

vi.mock("next/server", () => ({
	NextResponse: {
		redirect: vi.fn((url) => ({
			url,
			status: 302,
		})),
	},
}));

describe("Auth Callback route", () => {
	const mockSupabase = {
		auth: {
			exchangeCodeForSession: vi.fn(),
		},
	};

	const mockCookieStore = {
		getAll: vi.fn().mockReturnValue([]),
		set: vi.fn(),
	};

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(createServerClient).mockReturnValue(
			mockSupabase as unknown as SupabaseClient,
		);
		vi.mocked(cookies).mockResolvedValue(
			mockCookieStore as unknown as Awaited<ReturnType<typeof cookies>>,
		);
	});

	it("should redirect to login if no code is present", async () => {
		const req = {
			url: "http://localhost:3000/auth/callback",
			headers: new Headers(),
		} as unknown as Request;
		await GET(req);
		expect(NextResponse.redirect).toHaveBeenCalledWith(
			"http://localhost:3000/?error=auth",
		);
	});

	it("should redirect to login if exchangeCodeForSession fails", async () => {
		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		vi.mocked(mockSupabase.auth.exchangeCodeForSession).mockResolvedValue({
			error: { message: "error" },
		});
		const req = {
			url: "http://localhost:3000/auth/callback?code=123",
			headers: new Headers(),
		} as unknown as Request;
		await GET(req);
		expect(NextResponse.redirect).toHaveBeenCalledWith(
			"http://localhost:3000/?error=auth",
		);
		consoleSpy.mockRestore();
	});

	it("should redirect to the next url after successful exchange in development", async () => {
		vi.stubEnv("NODE_ENV", "development");
		vi.mocked(mockSupabase.auth.exchangeCodeForSession).mockResolvedValue({
			error: null,
		});
		const req = {
			url: "http://localhost:3000/auth/callback?code=123&next=/test",
			headers: new Headers(),
		} as unknown as Request;
		await GET(req);
		expect(NextResponse.redirect).toHaveBeenCalledWith(
			"http://localhost:3000/test",
		);
	});

	it("should redirect using x-forwarded-host headers in non-dev environment", async () => {
		vi.stubEnv("NODE_ENV", "production");
		vi.mocked(mockSupabase.auth.exchangeCodeForSession).mockResolvedValue({
			error: null,
		});
		const headers = new Headers();
		headers.set("x-forwarded-host", "example.com");
		const req = {
			url: "http://localhost:3000/auth/callback?code=123",
			headers: headers,
		} as unknown as Request;
		await GET(req);
		expect(NextResponse.redirect).toHaveBeenCalledWith("https://example.com/");
	});

	it("should fallback to origin if x-forwarded-host is missing in non-dev environment", async () => {
		vi.stubEnv("NODE_ENV", "production");
		vi.mocked(mockSupabase.auth.exchangeCodeForSession).mockResolvedValue({
			error: null,
		});
		const req = {
			url: "http://localhost:3000/auth/callback?code=123",
			headers: new Headers(),
		} as unknown as Request;
		await GET(req);
		expect(NextResponse.redirect).toHaveBeenCalledWith(
			"http://localhost:3000/",
		);
	});
});
