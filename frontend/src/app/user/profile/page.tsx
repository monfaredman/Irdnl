"use client";

import CameraAltIcon from "@mui/icons-material/CameraAlt";
import EditIcon from "@mui/icons-material/Edit";
import VerifiedIcon from "@mui/icons-material/Verified";
import {
	Avatar,
	Box,
	Button,
	Chip,
	CircularProgress,
	Grid,
	IconButton,
	Snackbar,
	TextField,
	Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useLanguage } from "@/providers/language-provider";
import {
	glassBlur,
	glassBorderRadius,
	glassColors,
} from "@/theme/glass-design-system";
import { userApi, type UserProfile } from "@/lib/api/user";
import { useIsAuthenticated } from "@/store/auth";

const translations = {
	en: {
		profile: "Profile",
		personalInfo: "Personal Information",
		fullName: "Full Name",
		email: "Email",
		phone: "Phone Number",
		birthDate: "Birth Date",
		saveChanges: "Save Changes",
		editProfile: "Edit Profile",
		verified: "Verified",
		memberSince: "Member since",
		totalWatched: "Total Watched",
		favoriteGenre: "Favorite Genre",
		watchlistCount: "Watchlist",
		movies: "movies",
		items: "items",
		action: "Action",
	},
	fa: {
		profile: "پروفایل",
		personalInfo: "اطلاعات شخصی",
		fullName: "نام و نام خانوادگی",
		email: "ایمیل",
		phone: "شماره موبایل",
		birthDate: "تاریخ تولد",
		saveChanges: "ذخیره تغییرات",
		editProfile: "ویرایش پروفایل",
		verified: "تأیید شده",
		memberSince: "عضویت از",
		totalWatched: "تماشا شده",
		favoriteGenre: "ژانر مورد علاقه",
		watchlistCount: "لیست تماشا",
		movies: "فیلم",
		items: "مورد",
		action: "اکشن",
	},
};

export default function ProfilePage() {
	const { language } = useLanguage();
	const isRTL = language === "fa";
	const t = translations[language] || translations.en;
	const isAuthenticated = useIsAuthenticated();

	const [isEditing, setIsEditing] = useState(false);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [snackbar, setSnackbar] = useState<string | null>(null);
	const [profile, setProfile] = useState<UserProfile | null>(null);
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		phone: "",
		birthDate: "",
	});
	const [watchlistCount, setWatchlistCount] = useState(0);
	const [historyCount, setHistoryCount] = useState(0);

	useEffect(() => {
		if (!isAuthenticated) return;
		const fetchProfile = async () => {
			try {
				setLoading(true);
				const [me, watchlist, history] = await Promise.all([
					userApi.getMe(),
					userApi.getWatchlist().catch(() => []),
					userApi.getWatchHistory().catch(() => []),
				]);
				setProfile(me);
				setFormData({
					fullName: me.name || "",
					email: me.email || "",
					phone: "",
					birthDate: "",
				});
				setWatchlistCount(Array.isArray(watchlist) ? watchlist.length : 0);
				setHistoryCount(Array.isArray(history) ? history.length : 0);
			} catch {
				// fallback
			} finally {
				setLoading(false);
			}
		};
		fetchProfile();
	}, [isAuthenticated]);

	const handleSave = async () => {
		setSaving(true);
		try {
			const updated = await userApi.updateMe({ name: formData.fullName });
			setProfile(updated);
			setIsEditing(false);
			setSnackbar(language === "fa" ? "پروفایل با موفقیت بروزرسانی شد" : "Profile updated successfully");
		} catch {
			setSnackbar(language === "fa" ? "خطا در بروزرسانی پروفایل" : "Failed to update profile");
		} finally {
			setSaving(false);
		}
	};

	const stats = [
		{ label: t.totalWatched, value: String(historyCount), unit: t.movies },
		{ label: t.favoriteGenre, value: t.action, unit: "" },
		{ label: t.watchlistCount, value: String(watchlistCount), unit: t.items },
	];

	const memberSinceDate = profile?.createdAt
		? new Date(profile.createdAt).toLocaleDateString(language === "fa" ? "fa-IR" : "en-US", {
				year: "numeric",
				month: "long",
			})
		: language === "fa" ? "---" : "---";

	const glassInputSx = {
		"& .MuiOutlinedInput-root": {
			background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
			backdropFilter: `blur(${glassBlur.medium})`,
			borderRadius: glassBorderRadius.lg,
			color: glassColors.text.primary,
			"&.Mui-disabled": {
				background: glassColors.glass.base,
				"& fieldset": {
					borderColor: "transparent",
				},
			},
			"& fieldset": {
				borderColor: glassColors.glass.border,
			},
			"&:hover fieldset": {
				borderColor: `${glassColors.persianGold}60`,
			},
			"&.Mui-focused fieldset": {
				borderColor: glassColors.persianGold,
			},
		},
		"& .MuiInputLabel-root": {
			color: glassColors.text.tertiary,
			"&.Mui-focused": {
				color: glassColors.persianGold,
			},
		},
	};

	if (loading) {
		return (
			<Box sx={{ maxWidth: 1000, mx: "auto", display: "flex", justifyContent: "center", py: 8 }}>
				<CircularProgress sx={{ color: glassColors.persianGold }} />
			</Box>
		);
	}

	return (
		<Box sx={{ maxWidth: 1000, mx: "auto" }}>
			{/* Header Card */}
			<Box
				sx={{
					background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
					backdropFilter: `blur(${glassBlur.medium})`,
					border: `1px solid ${glassColors.glass.border}`,
					borderRadius: glassBorderRadius.xl,
					p: 4,
					mb: 3,
					position: "relative",
					overflow: "hidden",
				}}
			>
				{/* Background Pattern */}
				<Box
					sx={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						opacity: 0.05,
						background: `radial-gradient(circle at 20% 50%, ${glassColors.persianGold} 0%, transparent 50%)`,
					}}
				/>

				<Box
					sx={{
						position: "relative",
						display: "flex",
						flexDirection: { xs: "column", sm: "row" },
						alignItems: { xs: "center", sm: "flex-start" },
						gap: 3,
					}}
				>
					{/* Avatar */}
					<Box sx={{ position: "relative" }}>
						<Avatar
							src={profile?.avatarUrl || undefined}
							sx={{
								width: 120,
								height: 120,
								background: `linear-gradient(135deg, ${glassColors.persianGold}, #D97706)`,
								fontSize: "3rem",
								fontWeight: 700,
								border: `4px solid ${glassColors.glass.border}`,
							}}
						>
							{profile?.name?.charAt(0)?.toUpperCase() || "U"}
						</Avatar>
						<IconButton
							sx={{
								position: "absolute",
								bottom: 0,
								right: 0,
								background: glassColors.persianGold,
								color: glassColors.black,
								width: 36,
								height: 36,
								"&:hover": {
									background: "#FBBF24",
								},
							}}
						>
							<CameraAltIcon fontSize="small" />
						</IconButton>
					</Box>

					{/* User Info */}
					<Box
						sx={{
							flex: 1,
							textAlign: { xs: "center", sm: isRTL ? "right" : "left" },
						}}
					>
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 1,
								justifyContent: { xs: "center", sm: "flex-start" },
							}}
						>
							<Typography
								variant="h4"
								sx={{ color: glassColors.text.primary, fontWeight: 700 }}
							>
								{formData.fullName}
							</Typography>
							<Chip
								icon={<VerifiedIcon sx={{ fontSize: "1rem" }} />}
								label={t.verified}
								size="small"
								sx={{
									background: "rgba(34, 197, 94, 0.1)",
									border: "1px solid rgba(34, 197, 94, 0.3)",
									color: "#22C55E",
									"& .MuiChip-icon": { color: "#22C55E" },
								}}
							/>
						</Box>
						<Typography sx={{ color: glassColors.text.secondary, mb: 2 }}>
							{formData.email}
						</Typography>
						<Typography
							sx={{ color: glassColors.text.tertiary, fontSize: "0.875rem" }}
						>
							{t.memberSince}: {memberSinceDate}
						</Typography>
					</Box>

					{/* Edit Button */}
					<Button
						startIcon={<EditIcon />}
						onClick={() => setIsEditing(!isEditing)}
						sx={{
							borderRadius: glassBorderRadius.lg,
							border: `1px solid ${glassColors.glass.border}`,
							color: glassColors.text.primary,
							px: 3,
							textTransform: "none",
							"&:hover": {
								border: `1px solid ${glassColors.persianGold}`,
								color: glassColors.persianGold,
							},
						}}
					>
						{t.editProfile}
					</Button>
				</Box>

				{/* Stats */}
				<Grid container spacing={2} sx={{ mt: 3 }}>
					{stats.map((stat, index) => (
						<Grid size={{ xs: 4 }} key={index}>
							<Box
								sx={{
									background: glassColors.glass.base,
									borderRadius: glassBorderRadius.lg,
									p: 2,
									textAlign: "center",
								}}
							>
								<Typography
									variant="h4"
									sx={{ color: glassColors.persianGold, fontWeight: 700 }}
								>
									{stat.value}
								</Typography>
								<Typography
									sx={{ color: glassColors.text.tertiary, fontSize: "0.75rem" }}
								>
									{stat.unit}
								</Typography>
								<Typography
									sx={{
										color: glassColors.text.secondary,
										fontSize: "0.875rem",
										mt: 0.5,
									}}
								>
									{stat.label}
								</Typography>
							</Box>
						</Grid>
					))}
				</Grid>
			</Box>

			{/* Personal Info Form */}
			<Box
				sx={{
					background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
					backdropFilter: `blur(${glassBlur.medium})`,
					border: `1px solid ${glassColors.glass.border}`,
					borderRadius: glassBorderRadius.xl,
					p: 4,
				}}
			>
				<Typography
					variant="h6"
					sx={{ color: glassColors.text.primary, fontWeight: 600, mb: 3 }}
				>
					{t.personalInfo}
				</Typography>

				<Grid container spacing={3}>
					<Grid size={{ xs: 12, sm: 6 }}>
						<TextField
							fullWidth
							label={t.fullName}
							value={formData.fullName}
							onChange={(e) =>
								setFormData({ ...formData, fullName: e.target.value })
							}
							disabled={!isEditing}
							sx={glassInputSx}
						/>
					</Grid>
					<Grid size={{ xs: 12, sm: 6 }}>
						<TextField
							fullWidth
							label={t.email}
							type="email"
							value={formData.email}
							onChange={(e) =>
								setFormData({ ...formData, email: e.target.value })
							}
							disabled={!isEditing}
							sx={glassInputSx}
						/>
					</Grid>
					<Grid size={{ xs: 12, sm: 6 }}>
						<TextField
							fullWidth
							label={t.phone}
							value={formData.phone}
							onChange={(e) =>
								setFormData({ ...formData, phone: e.target.value })
							}
							disabled={!isEditing}
							sx={glassInputSx}
						/>
					</Grid>
					<Grid size={{ xs: 12, sm: 6 }}>
						<TextField
							fullWidth
							label={t.birthDate}
							type="date"
							value={formData.birthDate}
							onChange={(e) =>
								setFormData({ ...formData, birthDate: e.target.value })
							}
							disabled={!isEditing}
							sx={glassInputSx}
							InputLabelProps={{ shrink: true }}
						/>
					</Grid>
				</Grid>

				{isEditing && (
					<Box
						sx={{ display: "flex", gap: 2, mt: 4, justifyContent: "flex-end" }}
					>
						<Button
							onClick={() => setIsEditing(false)}
							sx={{
								borderRadius: glassBorderRadius.lg,
								border: `1px solid ${glassColors.glass.border}`,
								color: glassColors.text.secondary,
								px: 4,
								textTransform: "none",
							}}
						>
							{language === "fa" ? "انصراف" : "Cancel"}
						</Button>
						<Button
							onClick={handleSave}
							disabled={saving}
							sx={{
								borderRadius: glassBorderRadius.lg,
								background: `linear-gradient(135deg, ${glassColors.persianGold}, #D97706)`,
								color: glassColors.black,
								px: 4,
								fontWeight: 600,
								textTransform: "none",
								"&:hover": {
									background: `linear-gradient(135deg, #FBBF24, ${glassColors.persianGold})`,
								},
							}}
						>
							{saving ? (language === "fa" ? "در حال ذخیره…" : "Saving…") : t.saveChanges}
						</Button>
					</Box>
				)}
			</Box>

			{/* Snackbar */}
			<Snackbar
				open={!!snackbar}
				autoHideDuration={3000}
				onClose={() => setSnackbar(null)}
				message={snackbar}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
				sx={{
					"& .MuiSnackbarContent-root": {
						background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
						backdropFilter: "blur(20px)",
						border: `1px solid ${glassColors.glass.border}`,
						borderRadius: glassBorderRadius.md,
						color: glassColors.text.primary,
						direction: "rtl",
					},
				}}
			/>
		</Box>
	);
}
