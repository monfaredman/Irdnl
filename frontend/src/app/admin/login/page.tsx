"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/admin/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/admin/ui/card";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { authApi } from "@/lib/api/admin";
import { useAdminAuth } from "@/store/admin-auth";
import { useTranslation } from "@/i18n";

export default function AdminLoginPage() {
	const router = useRouter();
	const { setAuth } = useAdminAuth();
	const { t } = useTranslation();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const response = await authApi.login(email, password);
			setAuth(response.user, response.access_token, response.refresh_token);
			router.push("/admin/dashboard");
		} catch (err: any) {
			setError(
				err.response?.data?.message || t("admin.login.loginFailed"),
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50" dir="rtl">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-2xl">{t("admin.login.title")}</CardTitle>
					<CardDescription>
						{t("admin.login.description")}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">{t("admin.login.email")}</Label>
							<Input
								id="email"
								type="email"
								placeholder={t("admin.login.emailPlaceholder")}
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">{t("admin.login.password")}</Label>
							<Input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
						{error && (
							<div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
								{error}
							</div>
						)}
						<Button type="submit" className="w-full" disabled={loading}>
							{loading ? t("admin.login.loggingIn") : t("admin.login.loginButton")}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
