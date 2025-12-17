"use client";

import { Avatar, Button, Stack, useTheme } from "@mui/material";
import Image from "next/image";
import { useContentStore } from "@/hooks/useContentStore";

export const ProfileSwitcher = () => {
	const profiles = useContentStore((state) => state.profiles);
	const activeProfileId = useContentStore((state) => state.activeProfileId);
	const setActiveProfile = useContentStore((state) => state.setActiveProfile);
	const theme = useTheme();

	const glassStyle = {
		background: theme.palette.glass?.light || "rgba(255, 255, 255, 0.05)",
		backdropFilter: "blur(20px) saturate(180%)",
		WebkitBackdropFilter: "blur(20px) saturate(180%)",
		border: `1px solid ${theme.palette.glass?.border || "rgba(255, 255, 255, 0.2)"}`,
	};

	const activeStyle = {
		background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
		backdropFilter: "blur(30px) saturate(180%)",
		WebkitBackdropFilter: "blur(30px) saturate(180%)",
		border: `1px solid ${theme.palette.primary.light}80`,
		boxShadow: `0 0 20px rgba(0, 212, 255, 0.4)`,
		color: theme.palette.primary.light,
	};

	return (
		<Stack direction="row" spacing={1.5} flexWrap="wrap">
			{profiles.map((profile) => (
				<Button
					key={profile.id}
					onClick={() => setActiveProfile(profile.id)}
					startIcon={
						<Avatar
							src={profile.avatar}
							alt={profile.name}
							sx={{
								width: 24,
								height: 24,
								border:
									profile.id === activeProfileId
										? `2px solid ${theme.palette.primary.light}80`
										: "none",
								transition: "all 0.3s",
							}}
						/>
					}
					sx={{
						...(profile.id === activeProfileId ? activeStyle : glassStyle),
						borderRadius: "24px",
						px: 2,
						py: 1,
						fontSize: "0.875rem",
						fontWeight: 500,
						textTransform: "none",
						color:
							profile.id === activeProfileId
								? theme.palette.primary.light
								: "rgba(255, 255, 255, 0.7)",
						transition: "all 0.2s",
						"&:hover": {
							...(profile.id !== activeProfileId
								? {
										borderColor: "rgba(255, 255, 255, 0.3)",
										color: "#fff",
										transform: "scale(1.05)",
									}
								: {}),
						},
					}}
				>
					{profile.name}
				</Button>
			))}
		</Stack>
	);
};
