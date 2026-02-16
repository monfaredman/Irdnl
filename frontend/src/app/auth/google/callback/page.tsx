"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { Box, CircularProgress, Typography } from "@mui/material";
import { glassColors } from "@/theme/glass-design-system";

export default function GoogleCallbackPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		try {
			const accessToken = searchParams.get("access_token");
			const refreshToken = searchParams.get("refresh_token");
			const userParam = searchParams.get("user");

			if (!accessToken || !refreshToken || !userParam) {
				setError("ورود با گوگل ناموفق بود. لطفاً دوباره تلاش کنید.");
				return;
			}

			const user = JSON.parse(userParam);

			// Store auth data
			const store = useAuthStore.getState();
			store.setAuth(user, accessToken, refreshToken);

			// Redirect to home
			router.push("/");
		} catch {
			setError("خطا در پردازش اطلاعات. لطفاً دوباره تلاش کنید.");
		}
	}, [searchParams, router]);

	if (error) {
		return (
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					minHeight: "60vh",
					gap: 2,
				}}
			>
				<Typography sx={{ color: "rgba(239, 68, 68, 0.8)", fontSize: "1rem" }}>
					{error}
				</Typography>
				<Typography
					component="a"
					href="/auth/login"
					sx={{
						color: glassColors.persianGold,
						textDecoration: "underline",
						cursor: "pointer",
					}}
				>
					بازگشت به صفحه ورود
				</Typography>
			</Box>
		);
	}

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				minHeight: "60vh",
				gap: 2,
			}}
		>
			<CircularProgress sx={{ color: glassColors.persianGold }} />
			<Typography sx={{ color: glassColors.text.secondary }} dir="rtl">
				در حال ورود با حساب گوگل…
			</Typography>
		</Box>
	);
}
