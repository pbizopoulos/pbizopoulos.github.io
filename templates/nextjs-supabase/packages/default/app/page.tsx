import { createClient } from "../lib/supabase";

export const dynamic = "force-dynamic";

export default async function Page() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	return (
		<main className="min-h-screen bg-white text-neutral-900 p-6 md:p-12">
			<div className="max-w-4xl mx-auto text-center py-20">
				<h1 className="text-4xl font-bold tracking-tight mb-4">
					Welcome to the Minimal Application
				</h1>
				<p className="text-lg text-neutral-500 mb-8">
					A simple Next.js and Supabase boilerplate.
				</p>
				{user ? (
					<div className="bg-neutral-50 p-8 rounded-2xl border border-neutral-100">
						<p className="text-neutral-900 font-medium">
							You are logged in as {user.email}
						</p>
					</div>
				) : (
					<p className="text-neutral-400">
						Please sign in to access your dashboard.
					</p>
				)}
			</div>
		</main>
	);
}
