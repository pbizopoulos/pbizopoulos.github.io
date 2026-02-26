import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center">
			<div className="bg-gray-100 w-16 h-16 flex items-center justify-center rounded-full mb-4 mx-auto">
				<span className="text-2xl font-bold text-gray-500">?</span>
			</div>
			<h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
			<p className="text-gray-600 mb-6 max-w-md">
				The page you are looking for does not exist or has been moved.
			</p>
			<Link
				href="/"
				className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
			>
				Return Home
			</Link>
		</div>
	);
}
