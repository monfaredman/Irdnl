"use client";

import { Button, keyframes, Stack, useTheme } from "@mui/material";
import { useState } from "react";
import { quickFilters } from "@/data/mockContent";
import { trackAnalytics } from "@/lib/integrations";

const shimmer = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
`;

export const QuickFilters = () => {
	const [activeFilter, setActiveFilter] = useState<string | null>(null);
	const theme = useTheme();

	const handleSelect = (filterId: string) => {
		const next = activeFilter === filterId ? null : filterId;
		setActiveFilter(next);
		trackAnalytics("quick-filter", { filterId: next });
	};

	const glassStyle = {
		background: theme.palette.glass?.light || "rgba(255, 255, 255, 0.05)",
		backdropFilter: "blur(20px) saturate(180%)",
		WebkitBackdropFilter: "blur(20px) saturate(180%)",
		border: `1px solid ${theme.palette.glass?.border || "rgba(255, 255, 255, 0.2)"}`,
	};

	const activeStyle = {
		background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
		backdropFilter: "blur(30px) saturate(180%)",
		WebkitBackdropFilter: "blur(30px) saturate(180%)",
		boxShadow: `0 0 20px rgba(0, 212, 255, 0.5)`,
		color: "#fff",
	};

	return (
		<Stack direction="row" spacing={1.5} flexWrap="wrap">
			{quickFilters.map((filter) => (
				<Button
					key={filter.id}
					onClick={() => handleSelect(filter.id)}
					sx={{
						...(activeFilter === filter.id ? activeStyle : glassStyle),
						position: "relative",
						overflow: "hidden",
						borderRadius: "24px",
						px: 2,
						py: 1,
						fontSize: "0.75rem",
						fontWeight: 600,
						textTransform: "uppercase",
						letterSpacing: "0.05em",
						color:
							activeFilter === filter.id ? "#fff" : "rgba(255, 255, 255, 0.7)",
						transition: "all 0.2s",
						"&:hover": {
							...(activeFilter !== filter.id
								? {
										borderColor: "rgba(255, 255, 255, 0.3)",
										color: "#fff",
										transform: "scale(1.05)",
									}
								: {}),
						},
						"&::before":
							activeFilter === filter.id
								? {
										content: '""',
										position: "absolute",
										inset: 0,
										background:
											"linear-gradient(to right, transparent, rgba(255, 255, 255, 0.2), transparent)",
										animation: `${shimmer} 2s infinite`,
									}
								: {},
					}}
				>
					{filter.label}
				</Button>
			))}
		</Stack>
	);
};
