"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import AuthForm from "./AuthForm";
import { useAuth } from "./AuthProvider";

export default function AuthModal() {
	const { isAuthModalOpen, closeAuthModal, user, authModalRedirectPath } =
		useAuth();
	const modalRef = useRef<HTMLDivElement>(null);
	const pathname = usePathname();
	const router = useRouter();

	const handleClose = () => {
		closeAuthModal();
		const isProtectedRoute = pathname.endsWith("/edit");
		if (isProtectedRoute && !user) {
			router.push("/");
		}
	};

	const handleSuccess = () => {
		closeAuthModal();
		if (authModalRedirectPath) {
			router.push(authModalRedirectPath);
		}
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				modalRef.current &&
				!modalRef.current.contains(event.target as Node)
			) {
				handleClose();
			}
		};

		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				handleClose();
			}
		};

		if (isAuthModalOpen) {
			document.addEventListener("mousedown", handleClickOutside);
			document.addEventListener("keydown", handleEscape);
			document.body.style.overflow = "hidden";
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = "unset";
		};
	}, [isAuthModalOpen, handleClose]);

	if (!isAuthModalOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
			<div
				ref={modalRef}
				className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8 animate-in zoom-in-95 duration-200"
			>
				<button
					type="button"
					onClick={handleClose}
					className="absolute top-4 right-4 p-1 text-neutral-400 hover:text-black transition-colors"
					aria-label="Close modal"
				>
					<span className="text-xl leading-none">×</span>
				</button>
				<AuthForm onSuccess={handleSuccess} />
			</div>
		</div>
	);
}
