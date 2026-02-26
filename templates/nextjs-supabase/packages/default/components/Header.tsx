"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthProvider";
import UserAvatar from "./UserAvatar";

export default function Header() {
	const router = useRouter();
	const { user, profile, signOut, openAuthModal } = useAuth();
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(e.target as Node)
			) {
				setDropdownOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleSignOut = async () => {
		setDropdownOpen(false);
		await signOut();
		router.push("/");
	};

	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<header className="w-full max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4 sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-100 mb-4">
				<div className="flex items-center gap-2 text-sm shrink-0">
					<div className="font-bold text-xl tracking-tight flex items-center gap-2 opacity-0">
						<div className="w-8 h-8 rounded-full bg-neutral-100" />
						<span className="text-black hidden sm:inline">Minimal App</span>
					</div>
				</div>
				<div className="flex items-center gap-4">
					<div className="h-8 w-24 bg-neutral-100 rounded animate-pulse" />
				</div>
			</header>
		);
	}

	return (
		<header className="w-full max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4 sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-100 mb-4">
			<div className="flex items-center gap-2 text-sm shrink-0">
				<Link
					href="/"
					className="font-bold text-xl tracking-tight flex items-center gap-2 hover:opacity-80 transition-opacity"
					aria-label="Home"
				>
					<Image
						src="/icon.png"
						alt="Logo"
						width={32}
						height={32}
						className="w-8 h-8"
						priority={true}
					/>
					<span className="text-black hidden sm:inline">Minimal App</span>
				</Link>
			</div>

			<div className="flex items-center gap-4">
				<div className="h-6 w-px bg-neutral-200" aria-hidden="true" />
				{user ? (
					<div className="relative" ref={dropdownRef}>
						<button
							type="button"
							onClick={() => setDropdownOpen(!dropdownOpen)}
							className="flex items-center gap-2 group"
							aria-label="Open user menu"
							aria-expanded={dropdownOpen}
							aria-haspopup="true"
						>
							<UserAvatar username={profile?.username ?? null} size={28} />
						</button>

						{dropdownOpen && (
							<div
								className="absolute right-0 mt-2 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg py-1 z-50"
								role="menu"
							>
								<div className="px-4 py-2 text-sm text-neutral-500 border-b border-neutral-100">
									Signed in as <br />
									<span className="text-neutral-900 font-medium">
										{profile?.username}
									</span>
								</div>
								<button
									type="button"
									onClick={handleSignOut}
									className="flex items-center gap-2 w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
									role="menuitem"
								>
									Sign Out
								</button>
							</div>
						)}
					</div>
				) : (
					<button
						type="button"
						onClick={() => openAuthModal()}
						className="text-sm font-medium hover:text-black text-neutral-500 transition-colors"
						aria-label="Sign in to your account"
					>
						Sign In
					</button>
				)}
			</div>
		</header>
	);
}
