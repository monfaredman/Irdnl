"use client";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Box, Button, Stack, useTheme } from "@mui/material";
import { useLanguage } from "@/providers/language-provider";

export const FilterBar = () => {
	const theme = useTheme();
	const { language } = useLanguage();

	const filters =
		language === "fa"
			? [
					{ id: "apply", label: "اعمال فیلتر", icon: true },
					{ id: "advanced", label: "جستجوی پیشرفته" },
					{ id: "quality", label: "کیفیت" },
					{ id: "genre", label: "ژانر" },
					{ id: "country", label: "کشور سازنده" },
					{ id: "rating", label: "امتیاز" },
					{ id: "year", label: "سال" },
					{ id: "watchFrom", label: "تماشا از" },
				]
			: [
					{ id: "apply", label: "Apply Filter", icon: true },
					{ id: "advanced", label: "Advanced Search" },
					{ id: "quality", label: "Quality" },
					{ id: "genre", label: "Genre" },
					{ id: "country", label: "Country" },
					{ id: "rating", label: "Rating" },
					{ id: "year", label: "Year" },
					{ id: "watchFrom", label: "Watch From" },
				];

	const glassStyle = {
		background: theme.palette.glass?.light || "rgba(255, 255, 255, 0.05)",
		backdropFilter: "blur(20px) saturate(180%)",
		WebkitBackdropFilter: "blur(20px) saturate(180%)",
		border: `1px solid ${theme.palette.glass?.border || "rgba(255, 255, 255, 0.1)"}`,
	};

	return (
		<Box
			sx={{
				...glassStyle,
				borderRadius: 2,
				p: 1.5,
				mb: 4,
				overflowX: "auto",
				"&::-webkit-scrollbar": {
					height: 4,
				},
			}}
		>
			<Stack direction="row" spacing={1.5} sx={{ minWidth: "max-content" }}>
				{filters.map((filter) => (
					<Button
						key={filter.id}
						variant={filter.id === "apply" ? "contained" : "outlined"}
						endIcon={filter.icon ? <ArrowDropDownIcon /> : undefined}
						sx={{
							borderRadius: 2,
							px: 2.5,
							py: 1,
							fontSize: "0.875rem",
							textTransform: "none",
							whiteSpace: "nowrap",
							...(filter.id === "apply"
								? {
										background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.tertiary?.main || theme.palette.secondary.main} 100%)`,
										"&:hover": {
											background: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.tertiary?.light || theme.palette.secondary.light} 100%)`,
										},
									}
								: {
										borderColor:
											theme.palette.glass?.border || "rgba(255, 255, 255, 0.1)",
										color: "rgba(255, 255, 255, 0.7)",
										"&:hover": {
											borderColor: theme.palette.primary.light,
											color: "#fff",
											background:
												theme.palette.glass?.medium ||
												"rgba(255, 255, 255, 0.08)",
										},
									}),
						}}
					>
						{filter.label}
					</Button>
				))}
			</Stack>
		</Box>
	);
};
