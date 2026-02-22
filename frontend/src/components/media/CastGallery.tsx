/**
 * CastGallery - Interactive cast & crew gallery with circular glass frames
 */

"use client";

import { Box, Typography, Avatar } from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import {
	glassColors,
	glassBorderRadius,
	glassBlur,
} from "@/theme/glass-design-system";

interface CastMember {
	id: number;
	name: string;
	character: string;
	profileUrl: string;
}

interface CastGalleryProps {
	cast: CastMember[];
	onMemberClick?: (member: CastMember) => void;
}

export function CastGallery({ cast, onMemberClick }: CastGalleryProps) {
	const [hoveredId, setHoveredId] = useState<number | null>(null);

	if (!cast.length) return null;

	// Helper to create cast member slug
	const createSlug = (id: number, name: string) => {
		const slug = name
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, "")
			.replace(/\s+/g, "-");
		return `${id}-${slug}`;
	};

	return (
		<Box sx={{ mb: 4 }}>
			{/* Section Title */}
			<Typography
				variant="h5"
				sx={{
					color: glassColors.text.primary,
					fontWeight: 700,
					mb: 3,
				}}
				dir="rtl"
			>
				بازیگران و عوامل
			</Typography>

			{/* Cast Grid */}
			<Box
				sx={{
					display: "flex",
					gap: 3,
					overflowX: "auto",
					overflowY: "hidden",
					pb: 2,
					"&::-webkit-scrollbar": {
						height: 8,
					},
					"&::-webkit-scrollbar-track": {
						background: glassColors.glass.base,
						borderRadius: glassBorderRadius.sm,
					},
					"&::-webkit-scrollbar-thumb": {
						background: glassColors.glass.strong,
						borderRadius: glassBorderRadius.sm,
					},
					padding:"8px 0"
				}}
			>
				{cast.map((member) => (
					<Box
						key={member.id}
						component={Link}
						href={`/cast/${createSlug(member.id, member.name)}`}
						onMouseEnter={() => setHoveredId(member.id)}
						onMouseLeave={() => setHoveredId(null)}
						onClick={(e) => {
							if (onMemberClick) {
								e.preventDefault();
								onMemberClick(member);
							}
						}}
						sx={{
							position: "relative",
							flexShrink: 0,
							width: 140,
							cursor: "pointer",
							transition: "transform 0.3s ease",
							transform:
								hoveredId === member.id ? "translateY(-8px)" : "translateY(0)",
							textDecoration: "none",
						}}
					>
						{/* Profile Picture in Glass Frame */}
						<Box
							sx={{
								position: "relative",
								width: 120,
								height: 120,
								mx: "auto",
								mb: 2,
							}}
						>
							{/* Glow Effect */}
							{hoveredId === member.id && (
								<Box
									sx={{
										position: "absolute",
										inset: -4,
										borderRadius: "50%",
										background: `radial-gradient(circle, ${glassColors.gold.glow}, transparent)`,
										animation: "pulse 2s ease-in-out infinite",
										"@keyframes pulse": {
											"0%, 100%": { opacity: 0.5 },
											"50%": { opacity: 1 },
										},
									}}
								/>
							)}

							{/* Avatar */}
							<Avatar
								src={member.profileUrl}
								alt={member.name}
								sx={{
									width: 120,
									height: 120,
									border: `3px solid ${hoveredId === member.id ? glassColors.gold.solid : glassColors.glass.border}`,
									background: glassColors.glass.mid,
									transition: "all 0.3s ease",
									position: "relative",
									zIndex: 1,
									"& img": {
										filter:
											hoveredId === member.id ? "brightness(1.1)" : "none",
									},
								}}
							/>

							{/* Glass Ring */}
							<Box
								sx={{
									position: "absolute",
									inset: -2,
									borderRadius: "50%",
									border: `1px solid ${glassColors.glass.border}`,
									background: `linear-gradient(135deg, ${glassColors.glass.border}, transparent)`,
									opacity: hoveredId === member.id ? 1 : 0.5,
									transition: "opacity 0.3s ease",
								}}
							/>
						</Box>

						{/* Info Card */}
						<Box
							sx={{
								textAlign: "center",
								p: 2,
								borderRadius: glassBorderRadius.md,
								background:
									hoveredId === member.id
										? `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`
										: glassColors.glass.base,
								backdropFilter: glassBlur.light,
								WebkitBackdropFilter: glassBlur.light,
								border: `1px solid ${hoveredId === member.id ? glassColors.glass.border : "transparent"}`,
								transition: "all 0.3s ease",
								minHeight: 80,
							}}
						>
							{/* Actor Name */}
							<Typography
								sx={{
									color: glassColors.text.primary,
									fontSize: "0.875rem",
									fontWeight: 600,
									mb: 0.5,
									lineHeight: 1.3,
								}}
							>
								{member.name}
							</Typography>

							{/* Character Name */}
							<Typography
								sx={{
									color: glassColors.text.tertiary,
									fontSize: "0.75rem",
									fontWeight: 400,
									lineHeight: 1.3,
								}}
							>
								{member.character}
							</Typography>
						</Box>
					</Box>
				))}
			</Box>
		</Box>
	);
}
