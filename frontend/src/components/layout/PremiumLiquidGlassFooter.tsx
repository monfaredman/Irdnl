"use client";

import {
	Facebook,
	Instagram,
	Language as LanguageIcon,
	Twitter,
	YouTube,
} from "@mui/icons-material";
import {
	Box,
	Container,
	IconButton,
	Link as MuiLink,
	Typography,
} from "@mui/material";
import Link from "next/link";
import { routes } from "@/lib/routes";
import { useLanguage } from "@/providers/language-provider";
import { liquidGlassColors } from "@/theme/liquid-glass-theme";

interface FooterLink {
	label: string;
	labelFa: string;
	href: string;
}

interface FooterSection {
	title: string;
	titleFa: string;
	links: FooterLink[];
}

const footerSections: FooterSection[] = [
	{
		title: "Content",
		titleFa: "محتوا",
		links: [
			{ label: "Foreign Movies", labelFa: "فیلم خارجی", href: "/movie/foreign" },
			{ label: "Iranian Movies", labelFa: "فیلم ایرانی", href: "/movie/iranian" },
			{ label: "Foreign Series", labelFa: "سریال خارجی", href: "/serie/foreign" },
			{ label: "Iranian Series", labelFa: "سریال ایرانی", href: "/serie/iranian" },
			{ label: "Animation", labelFa: "انیمیشن", href: "/animation" },
			{ label: "Anime", labelFa: "انیمه", href: "/anime" },
		],
	},
	{
		title: "Categories",
		titleFa: "دسته‌بندی",
		links: [
			{ label: "Coming Soon", labelFa: "به‌زودی", href: "/category/coming-soon" },
			{ label: "Collections", labelFa: "مجموعه‌ها", href: "/category/collections" },
			{ label: "Kids Zone", labelFa: "کودکان", href: "/category/kids" },
			{ label: "Dubbed", labelFa: "دوبله", href: "/dubbed" },
		],
	},
	{
		title: "Support",
		titleFa: "پشتیبانی",
		links: [
			{ label: "Help Center", labelFa: "راهنما", href: routes.help },
			{ label: "Contact", labelFa: "تماس", href: routes.contact },
			{ label: "FAQ", labelFa: "سوالات متداول", href: routes.faq },
		],
	},
	{
		title: "Company",
		titleFa: "شرکت",
		links: [
			{ label: "About Us", labelFa: "درباره ما", href: routes.about },
			{ label: "Blog", labelFa: "بلاگ", href: "/blog" },
		],
	},
];

const socialLinks = [
	{ icon: <Instagram />, href: "https://instagram.com", label: "Instagram" },
	{ icon: <Twitter />, href: "https://twitter.com", label: "Twitter" },
	{ icon: <Facebook />, href: "https://facebook.com", label: "Facebook" },
	{ icon: <YouTube />, href: "https://youtube.com", label: "YouTube" },
];

export function PremiumLiquidGlassFooter() {
	const { language, setLanguage } = useLanguage();

	const toggleLanguage = () => {
		setLanguage(language === "fa" ? "en" : "fa");
	};

	const glassLinkStyle = {
		color: "rgba(255, 255, 255, 0.7)",
		textDecoration: "none",
		fontSize: { xs: "0.8125rem", sm: "0.875rem" },
		fontWeight: 400,
		display: "inline-block",
		position: "relative",
		padding: { xs: "3px 0", sm: "4px 0" },
		transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
		"&::after": {
			content: '""',
			position: "absolute",
			bottom: 0,
			left: 0,
			width: 0,
			height: "1px",
			background: `linear-gradient(90deg, ${liquidGlassColors.persianGold}, transparent)`,
			transition: "width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
		},
		"&:hover": {
			color: "#FFFFFF",
			transform: "translateX(4px)",
			"&::after": {
				width: "100%",
			},
		},
	};

	const glassIconStyle = {
		width: 40,
		height: 40,
		position: "relative",
		overflow: "hidden",
		background: liquidGlassColors.glass.base,
		border: `1px solid ${liquidGlassColors.glass.border}`,
		backdropFilter: "blur(10px)",
		transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
		"&::before": {
			content: '""',
			position: "absolute",
			top: 0,
			left: 0,
			width: "100%",
			height: "0%",
			background: `linear-gradient(180deg, ${liquidGlassColors.persianGold}40, ${liquidGlassColors.persianGold}20)`,
			transition: "height 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
		},
		"&:hover": {
			transform: "translateY(-4px) scale(1.05)",
			border: `1px solid ${liquidGlassColors.persianGold}40`,
			boxShadow: `0 8px 24px -4px ${liquidGlassColors.persianGold}30,
                  inset 0 1px 0 0 rgba(255, 255, 255, 0.1)`,
			"&::before": {
				height: "100%",
			},
		},
		"& svg": {
			position: "relative",
			zIndex: 1,
			color: "rgba(255, 255, 255, 0.7)",
			transition: "color 0.3s ease",
		},
		"&:hover svg": {
			color: "#FFFFFF",
		},
	};

	const languageToggleStyle = {
		px: 3,
		py: 1,
		borderRadius: "20px",
		background: `linear-gradient(135deg, ${liquidGlassColors.glass.strong}, ${liquidGlassColors.glass.mid})`,
		border: `1px solid ${liquidGlassColors.glass.border}`,
		backdropFilter: "blur(20px)",
		color: "#FFFFFF",
		fontSize: "0.875rem",
		fontWeight: 500,
		transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
		display: "flex",
		alignItems: "center",
		gap: 1,
		"&:hover": {
			background: `linear-gradient(135deg, ${liquidGlassColors.persianGold}30, ${liquidGlassColors.persianGold}20)`,
			border: `1px solid ${liquidGlassColors.persianGold}40`,
			transform: "translateY(-2px)",
			boxShadow: `0 8px 16px -4px ${liquidGlassColors.persianGold}30,
                  inset 0 1px 0 0 rgba(255, 255, 255, 0.1)`,
		},
	};

	return (
		<Box
			component="footer"
			sx={{
				position: "relative",
				mt: { xs: 4, sm: 6, md: 8 },
				pt: { xs: 4, sm: 6, md: 8 },
				pb: { xs: 3, md: 4 },
				px: { xs: 1, sm: 0 },
				overflow: "hidden",
			}}
		>
			{/* Persian Pattern Background */}
			<Box
				sx={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					opacity: 0.03,
					backgroundImage: `
            radial-gradient(circle at 25% 25%, ${liquidGlassColors.persianGold}40 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, ${liquidGlassColors.persianGold}40 0%, transparent 50%)
          `,
					backgroundSize: "100px 100px",
					pointerEvents: "none",
				}}
			/>

			{/* Decorative Persian Geometric Pattern */}
			<Box
				sx={{
					position: "absolute",
					top: 0,
					left: "50%",
					transform: "translateX(-50%)",
					width: "200px",
					height: "200px",
					opacity: 0.05,
					backgroundImage: `
            conic-gradient(
              from 0deg,
              ${liquidGlassColors.persianGold}00,
              ${liquidGlassColors.persianGold}40,
              ${liquidGlassColors.persianGold}00
            )
          `,
					borderRadius: "50%",
					filter: "blur(40px)",
					pointerEvents: "none",
				}}
			/>

			{/* Glass Top Border */}
			<Box
				sx={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					height: "1px",
					background: `linear-gradient(90deg, 
            transparent, 
            ${liquidGlassColors.glass.border}, 
            transparent)`,
				}}
			/>

			<Container maxWidth="xl">
				{/* Main Footer Content */}
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: {
							xs: "1fr",
							sm: "repeat(2, 1fr)",
							md: "2fr repeat(4, 1fr)",
						},
						gap: { xs: 3, sm: 4 },
						mb: { xs: 4, md: 6 },
					}}
				>
					{/* Brand Section - Persian Calligraphy */}
					<Box sx={{ textAlign: { xs: "center", md: "start" } }}>
						<Box sx={{ mb: 3 }}>
							{/* Logo with Persian Touch */}
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									gap: 2,
									mb: 2,
									justifyContent: { xs: "center", md: "flex-start" },
								}}
							>
								<Box
									sx={{
										width: { xs: 40, sm: 48 },
										height: { xs: 40, sm: 48 },
										borderRadius: { xs: "10px", sm: "12px" },
										background: `linear-gradient(135deg, 
                      ${liquidGlassColors.persianGold}40, 
                      ${liquidGlassColors.persianGold}20)`,
										backdropFilter: "blur(10px)",
										border: `1px solid ${liquidGlassColors.persianGold}60`,
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										fontWeight: 700,
										fontSize: { xs: "1.25rem", sm: "1.5rem" },
										color: liquidGlassColors.persianGold,
										boxShadow: `0 4px 16px -2px ${liquidGlassColors.persianGold}30,
                                inset 0 1px 0 0 rgba(255, 255, 255, 0.2)`,
										fontFamily: language === "fa" ? "Vazirmatn" : "inherit",
									}}
								>
									Ir{" "}
								</Box>
								<Box>
									<Typography
										sx={{
											fontSize: { xs: "1.25rem", sm: "1.5rem" },
											fontWeight: 700,
											color: "#FFFFFF",
											letterSpacing: "-0.02em",
											fontFamily: language === "fa" ? "Vazirmatn" : "inherit",
										}}
									>
										{language === "fa" ? "ایران دانلود" : "irdnl"}
									</Typography>
									<Typography
										sx={{
											fontSize: { xs: "0.6875rem", sm: "0.75rem" },
											color: "rgba(255, 255, 255, 0.5)",
											fontFamily: language === "fa" ? "Vazirmatn" : "inherit",
										}}
									>
										{language === "fa"
											? "سرگرمی ایرانی و بین‌المللی"
											: "Persian & International Entertainment"}
									</Typography>
								</Box>
							</Box>

							{/* Language Switcher */}
							<Box
								sx={{
									display: "flex",
									justifyContent: { xs: "center", md: "flex-start" },
								}}
							>
								<Box
									component="button"
									onClick={toggleLanguage}
									sx={languageToggleStyle}
								>
									<LanguageIcon sx={{ fontSize: "1.125rem" }} />
									{language === "fa" ? "English" : "فارسی"}
								</Box>
							</Box>
						</Box>
					</Box>

					{/* Footer Links Sections */}
					{footerSections.map((section, index) => (
						<Box key={index}>
							<Typography
								sx={{
									fontSize: { xs: "0.8125rem", sm: "0.875rem" },
									fontWeight: 600,
									color: "#FFFFFF",
									mb: { xs: 1.5, sm: 2 },
									letterSpacing: "0.05em",
									textTransform: "uppercase",
									fontFamily: language === "fa" ? "Vazirmatn" : "inherit",
								}}
							>
								{language === "fa" ? section.titleFa : section.title}
							</Typography>
							<Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 1, sm: 1.5 } }}>
								{section.links.map((link, linkIndex) => (
									<Link
										key={linkIndex}
										href={link.href}
										style={{ textDecoration: "none" }}
									>
										<Box
											component="span"
											sx={{
												...glassLinkStyle,
												fontFamily: language === "fa" ? "Vazirmatn" : "inherit",
											}}
										>
											{language === "fa" ? link.labelFa : link.label}
										</Box>
									</Link>
								))}
							</Box>
						</Box>
					))}
				</Box>

				{/* Social Media Icons */}
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						gap: { xs: 1.5, sm: 2 },
						mb: { xs: 3, md: 4 },
						py: { xs: 3, md: 4 },
						borderTop: `1px solid ${liquidGlassColors.glass.border}`,
						borderBottom: `1px solid ${liquidGlassColors.glass.border}`,
					}}
				>
					{socialLinks.map((social, index) => (
						<MuiLink
							key={index}
							href={social.href}
							target="_blank"
							rel="noopener noreferrer"
							sx={{ textDecoration: "none" }}
						>
							<IconButton
								sx={{
									...glassIconStyle,
									width: { xs: 36, sm: 40 },
									height: { xs: 36, sm: 40 },
								}}
								aria-label={social.label}
							>
								{social.icon}
							</IconButton>
						</MuiLink>
					))}
				</Box>

				{/* Copyright & Legal */}
				<Box
					sx={{
						display: "flex",
						flexDirection: { xs: "column", md: "row" },
						justifyContent: "space-between",
						alignItems: "center",
						gap: { xs: 1.5, md: 2 },
						pt: { xs: 2, md: 3 },
					}}
				>
					<Typography
						sx={{
							fontSize: { xs: "0.6875rem", sm: "0.75rem" },
							color: "rgba(255, 255, 255, 0.5)",
							fontFamily: language === "fa" ? "Vazirmatn" : "inherit",
							textAlign: { xs: "center", md: "left" },
						}}
					>
						{language === "fa"
							? `© ${new Date().getFullYear()} ایران دانلود. تمام حقوق محفوظ است.`
							: `© ${new Date().getFullYear()} irdnl. All rights reserved.`}
					</Typography>

					<Box
						sx={{
							display: "flex",
							gap: 3,
							flexWrap: "wrap",
							justifyContent: "center",
						}}
					>
					</Box>
				</Box>

				{/* Decorative Persian Quote/Motto (Optional) */}
				<Box
					sx={{
						mt: { xs: 3, md: 4 },
						pt: { xs: 2, md: 3 },
						borderTop: `1px solid ${liquidGlassColors.glass.border}`,
						textAlign: "center",
					}}
				>
					<Typography
						sx={{
							fontSize: { xs: "0.8125rem", sm: "0.875rem" },
							color: "rgba(255, 255, 255, 0.3)",
							fontStyle: "italic",
							fontFamily: language === "fa" ? "Vazirmatn" : "serif",
							letterSpacing: language === "fa" ? "normal" : "0.05em",
						}}
					>
						{language === "fa"
							? "« هنر برای جهان، جهان برای هنر »"
							: "« Art for the World, World for Art »"}
					</Typography>
				</Box>
			</Container>

			{/* Bottom Gradient Fade */}
			<Box
				sx={{
					position: "absolute",
					bottom: 0,
					left: 0,
					right: 0,
					height: "100px",
					background: `linear-gradient(180deg, transparent, ${liquidGlassColors.deepMidnight}40)`,
					pointerEvents: "none",
				}}
			/>
		</Box>
	);
}
