"use client";

import { useEffect, useState, useRef } from "react";
import { User, Lock, Save, Eye, EyeOff, CheckCircle, Camera } from "lucide-react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/admin/ui/card";
import { profileApi } from "@/lib/api/admin";
import { useAdminAuth } from "@/store/admin-auth";
import { useTranslation } from "@/i18n";

export default function AdminProfilePage() {
	const { t } = useTranslation();
	const { user, setAuth, accessToken, refreshToken } = useAdminAuth();
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Profile state
	const [name, setName] = useState(user?.name || "");
	const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "");
	const [avatarUploading, setAvatarUploading] = useState(false);
	const [profileLoading, setProfileLoading] = useState(false);
	const [profileSuccess, setProfileSuccess] = useState("");
	const [profileError, setProfileError] = useState("");

	// Password state
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [passwordLoading, setPasswordLoading] = useState(false);
	const [passwordSuccess, setPasswordSuccess] = useState("");
	const [passwordError, setPasswordError] = useState("");

	// Load fresh profile data on mount
	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const profile = await profileApi.getMe();
				setName(profile.name || "");
				setAvatarUrl(profile.avatarUrl || "");
			} catch {
				// Use local store data as fallback
			}
		};
		fetchProfile();
	}, []);

	const handleUpdateProfile = async (e: React.FormEvent) => {
		e.preventDefault();
		setProfileLoading(true);
		setProfileError("");
		setProfileSuccess("");

		try {
			const updated = await profileApi.updateMe({ name, avatarUrl: avatarUrl || undefined });
			// Update local store
			if (user && accessToken && refreshToken) {
				setAuth(
					{ ...user, name: updated.name, avatarUrl: updated.avatarUrl },
					accessToken,
					refreshToken,
				);
			}
			setProfileSuccess(t("admin.profile.updateSuccess"));
			setTimeout(() => setProfileSuccess(""), 3000);
		} catch (err: any) {
			setProfileError(
				err.response?.data?.message || t("admin.profile.updateFailed"),
			);
		} finally {
			setProfileLoading(false);
		}
	};

	const handleChangePassword = async (e: React.FormEvent) => {
		e.preventDefault();
		setPasswordError("");
		setPasswordSuccess("");

		if (newPassword.length < 6) {
			setPasswordError(t("admin.profile.passwordMinLength"));
			return;
		}

		if (newPassword !== confirmPassword) {
			setPasswordError(t("admin.profile.passwordMismatch"));
			return;
		}

		setPasswordLoading(true);

		try {
			await profileApi.changePassword({
				currentPassword,
				newPassword,
			});
			setPasswordSuccess(t("admin.profile.passwordSuccess"));
			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
			setTimeout(() => setPasswordSuccess(""), 3000);
		} catch (err: any) {
			setPasswordError(
				err.response?.data?.message || t("admin.profile.passwordFailed"),
			);
		} finally {
			setPasswordLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold text-gray-900">
					{t("admin.profile.title")}
				</h1>
				<p className="text-gray-600">{t("admin.profile.subtitle")}</p>
			</div>

			{/* Profile Info Section */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<User className="h-5 w-5" />
						{t("admin.profile.personalInfo")}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleUpdateProfile} className="space-y-4">
						{/* Avatar Preview with File Picker */}
						<div className="flex items-center gap-4">
							<div className="relative">
								<div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-white text-2xl font-bold overflow-hidden">
									{avatarUrl ? (
										<img
											src={avatarUrl}
											alt="Avatar"
											className="h-full w-full object-cover"
										/>
									) : (
										name?.charAt(0)?.toUpperCase() || "A"
									)}
								</div>
								<button
									type="button"
									onClick={() => fileInputRef.current?.click()}
									disabled={avatarUploading}
									className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg border-2 border-white disabled:opacity-50"
								>
									{avatarUploading ? (
										<span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
									) : (
										<Camera className="h-4 w-4" />
									)}
								</button>
								<input
									ref={fileInputRef}
									type="file"
									accept="image/*"
									className="hidden"
									onChange={async (e) => {
										const file = e.target.files?.[0];
										if (!file) return;
										setAvatarUploading(true);
										setProfileError("");
										try {
											const result = await profileApi.uploadAvatar(file);
											setAvatarUrl(result.url);
										} catch (err: any) {
											setProfileError(err.response?.data?.message || t("admin.messages.uploadError"));
										} finally {
											setAvatarUploading(false);
										}
									}}
								/>
							</div>
							<div>
								<p className="text-sm font-medium text-gray-900">
									{user?.email}
								</p>
								<p className="text-xs text-gray-500">
									{user?.role === "admin" ? t("admin.profile.roleAdmin") : user?.role}
								</p>
								<p className="text-xs text-gray-400 mt-1">
									{t("admin.profile.clickToChangeAvatar")}
								</p>
							</div>
						</div>

						{/* Name Field */}
						<div>
							<label
								htmlFor="name"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								{t("admin.profile.name")}
							</label>
							<input
								id="name"
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
								placeholder={t("admin.profile.namePlaceholder")}
							/>
						</div>

						{/* Success/Error Messages */}
						{profileSuccess && (
							<div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">
								<CheckCircle className="h-4 w-4" />
								{profileSuccess}
							</div>
						)}
						{profileError && (
							<div className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
								{profileError}
							</div>
						)}

						{/* Submit Button */}
						<button
							type="submit"
							disabled={profileLoading}
							className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
						>
							<Save className="h-4 w-4" />
							{profileLoading
								? t("admin.profile.saving")
								: t("admin.profile.saveChanges")}
						</button>
					</form>
				</CardContent>
			</Card>

			{/* Change Password Section */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Lock className="h-5 w-5" />
						{t("admin.profile.changePassword")}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleChangePassword} className="space-y-4">
						{/* Current Password */}
						<div>
							<label
								htmlFor="currentPassword"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								{t("admin.profile.currentPassword")}
							</label>
							<div className="relative">
								<input
									id="currentPassword"
									type={showCurrentPassword ? "text" : "password"}
									value={currentPassword}
									onChange={(e) => setCurrentPassword(e.target.value)}
									className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
									dir="ltr"
									required
								/>
								<button
									type="button"
									onClick={() => setShowCurrentPassword(!showCurrentPassword)}
									className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
								>
									{showCurrentPassword ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
								</button>
							</div>
						</div>

						{/* New Password */}
						<div>
							<label
								htmlFor="newPassword"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								{t("admin.profile.newPassword")}
							</label>
							<div className="relative">
								<input
									id="newPassword"
									type={showNewPassword ? "text" : "password"}
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
									className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
									dir="ltr"
									required
									minLength={6}
								/>
								<button
									type="button"
									onClick={() => setShowNewPassword(!showNewPassword)}
									className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
								>
									{showNewPassword ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
								</button>
							</div>
						</div>

						{/* Confirm Password */}
						<div>
							<label
								htmlFor="confirmPassword"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								{t("admin.profile.confirmPassword")}
							</label>
							<input
								id="confirmPassword"
								type="password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
								dir="ltr"
								required
								minLength={6}
							/>
						</div>

						{/* Success/Error Messages */}
						{passwordSuccess && (
							<div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">
								<CheckCircle className="h-4 w-4" />
								{passwordSuccess}
							</div>
						)}
						{passwordError && (
							<div className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
								{passwordError}
							</div>
						)}

						{/* Submit Button */}
						<button
							type="submit"
							disabled={passwordLoading}
							className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
						>
							<Lock className="h-4 w-4" />
							{passwordLoading
								? t("admin.profile.saving")
								: t("admin.profile.updatePassword")}
						</button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
