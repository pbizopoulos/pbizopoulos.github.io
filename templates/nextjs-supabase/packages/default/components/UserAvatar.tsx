import { User } from "lucide-react";

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
					<User size={size * 0.6} />
				</div>
			)}
		</div>
	);
}
