"use client";

import {
	Box,
	FormControl,
	MenuItem,
	Select,
	Slider,
	Typography,
} from "@mui/material";
import { useState } from "react";
import { useLanguage } from "@/providers/language-provider";
import {
	glassAnimations,
	glassBlur,
	glassBorderRadius,
	glassColors,
	glassSpacing,
} from "@/theme/glass-design-system";

interface FiltersSectionProps {
	onFilterChange?: (filters: FilterState) => void;
}

interface FilterState {
	type: string;
	genre: string;
	country: string;
	yearRange: [number, number];
	ageRating: string;
}

/**
 * Filters Section - LiquidGlass Design
 * - Type, Genre, Country, Year Range, Age Rating
 * - Horizontal layout with glass styling
 */
export const FiltersSection = ({ onFilterChange }: FiltersSectionProps) => {
	const { language } = useLanguage();
	const [filters, setFilters] = useState<FilterState>({
		type: "all",
		genre: "all",
		country: "all",
		yearRange: [2000, 2024],
		ageRating: "all",
	});

	const handleFilterChange = (
		key: keyof FilterState,
		value: string | [number, number],
	) => {
		const newFilters = { ...filters, [key]: value };
		setFilters(newFilters);
		onFilterChange?.(newFilters);
	};

	const glassSelectStyle = {
		minWidth: { xs: "100%", sm: 150 },
		borderRadius: glassBorderRadius.md,
		background: glassColors.glass.base,
		backdropFilter: `blur(${glassBlur.medium}px) saturate(180%)`,
		WebkitBackdropFilter: `blur(${glassBlur.medium}px) saturate(180%)`,
		border: `1px solid ${glassColors.glass.border}`,
		boxShadow: `inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
		transition: glassAnimations.transition.smooth,
		color: glassColors.text.primary,
		"& .MuiOutlinedInput-notchedOutline": {
			border: "none",
		},
		"&:hover": {
			background: glassColors.glass.mid,
			border: `1px solid ${glassColors.persianGold}40`,
		},
		"& .MuiSelect-icon": {
			color: glassColors.persianGold,
		},
	};

	const menuProps = {
		PaperProps: {
			sx: {
				mt: 1,
				borderRadius: glassBorderRadius.lg,
				background: `linear-gradient(180deg, ${glassColors.deepMidnight}F5, ${glassColors.deepMidnight}E5)`,
				backdropFilter: `blur(${glassBlur.strong}px) saturate(180%)`,
				WebkitBackdropFilter: `blur(${glassBlur.strong}px) saturate(180%)`,
				border: `1px solid ${glassColors.glass.border}`,
				boxShadow: `0 16px 48px rgba(0, 0, 0, 0.6)`,
				"& .MuiMenuItem-root": {
					color: glassColors.text.secondary,
					borderRadius: glassBorderRadius.sm,
					mx: 1,
					my: 0.5,
					transition: glassAnimations.transition.springFast,
					"&:hover": {
						background: glassColors.glass.mid,
						color: glassColors.text.primary,
					},
					"&.Mui-selected": {
						background: `${glassColors.persianGold}20`,
						color: glassColors.persianGold,
						"&:hover": {
							background: `${glassColors.persianGold}30`,
						},
					},
				},
			},
		},
	};

	return (
		<Box
			component="section"
			sx={{
				py: `${glassSpacing.xl}px`,
				px: { xs: 2, md: 4 },
			}}
		>
			<Box
				sx={{
					maxWidth: "1400px",
					mx: "auto",
					p: 3,
					borderRadius: glassBorderRadius.xl,
					background: glassColors.glass.base,
					backdropFilter: `blur(${glassBlur.medium}px) saturate(180%)`,
					WebkitBackdropFilter: `blur(${glassBlur.medium}px) saturate(180%)`,
					border: `1px solid ${glassColors.glass.border}`,
					boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `,
				}}
			>
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: {
							xs: "1fr",
							sm: "repeat(2, 1fr)",
							md: "repeat(3, 1fr)",
							lg: "repeat(5, 1fr)",
						},
						gap: 3,
						alignItems: "start",
					}}
				>
					{/* Type Filter */}
					<FormControl>
						<Typography
							variant="caption"
							sx={{
								mb: 1,
								color: glassColors.text.secondary,
								fontWeight: 600,
								fontSize: "0.75rem",
								textTransform: "uppercase",
								letterSpacing: "0.05em",
							}}
						>
							{language === "fa" ? "نوع" : "Type"}
						</Typography>
						<Select
							value={filters.type}
							onChange={(e) => handleFilterChange("type", e.target.value)}
							size="small"
							sx={glassSelectStyle}
							MenuProps={menuProps}
						>
							<MenuItem value="all">
								{language === "fa" ? "همه" : "All"}
							</MenuItem>
							<MenuItem value="movie">
								{language === "fa" ? "فیلم" : "Movie"}
							</MenuItem>
							<MenuItem value="series">
								{language === "fa" ? "سریال" : "Series"}
							</MenuItem>
							<MenuItem value="animation">
								{language === "fa" ? "انیمیشن" : "Animation"}
							</MenuItem>
						</Select>
					</FormControl>

					{/* Genre Filter */}
					<FormControl>
						<Typography
							variant="caption"
							sx={{
								mb: 1,
								color: glassColors.text.secondary,
								fontWeight: 600,
								fontSize: "0.75rem",
								textTransform: "uppercase",
								letterSpacing: "0.05em",
							}}
						>
							{language === "fa" ? "ژانر" : "Genre"}
						</Typography>
						<Select
							value={filters.genre}
							onChange={(e) => handleFilterChange("genre", e.target.value)}
							size="small"
							sx={glassSelectStyle}
							MenuProps={menuProps}
						>
							<MenuItem value="all">
								{language === "fa" ? "همه" : "All"}
							</MenuItem>
							<MenuItem value="action">
								{language === "fa" ? "اکشن" : "Action"}
							</MenuItem>
							<MenuItem value="drama">
								{language === "fa" ? "درام" : "Drama"}
							</MenuItem>
							<MenuItem value="comedy">
								{language === "fa" ? "کمدی" : "Comedy"}
							</MenuItem>
							<MenuItem value="thriller">
								{language === "fa" ? "هیجان‌انگیز" : "Thriller"}
							</MenuItem>
							<MenuItem value="horror">
								{language === "fa" ? "ترسناک" : "Horror"}
							</MenuItem>
						</Select>
					</FormControl>

					{/* Country Filter */}
					<FormControl>
						<Typography
							variant="caption"
							sx={{
								mb: 1,
								color: glassColors.text.secondary,
								fontWeight: 600,
								fontSize: "0.75rem",
								textTransform: "uppercase",
								letterSpacing: "0.05em",
							}}
						>
							{language === "fa" ? "کشور" : "Country"}
						</Typography>
						<Select
							value={filters.country}
							onChange={(e) => handleFilterChange("country", e.target.value)}
							size="small"
							sx={glassSelectStyle}
							MenuProps={menuProps}
						>
							<MenuItem value="all">
								{language === "fa" ? "همه" : "All"}
							</MenuItem>
							<MenuItem value="iran">
								{language === "fa" ? "ایران" : "Iran"}
							</MenuItem>
							<MenuItem value="usa">
								{language === "fa" ? "آمریکا" : "USA"}
							</MenuItem>
							<MenuItem value="uk">
								{language === "fa" ? "انگلیس" : "UK"}
							</MenuItem>
							<MenuItem value="korea">
								{language === "fa" ? "کره" : "Korea"}
							</MenuItem>
							<MenuItem value="japan">
								{language === "fa" ? "ژاپن" : "Japan"}
							</MenuItem>
						</Select>
					</FormControl>

					{/* Year Range */}
					<FormControl>
						<Typography
							variant="caption"
							sx={{
								mb: 1,
								color: glassColors.text.secondary,
								fontWeight: 600,
								fontSize: "0.75rem",
								textTransform: "uppercase",
								letterSpacing: "0.05em",
							}}
						>
							{language === "fa" ? "سال" : "Year"}
						</Typography>
						<Box
							sx={{
								px: 2,
								pt: 1,
								pb: 0.5,
								borderRadius: glassBorderRadius.md,
								background: glassColors.glass.base,
								backdropFilter: `blur(${glassBlur.medium}px) saturate(180%)`,
								border: `1px solid ${glassColors.glass.border}`,
							}}
						>
							<Slider
								value={filters.yearRange}
								onChange={(_, value) =>
									handleFilterChange("yearRange", value as [number, number])
								}
								valueLabelDisplay="auto"
								min={1980}
								max={2024}
								sx={{
									color: glassColors.persianGold,
									"& .MuiSlider-thumb": {
										background: `linear-gradient(135deg, ${glassColors.persianGold}, ${glassColors.gold.light})`,
										border: `2px solid ${glassColors.glass.border}`,
										boxShadow: `0 4px 12px ${glassColors.gold.glow}`,
									},
									"& .MuiSlider-track": {
										background: `linear-gradient(90deg, ${glassColors.persianGold}, ${glassColors.gold.light})`,
									},
									"& .MuiSlider-rail": {
										background: glassColors.glass.border,
									},
								}}
							/>
							<Typography
								variant="caption"
								sx={{
									display: "block",
									textAlign: "center",
									color: glassColors.text.tertiary,
									fontSize: "0.75rem",
									mt: -0.5,
								}}
							>
								{filters.yearRange[0]} - {filters.yearRange[1]}
							</Typography>
						</Box>
					</FormControl>

					{/* Age Rating */}
					<FormControl>
						<Typography
							variant="caption"
							sx={{
								mb: 1,
								color: glassColors.text.secondary,
								fontWeight: 600,
								fontSize: "0.75rem",
								textTransform: "uppercase",
								letterSpacing: "0.05em",
							}}
						>
							{language === "fa" ? "رده سنی" : "Age Rating"}
						</Typography>
						<Select
							value={filters.ageRating}
							onChange={(e) => handleFilterChange("ageRating", e.target.value)}
							size="small"
							sx={glassSelectStyle}
							MenuProps={menuProps}
						>
							<MenuItem value="all">
								{language === "fa" ? "همه" : "All"}
							</MenuItem>
							<MenuItem value="g">{language === "fa" ? "عمومی" : "G"}</MenuItem>
							<MenuItem value="pg">{language === "fa" ? "+۱۲" : "PG"}</MenuItem>
							<MenuItem value="pg13">
								{language === "fa" ? "+۱۳" : "PG-13"}
							</MenuItem>
							<MenuItem value="r">{language === "fa" ? "+۱۸" : "R"}</MenuItem>
						</Select>
					</FormControl>
				</Box>
			</Box>
		</Box>
	);
};
