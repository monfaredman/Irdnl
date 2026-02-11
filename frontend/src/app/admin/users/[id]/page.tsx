"use client";

import { ArrowRight, Mail, Shield, Calendar, Clock, Film, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/admin/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/admin/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/admin/ui/table";
import { usersApi } from "@/lib/api/admin";
import { useTranslation } from "@/i18n";

export default function UserDetailPage() {
	const { t } = useTranslation();
	const params = useParams();
	const id = params.id as string;
	const [user, setUser] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUser = async () => {
			setLoading(true);
			try {
				const data = await usersApi.get(id);
				setUser(data);
			} catch (error) {
				console.error("Failed to fetch user:", error);
			} finally {
				setLoading(false);
			}
		};
		if (id) fetchUser();
	}, [id]);

	if (loading) {
		return (
			<div className="flex items-center justify-center p-12">
				<div className="text-lg text-gray-500">{t("admin.messages.loading")}</div>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="flex flex-col items-center justify-center gap-4 p-12">
				<div className="text-lg text-gray-500">{t("admin.messages.noData")}</div>
				<Link href="/admin/users">
					<Button variant="outline">
						<ArrowRight className="ml-2 h-4 w-4" />
						{t("admin.users.backToUsers")}
					</Button>
				</Link>
			</div>
		);
	}

	const subscriptions = user.subscriptions || [];
	const watchHistory = user.watchHistory || [];

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center gap-4">
				<Link href="/admin/users">
					<Button variant="outline" size="sm">
						<ArrowRight className="h-4 w-4" />
					</Button>
				</Link>
				<div>
					<h1 className="text-3xl font-bold text-gray-900">
						{t("admin.users.userDetail")}
					</h1>
					<p className="text-gray-600">{user.name || user.email}</p>
				</div>
			</div>

			{/* User Info Card */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<UserIcon className="h-5 w-5" />
						{t("admin.users.userDetail")}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid gap-6 md:grid-cols-2">
						<div className="space-y-4">
							<div className="flex items-center gap-3">
								<UserIcon className="h-4 w-4 text-gray-400" />
								<div>
									<div className="text-sm text-gray-500">{t("admin.users.name")}</div>
									<div className="font-medium">{user.name || "-"}</div>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<Mail className="h-4 w-4 text-gray-400" />
								<div>
									<div className="text-sm text-gray-500">{t("admin.users.email")}</div>
									<div className="font-medium">{user.email}</div>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<Shield className="h-4 w-4 text-gray-400" />
								<div>
									<div className="text-sm text-gray-500">{t("admin.users.role")}</div>
									<div className="font-medium capitalize">{user.role}</div>
								</div>
							</div>
						</div>
						<div className="space-y-4">
							<div className="flex items-center gap-3">
								<div
									className={`h-3 w-3 rounded-full ${user.isActive ? "bg-green-500" : "bg-red-500"}`}
								/>
								<div>
									<div className="text-sm text-gray-500">{t("admin.users.status")}</div>
									<div className="font-medium">
										{user.isActive ? t("admin.users.active") : t("admin.users.blocked")}
									</div>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<Calendar className="h-4 w-4 text-gray-400" />
								<div>
									<div className="text-sm text-gray-500">{t("admin.users.joinDate")}</div>
									<div className="font-medium">
										{user.createdAt
											? new Date(user.createdAt).toLocaleDateString("fa-IR")
											: "-"}
									</div>
								</div>
							</div>
							{user.lastLoginAt && (
								<div className="flex items-center gap-3">
									<Clock className="h-4 w-4 text-gray-400" />
									<div>
										<div className="text-sm text-gray-500">{t("admin.users.lastLogin")}</div>
										<div className="font-medium">
											{new Date(user.lastLoginAt).toLocaleDateString("fa-IR")}
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Subscriptions */}
			<Card>
				<CardHeader>
					<CardTitle>{t("admin.users.subscriptions")}</CardTitle>
				</CardHeader>
				<CardContent>
					{subscriptions.length === 0 ? (
						<div className="py-8 text-center text-gray-500">
							{t("admin.users.noSubscriptions")}
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>{t("admin.users.plan")}</TableHead>
									<TableHead>{t("admin.users.startDate")}</TableHead>
									<TableHead>{t("admin.users.endDate")}</TableHead>
									<TableHead>{t("admin.users.subscriptionStatus")}</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{subscriptions.map((sub: any, idx: number) => (
									<TableRow key={sub.id || idx}>
										<TableCell className="font-medium">{sub.plan || sub.type || "-"}</TableCell>
										<TableCell>
											{sub.startDate
												? new Date(sub.startDate).toLocaleDateString("fa-IR")
												: "-"}
										</TableCell>
										<TableCell>
											{sub.endDate
												? new Date(sub.endDate).toLocaleDateString("fa-IR")
												: "-"}
										</TableCell>
										<TableCell>
											<span
												className={`rounded-full px-2 py-1 text-xs ${
													sub.isActive || sub.status === "active"
														? "bg-green-100 text-green-800"
														: "bg-gray-100 text-gray-800"
												}`}
											>
												{sub.isActive || sub.status === "active"
													? t("admin.users.active")
													: sub.status || "inactive"}
											</span>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>

			{/* Watch History */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Film className="h-5 w-5" />
						{t("admin.users.watchHistory")}
					</CardTitle>
				</CardHeader>
				<CardContent>
					{watchHistory.length === 0 ? (
						<div className="py-8 text-center text-gray-500">
							{t("admin.users.noWatchHistory")}
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>{t("admin.upload.basicInfo.title")}</TableHead>
									<TableHead>{t("admin.users.watchedAt")}</TableHead>
									<TableHead>{t("admin.users.progress")}</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{watchHistory.map((item: any, idx: number) => (
									<TableRow key={item.id || idx}>
										<TableCell className="font-medium">
											{item.content?.title || item.contentId || "-"}
										</TableCell>
										<TableCell>
											{item.watchedAt || item.updatedAt
												? new Date(item.watchedAt || item.updatedAt).toLocaleDateString("fa-IR")
												: "-"}
										</TableCell>
										<TableCell>
											{item.progress != null ? (
												<div className="flex items-center gap-2">
													<div className="h-2 w-24 rounded-full bg-gray-200">
														<div
															className="h-2 rounded-full bg-blue-600"
															style={{
																width: `${Math.min(100, Math.round((item.progress / (item.duration || 1)) * 100))}%`,
															}}
														/>
													</div>
													<span className="text-xs text-gray-500">
														{Math.round((item.progress / (item.duration || 1)) * 100)}%
													</span>
												</div>
											) : (
												"-"
											)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
