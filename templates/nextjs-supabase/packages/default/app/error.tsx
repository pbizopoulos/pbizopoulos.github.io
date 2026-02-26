"use client";

import { useEffect } from "react";

export default function ErrorPage({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
			<div className="text-center max-w-md">
				<div className="bg-red-50 w-16 h-16 flex items-center justify-center rounded-full mb-4 mx-auto">
					<span className="text-2xl font-bold text-red-500">!</span>
				</div>
				<h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
				<p className="text-neutral-500 mb-8">
					We apologize for the inconvenience. An unexpected error has occurred.
				</p>
				<button
					type="button"
					onClick={() => reset()}
					className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
				>
					Try again
				</button>
			</div>
		</div>
	);
}
