export function getAvatarColor(str: string): string {
	let hash = 0;
	for (let charIndex = 0; charIndex < str.length; charIndex++) {
		hash = str.charCodeAt(charIndex) + ((hash << 5) - hash);
	}
	const hue = Math.abs(hash % 360);
	return `hsl(${hue}, 70%, 50%)`;
}

interface UserAvatarProps {
	username?: string | null;
	size?: number;
	className?: string;
}

export default function UserAvatar({
	username,
	size = 32,
	className = "",
}: UserAvatarProps) {
	const initials = username?.slice(0, 2).toUpperCase();
	const bgColor = username ? getAvatarColor(username) : "#e5e5e5";

	return (
		<div
			className={`rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 ${className}`}
			style={{
				width: size,
				height: size,
				backgroundColor: bgColor,
			}}
		>
			{username ? (
				<span className="text-white font-medium text-xs leading-none">
					{initials}
				</span>
			) : (
				<div className="bg-neutral-100 w-full h-full flex items-center justify-center text-neutral-400">
					<svg
						width={size * 0.6}
						height={size * 0.6}
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
						<circle cx="12" cy="7" r="4" />
					</svg>
				</div>
			)}
		</div>
	);
}
