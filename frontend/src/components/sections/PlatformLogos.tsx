"use client";

import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useLanguage } from "@/providers/language-provider";

const platforms = [
	{ id: "telewebion", name: "تلوبیون", nameEn: "Telewebion", logo: "TW" },
	{ id: "namava", name: "نماوا", nameEn: "Namava", logo: "NAMAVA" },
	{ id: "aio", name: "آیو", nameEn: "Aio", logo: "ai" },
	{ id: "filimo", name: "فیلیمو", nameEn: "Filimo", logo: "▶" },
	{ id: "filmnet", name: "فیلم نت", nameEn: "Filmnet", logo: "F" },
];

export const PlatformLogos = () => {
	const theme = useTheme();
	const { language } = useLanguage();

	const glassStyle = {
		background: theme.palette.glass?.light || "rgba(255, 255, 255, 0.05)",
		backdropFilter: "blur(20px) saturate(180%)",
		WebkitBackdropFilter: "blur(20px) saturate(180%)",
		border: `1px solid ${theme.palette.glass?.border || "rgba(255, 255, 255, 0.1)"}`,
	};

	return (
		<Box component="section" sx={{ mb: 6 }}>
			<Typography
				variant="h5"
				sx={{
					fontSize: { xs: "1.25rem", md: "1.5rem" },
					fontWeight: 700,
					color: "#fff",
					mb: 3,
				}}
			>
				{language === "fa"
					? "تماشا از پلتفرم مورد علاقه شما"
					: "Watch from your favorite platform"}
			</Typography>
			<Stack
				direction="row"
				spacing={3}
				sx={{
					flexWrap: "wrap",
					justifyContent: { xs: "center", md: "flex-start" },
				}}
			>
				{platforms.map((platform) => (
					<Box
						key={platform.id}
						sx={{
							...glassStyle,
							borderRadius: 3,
							p: 3,
							minWidth: { xs: 120, sm: 140 },
							textAlign: "center",
							transition: "all 0.3s",
							cursor: "pointer",
							"&:hover": {
								transform: "scale(1.05)",
								borderColor: theme.palette.primary.light,
								boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.4), 0 0 30px rgba(147, 51, 234, 0.2)`,
							},
						}}
					>
						<Box
							sx={{
								width: 80,
								height: 80,
								borderRadius: 2,
								background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								fontSize: "1.5rem",
								fontWeight: 700,
								color: "#fff",
								mb: 2,
								mx: "auto",
							}}
						>
							{platform.logo}
						</Box>
						<Typography
							sx={{
								fontSize: "0.875rem",
								color: "rgba(255, 255, 255, 0.8)",
								fontWeight: 500,
							}}
						>
							{language === "fa" ? platform.name : platform.nameEn}
						</Typography>
					</Box>
				))}
			</Stack>
		</Box>
	);
};
