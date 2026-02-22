"use client";

import ContactMailIcon from "@mui/icons-material/ContactMail";
import EmailIcon from "@mui/icons-material/Email";
import InstagramIcon from "@mui/icons-material/Instagram";
import SendIcon from "@mui/icons-material/Send";
import TelegramIcon from "@mui/icons-material/Telegram";
import TwitterIcon from "@mui/icons-material/Twitter";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import { Alert, Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, Snackbar, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useLanguage } from "@/providers/language-provider";
import { useIsAuthenticated } from "@/store/auth";
import { userApi } from "@/lib/api/user";
import { EmojiPicker } from "@/components/ui/EmojiPicker";
import Link from "next/link";
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
			category: "Category",
			send: "Send as Ticket",
			sending: "Sending...",
			success: "Ticket created successfully!",
			successDetail: "Your ticket has been submitted. You can track it from your profile.",
			viewTickets: "View My Tickets",
			loginRequired: "Please login to submit a ticket",
			loginBtn: "Login",
			error: "Failed to send. Please try again.",
		},
		categories: {
			general: "General",
			technical: "Technical",
			billing: "Billing",
			content: "Content",
			account: "Account",
			other: "Other",
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
			category: "دسته‌بندی",
			send: "ارسال تیکت",
			sending: "در حال ارسال...",
			success: "تیکت با موفقیت ثبت شد!",
			successDetail: "تیکت شما ثبت شده است. می‌توانید از پروفایل خود آن را پیگیری کنید.",
			viewTickets: "مشاهده تیکت‌ها",
			loginRequired: "برای ثبت تیکت لطفاً وارد حساب کاربری شوید",
			loginBtn: "ورود",
			error: "خطا در ارسال. لطفاً دوباره تلاش کنید.",
		},
		categories: {
			general: "عمومی",
			technical: "فنی",
			billing: "مالی",
			content: "محتوا",
			account: "حساب کاربری",
			other: "سایر",
		},
		social: "با ما در ارتباط باشید",
		support: "پشتیبانی",
		supportText: "برای مشکلات فنی و کمک حساب کاربری",
		business: "کسب‌وکار",
		businessText: "درخواست‌های همکاری و تبلیغات",
	},
};

const socialLinks = [
	// {
	// 	icon: TelegramIcon,
	// 	label: "Telegram",
	// 	href: "https://t.me/irdnl",
	// 	color: "#0088CC",
	// },
	// {
	// 	icon: InstagramIcon,
	// 	label: "Instagram",
	// 	href: "https://instagram.com/irdnl",
	// 	color: "#E4405F",
	// },
	// {
	// 	icon: TwitterIcon,
	// 	label: "Twitter",
	// 	href: "https://twitter.com/irdnl",
	// 	color: "#1DA1F2",
	// },
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
	const isAuthenticated = useIsAuthenticated();

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
		category: "general" as "general" | "technical" | "billing" | "content" | "account" | "other",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

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
		if (!isAuthenticated) return;
		setIsSubmitting(true);
		try {
			await userApi.createTicket({
				subject: formData.subject,
				message: `${formData.name ? `نام: ${formData.name}\n` : ""}${formData.email ? `ایمیل: ${formData.email}\n\n` : ""}${formData.message}`,
				category: formData.category,
				priority: "medium",
			});
			setSubmitted(true);
			setFormData({ name: "", email: "", subject: "", message: "", category: "general" });
			setFeedback({ type: "success", message: t.form.success });
		} catch (error) {
			console.error("Failed to create ticket:", error);
			setFeedback({ type: "error", message: t.form.error });
		} finally {
			setIsSubmitting(false);
		}
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
								<ConfirmationNumberIcon sx={{ fontSize: 48, color: "#22C55E", mb: 2 }} />
								<Typography
									variant="h5"
									sx={{ color: "#22C55E", fontWeight: 600, mb: 1 }}
								>
									✓ {t.form.success}
								</Typography>
								<Typography sx={{ color: glassColors.text.secondary, mb: 3, fontSize: "0.9rem" }}>
									{t.form.successDetail}
								</Typography>
								<Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
									<Button
										component={Link}
										href="/user/tickets"
										sx={{
											borderRadius: glassBorderRadius.lg,
											background: `linear-gradient(135deg, ${glassColors.persianGold}, ${glassColors.persianGold}CC)`,
											color: "#000",
											fontWeight: 600,
											textTransform: "none",
											px: 3,
											py: 1,
										}}
									>
										{t.form.viewTickets}
									</Button>
									<Button
										onClick={() => setSubmitted(false)}
										sx={{
											borderRadius: glassBorderRadius.lg,
											background: glassColors.glass.base,
											border: `1px solid ${glassColors.glass.border}`,
											color: glassColors.text.primary,
											textTransform: "none",
											px: 3,
											py: 1,
										}}
									>
										{t.form.send}
									</Button>
								</Box>
							</Box>
						) : !isAuthenticated ? (
							<Box sx={{ textAlign: "center", py: 4 }}>
								<Typography sx={{ color: glassColors.text.secondary, mb: 2 }}>
									{t.form.loginRequired}
								</Typography>
								<Button
									component={Link}
									href="/auth/login"
									sx={{
										borderRadius: glassBorderRadius.lg,
										background: `linear-gradient(135deg, ${glassColors.persianGold}, ${glassColors.persianGold}CC)`,
										color: "#000",
										fontWeight: 600,
										textTransform: "none",
										px: 4,
										py: 1,
									}}
								>
									{t.form.loginBtn}
								</Button>
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
								<Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: -1 }}>
									<EmojiPicker onEmojiSelect={(emoji) => setFormData((prev) => ({ ...prev, message: prev.message + emoji }))} />
									<Typography sx={{ color: glassColors.text.muted, fontSize: "0.7rem" }}>
										افزودن ایموجی
									</Typography>
								</Box>
								<FormControl fullWidth sx={glassInputSx}>
									<InputLabel>{t.form.category}</InputLabel>
									<Select
										value={formData.category}
										label={t.form.category}
										onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
									>
										<MenuItem value="general">{t.categories.general}</MenuItem>
										<MenuItem value="technical">{t.categories.technical}</MenuItem>
										<MenuItem value="billing">{t.categories.billing}</MenuItem>
										<MenuItem value="content">{t.categories.content}</MenuItem>
										<MenuItem value="account">{t.categories.account}</MenuItem>
										<MenuItem value="other">{t.categories.other}</MenuItem>
									</Select>
								</FormControl>
								<Button
									type="submit"
									disabled={isSubmitting}
									startIcon={<SendIcon className="ml-4"/>}
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
								<Typography sx={{ color: glassColors.text.muted, fontSize: "0.75rem", mt: -1 }}>
									پیام شما به صورت تیکت پشتیبانی ثبت خواهد شد
								</Typography>
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
										startIcon={<Icon className="ml-4"/>}
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

			{/* Toast Notification */}
			<Snackbar
				open={!!feedback}
				autoHideDuration={4000}
				onClose={() => setFeedback(null)}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			>
				<Alert
					onClose={() => setFeedback(null)}
					severity={feedback?.type === "success" ? "success" : "error"}
					variant="filled"
					sx={{ width: "100%" }}
				>
					{feedback?.message}
				</Alert>
			</Snackbar>
		</Box>
	);
}
