"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { isValidUsername, SLUG_MAX_LENGTH } from "../lib/validation";
import { useAuth } from "./AuthProvider";

interface AuthFormProps {
	onSuccess?: () => void;
}

export default function AuthForm({ onSuccess }: AuthFormProps) {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<AuthFormContent {...(onSuccess ? { onSuccess } : {})} />
		</Suspense>
	);
}

function AuthFormContent({ onSuccess }: AuthFormProps) {
	const [mode, setMode] = useState<"signin" | "signup">("signin");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [loading, setLoading] = useState(false);
	const searchParams = useSearchParams();
	const router = useRouter();
	const redirect = searchParams.get("redirect") || "/";

	const { supabase } = useAuth();

	const handleAuth = async (event: React.FormEvent) => {
		event.preventDefault();
		setLoading(true);

		if (mode === "signup") {
			if (!isValidUsername(name)) {
				toast.error(
					`Invalid username: must be a valid slug between 3 and ${SLUG_MAX_LENGTH} characters`,
				);
				setLoading(false);
				return;
			}

			const { error, data } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: { username: name },
					emailRedirectTo: `${window.location.origin}/auth/callback`,
				},
			});

			if (error) {
				toast.error(error.message);
			} else if (data.user && !data.session) {
				toast.success("Please check your email to verify your account.");
				setLoading(false);
			} else {
				toast.success("Account created successfully!");
				onSuccess ? onSuccess() : router.push(redirect);
			}
		} else {
			const { error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});
			if (error) {
				toast.error(error.message);
				setLoading(false);
			} else {
				toast.success("Logged in successfully!");
				onSuccess ? onSuccess() : router.push(redirect);
			}
		}
		setLoading(false);
	};

	return (
		<div className="w-full max-w-sm" data-testid="auth-form">
			<h1 className="text-2xl font-bold mb-1 tracking-tight">
				{mode === "signin" ? "Sign In" : "Sign Up"}
			</h1>
			<p className="text-neutral-500 mb-8 text-sm">
				{mode === "signin" ? "Welcome back" : "Create a new account"}
			</p>

			<form onSubmit={handleAuth} className="space-y-4">
				{mode === "signup" && (
					<div>
						<label
							htmlFor="name"
							className="block text-xs font-medium text-neutral-700 mb-1 uppercase tracking-wide"
						>
							Username
						</label>
						<input
							id="name"
							type="text"
							required
							value={name}
							onChange={(e) => {
								const sanitizedUsername = e.target.value
									.toLowerCase()
									.replace(/[^a-z0-9-]/g, "");
								setName(sanitizedUsername);
							}}
							className="w-full bg-white border border-neutral-200 rounded-lg px-4 py-2 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
							placeholder="username"
						/>
					</div>
				)}
				<div>
					<label
						htmlFor="email"
						className="block text-xs font-medium text-neutral-700 mb-1 uppercase tracking-wide"
					>
						Email
					</label>
					<input
						id="email"
						type="email"
						required
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full bg-white border border-neutral-200 rounded-lg px-4 py-2 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
						placeholder="you@example.com"
					/>
				</div>
				<div>
					<label
						htmlFor="password"
						className="block text-xs font-medium text-neutral-700 mb-1 uppercase tracking-wide"
					>
						Password
					</label>
					<input
						id="password"
						type="password"
						required
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full bg-white border border-neutral-200 rounded-lg px-4 py-2 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
						placeholder="••••••••"
					/>
				</div>

				<button
					type="submit"
					data-testid="auth-submit"
					disabled={loading}
					className="w-full bg-black text-white rounded-md py-2 font-medium hover:bg-neutral-800 transition-all disabled:opacity-50"
				>
					{loading
						? "Processing..."
						: mode === "signin"
							? "Sign In"
							: "Create Account"}
				</button>
			</form>

			<div className="mt-6 text-center text-sm">
				<button
					type="button"
					onClick={() => {
						setMode(mode === "signin" ? "signup" : "signin");
					}}
					className="text-neutral-500 hover:text-black underline underline-offset-4"
				>
					{mode === "signin"
						? "Don't have an account? Sign Up"
						: "Already have an account? Sign In"}
				</button>
			</div>
		</div>
	);
}
