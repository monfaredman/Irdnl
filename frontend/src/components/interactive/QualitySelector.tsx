"use client";

import { Button, Stack, useTheme } from "@mui/material";
import { useContentStore } from "@/hooks/useContentStore";

export const QualitySelector = () => {
	const quality = useContentStore((state) => state.playbackQuality);
	const setQuality = useContentStore((state) => state.setPlaybackQuality);
	const options: (typeof quality)[] = ["1080p", "720p", "480p"];
	const theme = useTheme();

	const glassStyle = {
		background: theme.palette.glass?.light || "rgba(255, 255, 255, 0.06)",
		backdropFilter: "blur(20px) saturate(180%)",
		WebkitBackdropFilter: "blur(20px) saturate(180%)",
		border: `1px solid ${theme.palette.glass?.border || "rgba(255, 255, 255, 0.2)"}`,
	};

	const activeStyle = {
		background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
		backdropFilter: "blur(30px) saturate(180%)",
		WebkitBackdropFilter: "blur(30px) saturate(180%)",
		boxShadow: `0 0 15px rgba(0, 212, 255, 0.5)`,
		color: "#fff",
	};

	return (
		<Stack direction="row" spacing={1}>
			{options.map((option) => (
				<Button
					key={option}
					onClick={() => setQuality(option)}
					sx={{
						...(quality === option ? activeStyle : glassStyle),
						borderRadius: "24px",
						px: 2,
						py: 1,
						fontSize: "0.75rem",
						fontWeight: 600,
						textTransform: "uppercase",
						letterSpacing: "0.05em",
						color: quality === option ? "#fff" : "rgba(255, 255, 255, 0.7)",
						transition: "all 0.2s",
						"&:hover": {
							...(quality !== option
								? {
										borderColor: "rgba(255, 255, 255, 0.3)",
										color: "#fff",
										transform: "scale(1.05)",
									}
								: {}),
						},
					}}
				>
					{option}
				</Button>
			))}
		</Stack>
	);
};
