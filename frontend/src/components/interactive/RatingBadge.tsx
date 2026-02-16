"use client";

import { Chip, useTheme } from "@mui/material";

interface RatingBadgeProps {
	rating: number;
}

export const RatingBadge = ({ rating }: RatingBadgeProps) => {
	const theme = useTheme();

	return (
		<Chip
			label={`${(Number(rating) || 0).toFixed(1)} / 10`}
			sx={{
				background: `linear-gradient(135deg, ${theme.palette.primary.main}30, ${theme.palette.secondary.main}30)`,
				backdropFilter: "blur(30px) saturate(180%)",
				WebkitBackdropFilter: "blur(30px) saturate(180%)",
				border: `1px solid ${theme.palette.glass?.border || "rgba(255, 255, 255, 0.2)"}`,
				borderRadius: "24px",
				px: 1.5,
				py: 0.75,
				fontSize: "0.75rem",
				fontWeight: 700,
				color: theme.palette.primary.light,
				boxShadow: `0 0 15px rgba(0, 212, 255, 0.5)`,
			}}
		/>
	);
};
