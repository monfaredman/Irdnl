"use client";

import DoneAllIcon from "@mui/icons-material/DoneAll";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import {
	Badge,
	Box,
	Button,
	Chip,
	CircularProgress,
	Divider,
	Pagination,
	Snackbar,
	Typography,
} from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/providers/language-provider";
import {
	glassAnimations,
	glassBlur,
	glassBorderRadius,
	glassColors,
} from "@/theme/glass-design-system";
import {
	userApi,
	type UserNotification,
	type UserNotificationsResponse,
} from "@/lib/api/user";

const translations = {
	en: {
		notifications: "Notifications",
		empty: "No notifications yet",
		emptyDesc: "You'll see notifications about your account and content here",
		markAllRead: "Mark all as read",
		unread: "unread",
		push: "Push",
		email: "Email",
		readSuccess: "Notification marked as read",
		allReadSuccess: "All notifications marked as read",
	},
	fa: {
		notifications: "اعلان‌ها",
		empty: "اعلانی وجود ندارد",
		emptyDesc: "اعلان‌های مربوط به حساب و محتوای شما اینجا نمایش داده می‌شود",
		markAllRead: "خواندن همه",
		unread: "خوانده‌نشده",
		push: "اعلان",
		email: "ایمیل",
		readSuccess: "اعلان به‌عنوان خوانده‌شده علامت‌گذاری شد",
		allReadSuccess: "همه اعلان‌ها خوانده شدند",
	},
};

export default function NotificationsPage() {
	const { language } = useLanguage();
	const isRTL = language === "fa";
	const t = translations[language] || translations.en;

	const [notifications, setNotifications] = useState<UserNotification[]>([]);
	const [total, setTotal] = useState(0);
	const [unreadCount, setUnreadCount] = useState(0);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(true);
	const [snackbar, setSnackbar] = useState<string | null>(null);

	const fetchNotifications = useCallback(async () => {
		try {
			setLoading(true);
			const res: UserNotificationsResponse =
				await userApi.getNotifications(page, 15);
			setNotifications(res.data || []);
			setTotal(res.total || 0);
			setUnreadCount(res.unreadCount || 0);
		} catch {
			setNotifications([]);
		} finally {
			setLoading(false);
		}
	}, [page]);

	useEffect(() => {
		fetchNotifications();
	}, [fetchNotifications]);

	const handleMarkRead = async (id: string) => {
		try {
			await userApi.markNotificationRead(id);
			setNotifications((prev) =>
				prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
			);
			setUnreadCount((c) => Math.max(0, c - 1));
			setSnackbar(t.readSuccess);
		} catch {
			/* ignore */
		}
	};

	const handleMarkAllRead = async () => {
		try {
			await userApi.markAllNotificationsRead();
			setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
			setUnreadCount(0);
			setSnackbar(t.allReadSuccess);
		} catch {
			/* ignore */
		}
	};

	const formatDate = (dateStr: string) => {
		const date = new Date(dateStr);
		return new Intl.DateTimeFormat(isRTL ? "fa-IR" : "en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		}).format(date);
	};

	const totalPages = Math.ceil(total / 15);

	return (
		<Box dir={isRTL ? "rtl" : "ltr"}>
			{/* Header */}
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					mb: 4,
				}}
			>
				<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
					<Typography
						variant="h4"
						sx={{
							fontWeight: 700,
							color: glassColors.text.primary,
						}}
					>
						{t.notifications}
					</Typography>
					{unreadCount > 0 && (
						<Chip
							label={`${unreadCount} ${t.unread}`}
							size="small"
							sx={{
								bgcolor: glassColors.gold.solid,
								color: "#fff",
								fontWeight: 600,
							}}
						/>
					)}
				</Box>
				{unreadCount > 0 && (
					<Button
						startIcon={<DoneAllIcon />}
						onClick={handleMarkAllRead}
						sx={{
							color: glassColors.gold.solid,
							textTransform: "none",
							fontWeight: 600,
						}}
					>
						{t.markAllRead}
					</Button>
				)}
			</Box>

			{/* Loading */}
			{loading && (
				<Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
					<CircularProgress sx={{ color: glassColors.gold.solid }} />
				</Box>
			)}

			{/* Empty */}
			{!loading && notifications.length === 0 && (
				<Box
					sx={{
						textAlign: "center",
						py: 10,
						background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
						backdropFilter: `blur(${glassBlur.medium})`,
						borderRadius: glassBorderRadius.lg,
						border: `1px solid ${glassColors.glass.border}`,
					}}
				>
					<NotificationsNoneIcon
						sx={{ fontSize: 64, color: glassColors.text.muted, mb: 2 }}
					/>
					<Typography
						variant="h6"
						sx={{ color: glassColors.text.primary, mb: 1 }}
					>
						{t.empty}
					</Typography>
					<Typography sx={{ color: glassColors.text.secondary }}>
						{t.emptyDesc}
					</Typography>
				</Box>
			)}

			{/* Notifications list */}
			{!loading && notifications.length > 0 && (
				<Box
					sx={{
						background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
						backdropFilter: `blur(${glassBlur.medium})`,
						borderRadius: glassBorderRadius.lg,
						border: `1px solid ${glassColors.glass.border}`,
						overflow: "hidden",
					}}
				>
					{notifications.map((notification, index) => (
						<Box key={notification.id}>
							<Box
								sx={{
									display: "flex",
									alignItems: "flex-start",
									gap: 2,
									p: 2.5,
									cursor: notification.isRead ? "default" : "pointer",
									bgcolor: notification.isRead
										? "transparent"
										: `${glassColors.gold.solid}08`,
									transition: `all ${glassAnimations.duration.normal} ${glassAnimations.smooth}`,
									"&:hover": {
										bgcolor: `${glassColors.gold.solid}12`,
									},
								}}
								onClick={() => {
									if (!notification.isRead) handleMarkRead(notification.id);
								}}
							>
								{/* Icon */}
								<Badge
									variant="dot"
									invisible={notification.isRead}
									sx={{
										"& .MuiBadge-dot": {
											bgcolor: glassColors.gold.solid,
											width: 10,
											height: 10,
										},
									}}
								>
									<Box
										sx={{
											width: 44,
											height: 44,
											borderRadius: "50%",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											bgcolor: notification.isRead
												? `${glassColors.text.muted}15`
												: `${glassColors.gold.solid}15`,
											flexShrink: 0,
										}}
									>
										{notification.isRead ? (
											<MarkEmailReadIcon
												sx={{
													color: glassColors.text.muted,
													fontSize: 22,
												}}
											/>
										) : (
											<NotificationsActiveIcon
												sx={{
													color: glassColors.gold.solid,
													fontSize: 22,
												}}
											/>
										)}
									</Box>
								</Badge>

								{/* Content */}
								<Box sx={{ flex: 1, minWidth: 0 }}>
									<Typography
										sx={{
											fontWeight: notification.isRead ? 400 : 700,
											color: glassColors.text.primary,
											fontSize: "0.95rem",
											mb: 0.5,
										}}
									>
										{notification.title}
									</Typography>
									<Typography
										sx={{
											color: glassColors.text.secondary,
											fontSize: "0.85rem",
											lineHeight: 1.5,
										}}
									>
										{notification.message}
									</Typography>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											gap: 1.5,
											mt: 1,
										}}
									>
										<Typography
											sx={{
												color: glassColors.text.muted,
												fontSize: "0.75rem",
											}}
										>
											{formatDate(notification.createdAt)}
										</Typography>
										<Chip
											label={
												notification.type === "push" ? t.push : t.email
											}
											size="small"
											sx={{
												height: 20,
												fontSize: "0.7rem",
												bgcolor: `${glassColors.text.muted}15`,
												color: glassColors.text.muted,
											}}
										/>
									</Box>
								</Box>
							</Box>
							{index < notifications.length - 1 && (
								<Divider
									sx={{
										borderColor: glassColors.glass.border,
										opacity: 0.5,
									}}
								/>
							)}
						</Box>
					))}
				</Box>
			)}

			{/* Pagination */}
			{totalPages > 1 && (
				<Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
					<Pagination
						count={totalPages}
						page={page}
						onChange={(_, value) => setPage(value)}
						sx={{
							"& .MuiPaginationItem-root": {
								color: glassColors.text.primary,
							},
							"& .Mui-selected": {
								bgcolor: `${glassColors.gold.solid} !important`,
								color: "#fff",
							},
						}}
					/>
				</Box>
			)}

			{/* Snackbar */}
			<Snackbar
				open={!!snackbar}
				autoHideDuration={3000}
				onClose={() => setSnackbar(null)}
				message={snackbar}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: isRTL ? "left" : "right",
				}}
			/>
		</Box>
	);
}
