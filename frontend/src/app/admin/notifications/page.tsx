"use client";

import { Bell, Mail, Send, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/admin/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/admin/ui/card";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/admin/ui/table";
import { Snackbar, Alert } from "@mui/material";
import { notificationsApi } from "@/lib/api/admin";
import { useTranslation } from "@/i18n";

export default function NotificationsPage() {
	const { t } = useTranslation();
	const [notifications, setNotifications] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [sending, setSending] = useState(false);
	const [formData, setFormData] = useState({
		title: "",
		message: "",
		type: "push" as "push" | "email",
		userId: "",
	});
	const [feedback, setFeedback] = useState<{
		type: "success" | "error";
		message: string;
	} | null>(null);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const fetchNotifications = async () => {
		setLoading(true);
		try {
			const response = await notificationsApi.list();
			setNotifications(response.data || []);
		} catch (error) {
			console.error("Failed to fetch notifications:", error);
			showFeedback("error", t("admin.notifications.fetchFailed"));
		} finally {
			setLoading(false);
		}
	};

	const showFeedback = (type: "success" | "error", message: string) => {
		setFeedback({ type, message });
	};

	useEffect(() => {
		fetchNotifications();
	}, []);

	const handleSend = async (e: React.FormEvent) => {
		e.preventDefault();
		setSending(true);
		try {
			const payload: { title: string; message: string; type: "push" | "email"; userId?: string } = {
				title: formData.title,
				message: formData.message,
				type: formData.type,
			};
			if (formData.userId.trim()) {
				payload.userId = formData.userId.trim();
			}
			await notificationsApi.create(payload);
			setFormData({ title: "", message: "", type: "push", userId: "" });
			fetchNotifications();
			showFeedback("success", t("admin.notifications.sendSuccess"));
		} catch (error) {
			console.error("Failed to send notification:", error);
			showFeedback("error", t("admin.notifications.sendFailed"));
		} finally {
			setSending(false);
		}
	};

	const handleDelete = async (id: string) => {
		if (deletingId) return;
		setDeletingId(id);
		try {
			await notificationsApi.delete(id);
			showFeedback("success", "اعلان با موفقیت حذف شد");
			fetchNotifications();
		} catch (error) {
			console.error("Failed to delete notification:", error);
			showFeedback("error", "خطا در حذف اعلان");
		} finally {
			setDeletingId(null);
		}
	};

	return (
		<div className="space-y-4 sm:space-y-6">
			<div>
				<h1 className="text-xl sm:text-3xl font-bold text-gray-900">{t("admin.notifications.title")}</h1>
				<p className="text-sm text-gray-600">{t("admin.notifications.description")}</p>
			</div>

			<div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>{t("admin.notifications.sendNotification")}</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSend} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="title">{t("admin.notifications.notificationTitle")}</Label>
								<Input
									id="title"
									value={formData.title}
									onChange={(e) =>
										setFormData({ ...formData, title: e.target.value })
									}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="message">{t("admin.notifications.message")}</Label>
								<textarea
									id="message"
									value={formData.message}
									onChange={(e) =>
										setFormData({ ...formData, message: e.target.value })
									}
									className="w-full rounded-md border border-gray-300 px-3 py-2"
									rows={4}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="type">{t("admin.notifications.type")}</Label>
								<select
									id="type"
									value={formData.type}
									onChange={(e) =>
										setFormData({
											...formData,
											type: e.target.value as "push" | "email",
										})
									}
									className="w-full rounded-md border border-gray-300 px-3 py-2"
								>
									<option value="push">{t("admin.notifications.pushNotification")}</option>
									<option value="email">{t("admin.notifications.email")}</option>
								</select>
							</div>
							<div className="space-y-2">
								<Label htmlFor="userId">{t("admin.notifications.userId")}</Label>
								<Input
									id="userId"
									value={formData.userId}
									onChange={(e) =>
										setFormData({ ...formData, userId: e.target.value })
									}
									placeholder={t("admin.notifications.userIdPlaceholder")}
								/>
							</div>
							<Button type="submit" className="w-full" disabled={sending}>
								<Send className="mr-2 h-4 w-4" />
								{sending ? t("admin.notifications.sending") : t("admin.notifications.sendNotificationBtn")}
							</Button>
						</form>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>{t("admin.notifications.notificationHistory")}</CardTitle>
					</CardHeader>
					<CardContent>
						{loading ? (
							<div className="p-6 text-center">{t("admin.messages.loading")}</div>
						) : (
							<div className="space-y-2">
								{notifications.length === 0 ? (
									<p className="text-center text-gray-500">
										{t("admin.notifications.noNotifications")}
									</p>
								) : (
									notifications.slice(0, 10).map((notification) => (
										<div
											key={notification.id}
											className="flex items-start gap-3 rounded-lg border border-gray-200 p-3"
										>
											{notification.type === "push" ? (
												<Bell className="h-5 w-5 text-blue-600" />
											) : (
												<Mail className="h-5 w-5 text-green-600" />
											)}
											<div className="flex-1">
												<p className="font-medium">{notification.title}</p>
												<p className="text-sm text-gray-600">
													{notification.message}
												</p>
												<p className="mt-1 text-xs text-gray-500">
													{t("admin.notifications.sentAt")}: {new Date(notification.createdAt).toLocaleString()}
												</p>
												<p className="text-xs text-gray-500">
													{t("admin.notifications.sentTo")}: {notification.userId || t("admin.notifications.allUsers")}
												</p>
											</div>
											<button
												onClick={() => handleDelete(notification.id)}
												disabled={deletingId === notification.id}
												className="shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
												title="حذف اعلان"
											>
												<Trash2 className="h-4 w-4" />
											</button>
										</div>
									))
								)}
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Toast Notification */}
			<Snackbar
				open={!!feedback}
				autoHideDuration={3000}
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
		</div>
	);
}
