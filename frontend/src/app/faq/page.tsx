"use client";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpIcon from "@mui/icons-material/Help";
import SearchIcon from "@mui/icons-material/Search";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	InputAdornment,
	TextField,
	Typography,
} from "@mui/material";
import { useState } from "react";
import { useLanguage } from "@/providers/language-provider";
import {
	glassBlur,
	glassBorderRadius,
	glassColors,
} from "@/theme/glass-design-system";

const translations = {
	en: {
		title: "FAQ",
		subtitle: "Frequently Asked Questions",
		searchPlaceholder: "Search questions...",
		categories: {
			account: "Account & Subscription",
			streaming: "Streaming & Playback",
			content: "Content & Downloads",
			technical: "Technical Support",
		},
	},
	fa: {
		title: "سوالات متداول",
		subtitle: "پرسش‌های پرتکرار",
		searchPlaceholder: "جستجوی سوالات...",
		categories: {
			account: "حساب کاربری و اشتراک",
			streaming: "پخش و استریم",
			content: "محتوا و دانلود",
			technical: "پشتیبانی فنی",
		},
	},
};

const faqData = [
	{
		category: "account",
		questions: [
			{
				q: "How do I create an account?",
				qFa: "چگونه حساب کاربری ایجاد کنم؟",
				a: "Click the 'Sign Up' button on the top right corner of the page. Enter your email address, create a password, and follow the verification steps.",
				aFa: "روی دکمه 'ثبت‌نام' در گوشه بالا سمت راست صفحه کلیک کنید. آدرس ایمیل خود را وارد کنید، رمز عبور ایجاد کنید و مراحل تأیید را دنبال کنید.",
			},
			{
				q: "How do I cancel my subscription?",
				qFa: "چگونه اشتراک خود را لغو کنم؟",
				a: "Go to Account Settings > Subscription > Cancel Subscription. Your access will continue until the end of your current billing period.",
				aFa: "به تنظیمات حساب > اشتراک > لغو اشتراک بروید. دسترسی شما تا پایان دوره فعلی صورتحساب ادامه خواهد داشت.",
			},
			{
				q: "Can I share my account with family?",
				qFa: "آیا می‌توانم حسابم را با خانواده به اشتراک بگذارم؟",
				a: "Premium plans allow up to 4 simultaneous streams. You can create separate profiles for each family member.",
				aFa: "پلن‌های ویژه اجازه ۴ پخش همزمان را می‌دهند. می‌توانید برای هر عضو خانواده پروفایل جداگانه ایجاد کنید.",
			},
		],
	},
	{
		category: "streaming",
		questions: [
			{
				q: "What video quality is available?",
				qFa: "چه کیفیت ویدیویی در دسترس است؟",
				a: "We offer streaming from 480p up to 4K Ultra HD, depending on your subscription plan and internet connection.",
				aFa: "ما استریمینگ از 480p تا 4K Ultra HD را ارائه می‌دهیم، بسته به پلن اشتراک و اتصال اینترنت شما.",
			},
			{
				q: "Why is my video buffering?",
				qFa: "چرا ویدیوی من بافر می‌کند؟",
				a: "Buffering is usually caused by slow internet connection. Try lowering the video quality in settings, or check your network connection.",
				aFa: "بافرینگ معمولاً به دلیل اتصال اینترنت کند است. سعی کنید کیفیت ویدیو را در تنظیمات پایین بیاورید، یا اتصال شبکه خود را بررسی کنید.",
			},
			{
				q: "Can I watch on multiple devices?",
				qFa: "آیا می‌توانم روی چند دستگاه تماشا کنم؟",
				a: "Yes! Based on your plan: Basic (1 device), Standard (2 devices), Premium (4 devices) simultaneously.",
				aFa: "بله! بر اساس پلن شما: پایه (۱ دستگاه)، استاندارد (۲ دستگاه)، ویژه (۴ دستگاه) به صورت همزمان.",
			},
		],
	},
	{
		category: "content",
		questions: [
			{
				q: "How do I download content for offline viewing?",
				qFa: "چگونه محتوا را برای تماشای آفلاین دانلود کنم؟",
				a: "Open the movie or series, click the download button. Downloaded content is available in your Downloads section for 30 days.",
				aFa: "فیلم یا سریال را باز کنید، روی دکمه دانلود کلیک کنید. محتوای دانلود شده در بخش دانلودها برای ۳۰ روز در دسترس است.",
			},
			{
				q: "Are Persian subtitles available?",
				qFa: "آیا زیرنویس فارسی موجود است؟",
				a: "Yes, most of our content includes Persian subtitles. You can enable them from the subtitle settings while watching.",
				aFa: "بله، بیشتر محتوای ما شامل زیرنویس فارسی است. می‌توانید آن‌ها را از تنظیمات زیرنویس در حین تماشا فعال کنید.",
			},
			{
				q: "How often is new content added?",
				qFa: "چقدر محتوای جدید اضافه می‌شود؟",
				a: "We add new movies and series every week. Check the 'Coming Soon' section for upcoming releases.",
				aFa: "هر هفته فیلم‌ها و سریال‌های جدید اضافه می‌کنیم. بخش 'به‌زودی' را برای انتشارات آینده بررسی کنید.",
			},
		],
	},
	{
		category: "technical",
		questions: [
			{
				q: "What devices are supported?",
				qFa: "چه دستگاه‌هایی پشتیبانی می‌شوند؟",
				a: "We support web browsers, iOS, Android, Smart TVs (Samsung, LG, Sony), Apple TV, Android TV, and gaming consoles.",
				aFa: "ما از مرورگرهای وب، iOS، Android، تلویزیون‌های هوشمند (سامسونگ، ال‌جی، سونی)، Apple TV، Android TV و کنسول‌های بازی پشتیبانی می‌کنیم.",
			},
			{
				q: "How do I report a problem?",
				qFa: "چگونه مشکل را گزارش کنم؟",
				a: "Use the Contact Us page or email support@irdnl.tv. Include your device type and a description of the issue.",
				aFa: "از صفحه تماس با ما استفاده کنید یا به support@irdnl.tv ایمیل بزنید. نوع دستگاه و شرح مشکل را ذکر کنید.",
			},
			{
				q: "What internet speed do I need?",
				qFa: "به چه سرعت اینترنتی نیاز دارم؟",
				a: "Minimum 3 Mbps for SD, 5 Mbps for HD, 15 Mbps for Full HD, and 25 Mbps for 4K streaming.",
				aFa: "حداقل ۳ مگابیت برای SD، ۵ مگابیت برای HD، ۱۵ مگابیت برای Full HD و ۲۵ مگابیت برای استریم 4K.",
			},
		],
	},
];

export default function FAQPage() {
	const { language } = useLanguage();
	const t = translations[language] || translations.en;
	const [searchQuery, setSearchQuery] = useState("");
	const [expanded, setExpanded] = useState<string | false>(false);

	const glassCardSx = {
		background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
		backdropFilter: `blur(${glassBlur.medium})`,
		border: `1px solid ${glassColors.glass.border}`,
		borderRadius: glassBorderRadius.xl,
	};

	const handleChange =
		(panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
			setExpanded(isExpanded ? panel : false);
		};

	// Filter questions based on search
	const filteredFAQ = faqData
		.map((category) => ({
			...category,
			questions: category.questions.filter((q) => {
				const question = language === "fa" ? q.qFa : q.q;
				const answer = language === "fa" ? q.aFa : q.a;
				const query = searchQuery.toLowerCase();
				return (
					question.toLowerCase().includes(query) ||
					answer.toLowerCase().includes(query)
				);
			}),
		}))
		.filter((category) => category.questions.length > 0);

	return (
		<Box sx={{ minHeight: "100vh", py: 4 }}>
			{/* Header */}
			<Box
				sx={{
					...glassCardSx,
					p: 4,
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
					<HelpIcon sx={{ fontSize: "2rem", color: "#000" }} />
				</Box>
				<Box sx={{ flex: 1 }}>
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

			{/* Search */}
			<Box sx={{ mb: 4 }}>
				<TextField
					fullWidth
					placeholder={t.searchPlaceholder}
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<SearchIcon sx={{ color: glassColors.text.tertiary }} />
							</InputAdornment>
						),
					}}
					sx={{
						"& .MuiOutlinedInput-root": {
							background: glassColors.glass.strong,
							borderRadius: glassBorderRadius.xl,
							color: glassColors.text.primary,
							"& fieldset": { borderColor: glassColors.glass.border },
							"&:hover fieldset": {
								borderColor: `${glassColors.persianGold}60`,
							},
							"&.Mui-focused fieldset": {
								borderColor: glassColors.persianGold,
							},
						},
					}}
				/>
			</Box>

			{/* FAQ Categories */}
			{filteredFAQ.map((category) => (
				<Box key={category.category} sx={{ mb: 4 }}>
					<Typography
						variant="h5"
						sx={{
							color: glassColors.persianGold,
							fontWeight: 700,
							mb: 2,
						}}
					>
						{t.categories[category.category as keyof typeof t.categories]}
					</Typography>

					{category.questions.map((faq, index) => {
						const panelId = `${category.category}-${index}`;
						return (
							<Accordion
								key={panelId}
								expanded={expanded === panelId}
								onChange={handleChange(panelId)}
								sx={{
									...glassCardSx,
									mb: 1,
									"&:before": { display: "none" },
									"&.Mui-expanded": {
										margin: 0,
										mb: 1,
									},
								}}
							>
								<AccordionSummary
									expandIcon={
										<ExpandMoreIcon sx={{ color: glassColors.text.tertiary }} />
									}
									sx={{
										"& .MuiAccordionSummary-content": {
											my: 2,
										},
									}}
								>
									<Typography
										sx={{ color: glassColors.text.primary, fontWeight: 500 }}
									>
										{language === "fa" ? faq.qFa : faq.q}
									</Typography>
								</AccordionSummary>
								<AccordionDetails sx={{ pt: 0, pb: 3 }}>
									<Typography
										sx={{ color: glassColors.text.secondary, lineHeight: 1.8 }}
									>
										{language === "fa" ? faq.aFa : faq.a}
									</Typography>
								</AccordionDetails>
							</Accordion>
						);
					})}
				</Box>
			))}
		</Box>
	);
}
