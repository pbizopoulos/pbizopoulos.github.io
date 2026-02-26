import { notFound } from "next/navigation";
import { createClient } from "../../lib/supabase";

export const dynamic = "force-dynamic";

export default async function Page({
	params,
}: {
	params: Promise<{ username: string }>;
}) {
	const { username } = await params;

	const supabase = await createClient();
	const { data: userProfile } = await supabase
		.from("users")
		.select("id, username, full_name, avatar_url")
		.eq("username", username)
		.maybeSingle();

	if (!userProfile) {
		notFound();
		return null;
	}

	return (
		<div className="min-h-screen bg-white text-neutral-900 p-6 md:p-12">
			<div className="max-w-4xl mx-auto">
				<div className="flex items-center gap-6 mb-8 pb-8 border-b border-neutral-100">
					<div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center text-2xl font-bold text-neutral-400">
						{userProfile.username?.[0]?.toUpperCase()}
					</div>
					<div>
						<h1 className="text-3xl font-bold tracking-tight">
							{userProfile.username}
						</h1>
						{userProfile.full_name && (
							<p className="text-neutral-500">{userProfile.full_name}</p>
						)}
					</div>
				</div>

				<div className="bg-neutral-50 rounded-2xl p-8 border border-neutral-100">
					<p className="text-neutral-500 text-center italic">
						This is a minimal profile page.
					</p>
				</div>
			</div>
		</div>
	);
}
