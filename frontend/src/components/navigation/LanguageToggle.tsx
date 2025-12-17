"use client";

import { Box, Button, useTheme } from "@mui/material";
import { useLanguage } from "@/providers/language-provider";

export const LanguageToggle = () => {
	const { language, setLanguage } = useLanguage();
	const theme = useTheme();
	const options: Array<{ code: "fa" | "en"; label: string }> = [
		{ code: "fa", label: "فا" },
		{ code: "en", label: "EN" },
	];

	const glassStyle = {
		background: theme.palette.glass?.light || "rgba(255, 255, 255, 0.05)",
		backdropFilter: "blur(20px) saturate(180%)",
		WebkitBackdropFilter: "blur(20px) saturate(180%)",
		border: `1px solid ${theme.palette.glass?.border || "rgba(255, 255, 255, 0.2)"}`,
	};

	const glassStrongStyle = {
		background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
		backdropFilter: "blur(30px) saturate(180%)",
		WebkitBackdropFilter: "blur(30px) saturate(180%)",
		boxShadow: `0 0 15px rgba(0, 212, 255, 0.5)`,
	};

	return (
		<Box
			sx={{
				...glassStyle,
				display: "flex",
				alignItems: "center",
				borderRadius: "24px",
				p: 0.5,
				fontSize: "0.75rem",
			}}
		>
			{options.map((option) => (
				<Button
					key={option.code}
					onClick={() => setLanguage(option.code)}
					sx={{
						borderRadius: "24px",
						px: 1.5,
						py: 0.75,
						minWidth: "auto",
						fontSize: "0.75rem",
						fontWeight: 500,
						textTransform: "none",
						color:
							language === option.code ? "#fff" : "rgba(255, 255, 255, 0.6)",
						...(language === option.code ? glassStrongStyle : {}),
						transition: "all 0.2s",
						"&:hover": {
							color: "#fff",
							...(language !== option.code
								? { background: theme.palette.glass?.medium }
								: {}),
						},
					}}
					aria-pressed={language === option.code}
				>
					{option.label}
				</Button>
			))}
		</Box>
	);
};
