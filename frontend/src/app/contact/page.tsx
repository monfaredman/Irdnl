"use client";

import ContactMailIcon from "@mui/icons-material/ContactMail";
import EmailIcon from "@mui/icons-material/Email";
import InstagramIcon from "@mui/icons-material/Instagram";
import SendIcon from "@mui/icons-material/Send";
import TelegramIcon from "@mui/icons-material/Telegram";
import TwitterIcon from "@mui/icons-material/Twitter";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useLanguage } from "@/providers/language-provider";
import {
	glassBlur,
	glassBorderRadius,
	glassColors,
} from "@/theme/glass-design-system";

const translations = {
	en: {
		title: "Contact Us",
		subtitle: "We'd love to hear from you",
		form: {
			name: "Your Name",
			email: "Email Address",
			subject: "Subject",
			message: "Your Message",
			send: "Send Message",
			sending: "Sending...",
			success: "Message sent successfully!",
		},
		social: "Connect With Us",
		support: "Support",
		supportText: "For technical issues and account help",
		business: "Business",
		businessText: "Partnership and advertising inquiries",
	},
	fa: {
		title: "تماس با ما",
		subtitle: "خوشحال می‌شویم از شما بشنویم",
		form: {
			name: "نام شما",
			email: "آدرس ایمیل",
			subject: "موضوع",
			message: "پیام شما",
			send: "ارسال پیام",
			sending: "در حال ارسال...",
			success: "پیام با موفقیت ارسال شد!",
		},
		social: "با ما در ارتباط باشید",
		support: "پشتیبانی",
		supportText: "برای مشکلات فنی و کمک حساب کاربری",
		business: "کسب‌وکار",
		businessText: "درخواست‌های همکاری و تبلیغات",
	},
};

const socialLinks = [
	{
		icon: TelegramIcon,
		label: "Telegram",
		href: "https://t.me/irdnl",
		color: "#0088CC",
	},
	{
		icon: InstagramIcon,
		label: "Instagram",
		href: "https://instagram.com/irdnl",
		color: "#E4405F",
	},
	{
		icon: TwitterIcon,
		label: "Twitter",
		href: "https://twitter.com/irdnl",
		color: "#1DA1F2",
	},
	{
		icon: EmailIcon,
		label: "support@irdnl.tv",
		href: "mailto:support@irdnl.tv",
		color: glassColors.persianGold,
	},
];

export default function ContactPage() {
	const { language } = useLanguage();
	const t = translations[language] || translations.en;

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState(false);

	const glassCardSx = {
		background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
		backdropFilter: `blur(${glassBlur.medium})`,
		border: `1px solid ${glassColors.glass.border}`,
		borderRadius: glassBorderRadius.xl,
		p: 4,
	};

	const glassInputSx = {
		"& .MuiOutlinedInput-root": {
			background: glassColors.glass.base,
			borderRadius: glassBorderRadius.lg,
			color: glassColors.text.primary,
			"& fieldset": { borderColor: glassColors.glass.border },
			"&:hover fieldset": { borderColor: `${glassColors.persianGold}60` },
			"&.Mui-focused fieldset": { borderColor: glassColors.persianGold },
		},
		"& .MuiInputLabel-root": {
			color: glassColors.text.tertiary,
			"&.Mui-focused": { color: glassColors.persianGold },
		},
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		// Simulate form submission
		await new Promise((resolve) => setTimeout(resolve, 1500));
		setIsSubmitting(false);
		setSubmitted(true);
		setFormData({ name: "", email: "", subject: "", message: "" });
	};

	return (
		<Box sx={{ minHeight: "100vh", py: 4 }}>
			{/* Header */}
			<Box
				sx={{
					...glassCardSx,
					mb: 4,
					display: "flex",
					alignItems: "center",
					gap: 3,
				}}
			>
				<Box
					sx={{
						width: 64,
						height: 64,
						borderRadius: glassBorderRadius.lg,
						background: `linear-gradient(135deg, ${glassColors.persianGold}, ${glassColors.persianGold}80)`,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<ContactMailIcon sx={{ fontSize: "2rem", color: "#000" }} />
				</Box>
				<Box>
					<Typography
						variant="h3"
						sx={{ color: glassColors.text.primary, fontWeight: 800, mb: 0.5 }}
					>
						{t.title}
					</Typography>
					<Typography sx={{ color: glassColors.text.tertiary }}>
						{t.subtitle}
					</Typography>
				</Box>
			</Box>

			<Grid container spacing={4}>
				{/* Contact Form */}
				<Grid size={{ xs: 12, md: 7 }}>
					<Box component="form" onSubmit={handleSubmit} sx={glassCardSx}>
						{submitted ? (
							<Box sx={{ textAlign: "center", py: 4 }}>
								<Typography
									variant="h5"
									sx={{ color: "#22C55E", fontWeight: 600, mb: 2 }}
								>
									✓ {t.form.success}
								</Typography>
							</Box>
						) : (
							<Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
								<Grid container spacing={2}>
									<Grid size={{ xs: 12, sm: 6 }}>
										<TextField
											label={t.form.name}
											value={formData.name}
											onChange={(e) =>
												setFormData({ ...formData, name: e.target.value })
											}
											fullWidth
											required
											sx={glassInputSx}
										/>
									</Grid>
									<Grid size={{ xs: 12, sm: 6 }}>
										<TextField
											label={t.form.email}
											type="email"
											value={formData.email}
											onChange={(e) =>
												setFormData({ ...formData, email: e.target.value })
											}
											fullWidth
											required
											sx={glassInputSx}
										/>
									</Grid>
								</Grid>
								<TextField
									label={t.form.subject}
									value={formData.subject}
									onChange={(e) =>
										setFormData({ ...formData, subject: e.target.value })
									}
									fullWidth
									required
									sx={glassInputSx}
								/>
								<TextField
									label={t.form.message}
									value={formData.message}
									onChange={(e) =>
										setFormData({ ...formData, message: e.target.value })
									}
									multiline
									rows={5}
									fullWidth
									required
									sx={glassInputSx}
								/>
								<Button
									type="submit"
									disabled={isSubmitting}
									endIcon={<SendIcon />}
									sx={{
										py: 1.5,
										borderRadius: glassBorderRadius.lg,
										background: `linear-gradient(135deg, ${glassColors.persianGold}, ${glassColors.persianGold}CC)`,
										color: "#000",
										fontWeight: 600,
										textTransform: "none",
										fontSize: "1rem",
										alignSelf: "flex-start",
										px: 4,
										"&:hover": {
											background: `linear-gradient(135deg, ${glassColors.persianGold}CC, ${glassColors.persianGold})`,
										},
										"&:disabled": {
											background: glassColors.glass.mid,
											color: glassColors.text.tertiary,
										},
									}}
								>
									{isSubmitting ? t.form.sending : t.form.send}
								</Button>
							</Box>
						)}
					</Box>
				</Grid>

				{/* Social & Info */}
				<Grid size={{ xs: 12, md: 5 }}>
					{/* Social Links */}
					<Box sx={{ ...glassCardSx, mb: 3 }}>
						<Typography
							variant="h6"
							sx={{ color: glassColors.text.primary, fontWeight: 600, mb: 3 }}
						>
							{t.social}
						</Typography>
						<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
							{socialLinks.map((social) => {
								const Icon = social.icon;
								return (
									<Button
										key={social.label}
										href={social.href}
										target="_blank"
										startIcon={<Icon />}
										sx={{
											justifyContent: "flex-start",
											borderRadius: glassBorderRadius.lg,
											background: glassColors.glass.base,
											border: `1px solid ${glassColors.glass.border}`,
											color: glassColors.text.primary,
											textTransform: "none",
											py: 1.5,
											px: 2,
											"& .MuiButton-startIcon": { color: social.color },
											"&:hover": {
												borderColor: social.color,
												background: `${social.color}10`,
											},
										}}
									>
										{social.label}
									</Button>
								);
							})}
						</Box>
					</Box>

					{/* Support Info */}
					<Box sx={glassCardSx}>
						<Box sx={{ mb: 3 }}>
							<Typography
								sx={{ color: glassColors.persianGold, fontWeight: 600, mb: 1 }}
							>
								{t.support}
							</Typography>
							<Typography
								sx={{ color: glassColors.text.tertiary, fontSize: "0.9rem" }}
							>
								{t.supportText}
							</Typography>
							<Typography sx={{ color: glassColors.text.secondary, mt: 1 }}>
								support@irdnl.tv
							</Typography>
						</Box>
						<Box>
							<Typography
								sx={{ color: glassColors.persianGold, fontWeight: 600, mb: 1 }}
							>
								{t.business}
							</Typography>
							<Typography
								sx={{ color: glassColors.text.tertiary, fontSize: "0.9rem" }}
							>
								{t.businessText}
							</Typography>
							<Typography sx={{ color: glassColors.text.secondary, mt: 1 }}>
								business@irdnl.tv
							</Typography>
						</Box>
					</Box>
				</Grid>
			</Grid>
		</Box>
	);
}
