"use client";

import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import { Box, Divider, Typography } from "@mui/material";
import { useLanguage } from "@/providers/language-provider";
import {
	glassBlur,
	glassBorderRadius,
	glassColors,
} from "@/theme/glass-design-system";

const translations = {
	en: {
		title: "Privacy Policy",
		subtitle: "How we collect, use, and protect your information",
		lastUpdated: "Last updated",
		sections: [
			{
				title: "1. Information We Collect",
				content:
					"We collect information you provide directly (name, email, payment info), automatically collected data (device info, IP address, viewing history), and information from third parties (social media login data).",
			},
			{
				title: "2. How We Use Your Information",
				content:
					"We use your information to: provide and improve our services, personalize your experience and recommendations, process payments, communicate with you about your account, and comply with legal obligations.",
			},
			{
				title: "3. Information Sharing",
				content:
					"We do not sell your personal information. We may share data with: service providers who help us operate, legal authorities when required by law, and business partners with your consent.",
			},
			{
				title: "4. Cookies and Tracking",
				content:
					"We use cookies and similar technologies to remember your preferences, analyze site traffic, and personalize content. You can manage cookie preferences in your browser settings.",
			},
			{
				title: "5. Data Security",
				content:
					"We implement industry-standard security measures including encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure.",
			},
			{
				title: "6. Your Rights",
				content:
					"You have the right to: access your personal data, correct inaccurate information, delete your account and data, opt-out of marketing communications, and request data portability.",
			},
			{
				title: "7. Children's Privacy",
				content:
					"Our service is not directed to children under 13. If we learn we have collected information from a child under 13, we will delete it promptly. Parents can contact us for Kids Mode settings.",
			},
			{
				title: "8. Data Retention",
				content:
					"We retain your data as long as your account is active or as needed to provide services. After account deletion, we may retain some data for legal compliance and fraud prevention.",
			},
			{
				title: "9. International Transfers",
				content:
					"Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.",
			},
			{
				title: "10. Contact Us",
				content:
					"For privacy-related questions or to exercise your rights, contact our Data Protection Officer at privacy@irdnl.tv or through our Contact page.",
			},
		],
	},
	fa: {
		title: "حریم خصوصی",
		subtitle: "نحوه جمع‌آوری، استفاده و حفاظت از اطلاعات شما",
		lastUpdated: "آخرین به‌روزرسانی",
		sections: [
			{
				title: "۱. اطلاعاتی که جمع‌آوری می‌کنیم",
				content:
					"ما اطلاعاتی که مستقیماً ارائه می‌دهید (نام، ایمیل، اطلاعات پرداخت)، داده‌های جمع‌آوری شده خودکار (اطلاعات دستگاه، آدرس IP، سابقه تماشا) و اطلاعات از طریق اشخاص ثالث (داده‌های ورود شبکه‌های اجتماعی) را جمع‌آوری می‌کنیم.",
			},
			{
				title: "۲. نحوه استفاده از اطلاعات شما",
				content:
					"ما از اطلاعات شما برای: ارائه و بهبود خدمات، شخصی‌سازی تجربه و پیشنهادات، پردازش پرداخت‌ها، ارتباط با شما درباره حسابتان و رعایت تعهدات قانونی استفاده می‌کنیم.",
			},
			{
				title: "۳. اشتراک‌گذاری اطلاعات",
				content:
					"ما اطلاعات شخصی شما را نمی‌فروشیم. ممکن است داده‌ها را با: ارائه‌دهندگان خدمات که به ما کمک می‌کنند، مقامات قانونی در صورت نیاز قانونی، و شرکای تجاری با رضایت شما به اشتراک بگذاریم.",
			},
			{
				title: "۴. کوکی‌ها و ردیابی",
				content:
					"ما از کوکی‌ها و فناوری‌های مشابه برای به خاطر سپردن ترجیحات شما، تحلیل ترافیک سایت و شخصی‌سازی محتوا استفاده می‌کنیم. می‌توانید تنظیمات کوکی را در مرورگر خود مدیریت کنید.",
			},
			{
				title: "۵. امنیت داده‌ها",
				content:
					"ما اقدامات امنیتی استاندارد صنعت از جمله رمزگذاری، سرورهای امن و ممیزی‌های امنیتی منظم را پیاده‌سازی می‌کنیم. با این حال، هیچ روش انتقال از طریق اینترنت ۱۰۰٪ امن نیست.",
			},
			{
				title: "۶. حقوق شما",
				content:
					"شما حق دارید: به داده‌های شخصی خود دسترسی داشته باشید، اطلاعات نادرست را اصلاح کنید، حساب و داده‌های خود را حذف کنید، از ارتباطات بازاریابی انصراف دهید و درخواست انتقال داده کنید.",
			},
			{
				title: "۷. حریم خصوصی کودکان",
				content:
					"خدمات ما برای کودکان زیر ۱۳ سال طراحی نشده است. اگر متوجه شویم اطلاعاتی از کودک زیر ۱۳ سال جمع‌آوری کرده‌ایم، فوراً آن را حذف خواهیم کرد. والدین می‌توانند برای تنظیمات حالت کودک با ما تماس بگیرند.",
			},
			{
				title: "۸. نگهداری داده‌ها",
				content:
					"ما داده‌های شما را تا زمانی که حسابتان فعال است یا برای ارائه خدمات نیاز است نگه می‌داریم. پس از حذف حساب، ممکن است برخی داده‌ها را برای رعایت قانون و جلوگیری از تقلب نگه داریم.",
			},
			{
				title: "۹. انتقال‌های بین‌المللی",
				content:
					"اطلاعات شما ممکن است به کشورهایی غیر از کشور خودتان منتقل و پردازش شود. ما از حفاظت‌های مناسب برای چنین انتقالاتی اطمینان می‌یابیم.",
			},
			{
				title: "۱۰. تماس با ما",
				content:
					"برای سوالات مربوط به حریم خصوصی یا اعمال حقوق خود، با مسئول حفاظت از داده‌های ما در privacy@irdnl.tv یا از طریق صفحه تماس با ما ارتباط برقرار کنید.",
			},
		],
	},
};

export default function PrivacyPage() {
	const { language } = useLanguage();
	const t = translations[language] || translations.en;

	const glassCardSx = {
		background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
		backdropFilter: `blur(${glassBlur.medium})`,
		border: `1px solid ${glassColors.glass.border}`,
		borderRadius: glassBorderRadius.xl,
		p: 4,
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
					<PrivacyTipIcon sx={{ fontSize: "2rem", color: "#000" }} />
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

			{/* Last Updated */}
			<Typography sx={{ color: glassColors.text.tertiary, mb: 3 }}>
				{t.lastUpdated}: December 1, 2025
			</Typography>

			{/* Content */}
			<Box sx={glassCardSx}>
				{t.sections.map((section, index) => (
					<Box key={index}>
						<Typography
							variant="h6"
							sx={{
								color: glassColors.persianGold,
								fontWeight: 600,
								mb: 2,
							}}
						>
							{section.title}
						</Typography>
						<Typography
							sx={{
								color: glassColors.text.secondary,
								lineHeight: 1.8,
								mb: 3,
							}}
						>
							{section.content}
						</Typography>
						{index < t.sections.length - 1 && (
							<Divider sx={{ borderColor: glassColors.glass.border, mb: 3 }} />
						)}
					</Box>
				))}
			</Box>
		</Box>
	);
}
