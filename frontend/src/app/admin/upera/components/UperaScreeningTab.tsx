"use client";

import { useState } from "react";
import { Monitor, Play, Clock, CreditCard } from "lucide-react";
import { Button } from "@/components/admin/ui/button";
import {
	TextField,
	Alert,
	CircularProgress,
	Divider,
} from "@mui/material";
import { uperaApi } from "@/lib/api/admin";
import { useTranslation } from "@/i18n";

export function UperaScreeningTab() {
	const { t } = useTranslation();

	// Buy screening form
	const [buyForm, setBuyForm] = useState({
		movieId: "",
		paymentMethod: "saman3",
		mobile: "",
		callbackUrl: "",
	});

	// Watch form
	const [watchForm, setWatchForm] = useState({
		movieId: "",
		mobile: "",
		ip: "",
	});

	// Ekran info form
	const [ekranForm, setEkranForm] = useState({
		movieId: "",
		mobile: "",
	});

	const [loading, setLoading] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [result, setResult] = useState<any>(null);
	const [resultSection, setResultSection] = useState<string | null>(null);

	const handleBuyScreening = async () => {
		setLoading("buy");
		setError(null);
		try {
			const data = await uperaApi.homeScreeningBuy({
				cart: [{ id: buyForm.movieId }],
				paymentMethod: buyForm.paymentMethod,
				mobile: Number(buyForm.mobile),
				callbackUrl: buyForm.callbackUrl || undefined,
				ekran: true,
			});
			setResult(data);
			setResultSection("buy");
		} catch (err: any) {
			setError(err.response?.data?.message || err.message);
		} finally {
			setLoading(null);
		}
	};

	const handleWatch = async () => {
		setLoading("watch");
		setError(null);
		try {
			const data = await uperaApi.watchMovieHls(
				watchForm.movieId,
				Number(watchForm.mobile),
				undefined,
				watchForm.ip || undefined,
			);
			setResult(data);
			setResultSection("watch");
		} catch (err: any) {
			setError(err.response?.data?.message || err.message);
		} finally {
			setLoading(null);
		}
	};

	const handleCheckEkran = async () => {
		setLoading("ekran");
		setError(null);
		try {
			const data = await uperaApi.getEkranToken(
				ekranForm.movieId,
				ekranForm.mobile,
			);
			setResult(data);
			setResultSection("ekran");
		} catch (err: any) {
			setError(err.response?.data?.message || err.message);
		} finally {
			setLoading(null);
		}
	};

	return (
		<div className="space-y-8">
			<h2 className="text-lg font-semibold">{t("admin.upera.screening.title")}</h2>

			<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
				<p className="font-medium mb-2">راهنمای اکران خانگی:</p>
				<ul className="list-disc list-inside space-y-1 text-xs">
					<li>ابتدا با وارد کردن شناسه فیلم و شماره موبایل، سانس اکران را خریداری کنید</li>
					<li>پس از بازگشت از درگاه پرداخت، اطلاعات پرداخت به callback URL شما ارسال می‌شود</li>
					<li>لینک استریم را دریافت کنید - از لحظه دریافت، ۸ ساعت برای تماشا فرصت دارید</li>
					<li>وضعیت اکران (زمان باقی‌مانده و ...) را با بخش سوم بررسی کنید</li>
				</ul>
			</div>

			{error && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}

			{/* Section 1: Buy Screening */}
			<div className="border rounded-lg p-4 space-y-4">
				<h3 className="font-medium flex items-center gap-2">
					<CreditCard className="h-5 w-5 text-blue-600" />
					{t("admin.upera.screening.buy")}
				</h3>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<TextField
						size="small"
						label={t("admin.upera.screening.movieId")}
						value={buyForm.movieId}
						onChange={(e) => setBuyForm({ ...buyForm, movieId: e.target.value })}
						fullWidth
						placeholder="cedd9fe0-0d00-11e9-9ed9-..."
						helperText="شناسه فیلم در سیستم تورنادو"
					/>
					<TextField
						size="small"
						label={t("admin.upera.screening.mobile")}
						value={buyForm.mobile}
						onChange={(e) => setBuyForm({ ...buyForm, mobile: e.target.value })}
						fullWidth
						placeholder="9124572535"
					/>
					<TextField
						size="small"
						label="روش پرداخت"
						value={buyForm.paymentMethod}
						onChange={(e) => setBuyForm({ ...buyForm, paymentMethod: e.target.value })}
						fullWidth
					/>
					<TextField
						size="small"
						label="Callback URL"
						value={buyForm.callbackUrl}
						onChange={(e) => setBuyForm({ ...buyForm, callbackUrl: e.target.value })}
						fullWidth
						placeholder="https://example.com/callback"
						helperText="status, payment_id, ref_num, payment_uri ارسال می‌شود"
					/>
				</div>

				<Button onClick={handleBuyScreening} disabled={loading === "buy"}>
					{loading === "buy" ? <CircularProgress size={16} className="ml-2" /> : <CreditCard className="h-4 w-4 ml-2" />}
					{t("admin.upera.screening.buy")}
				</Button>

				{resultSection === "buy" && result && (
					<div className="bg-gray-50 p-4 rounded space-y-2">
						{result?.data?.pay_url && (
							<div className="flex items-center gap-2">
								<span className="text-sm font-medium">لینک پرداخت:</span>
								<a
									href={result.data.pay_url}
									target="_blank"
									rel="noopener noreferrer"
									className="text-sm text-blue-600 underline"
								>
									{result.data.pay_url}
								</a>
							</div>
						)}
						<pre className="text-xs overflow-auto max-h-48" dir="ltr">
							{JSON.stringify(result, null, 2)}
						</pre>
					</div>
				)}
			</div>

			<Divider />

			{/* Section 2: Watch (Get HLS Stream) */}
			<div className="border rounded-lg p-4 space-y-4">
				<h3 className="font-medium flex items-center gap-2">
					<Play className="h-5 w-5 text-green-600" />
					{t("admin.upera.screening.watch")}
				</h3>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<TextField
						size="small"
						label={t("admin.upera.screening.movieId")}
						value={watchForm.movieId}
						onChange={(e) => setWatchForm({ ...watchForm, movieId: e.target.value })}
						fullWidth
						placeholder="2e66e310-9811-11ea-84e4-..."
					/>
					<TextField
						size="small"
						label={t("admin.upera.screening.mobile")}
						value={watchForm.mobile}
						onChange={(e) => setWatchForm({ ...watchForm, mobile: e.target.value })}
						fullWidth
						placeholder="9124572535"
					/>
					<TextField
						size="small"
						label="IP کاربر"
						value={watchForm.ip}
						onChange={(e) => setWatchForm({ ...watchForm, ip: e.target.value })}
						fullWidth
						placeholder="برای محدود کردن استریم (اختیاری)"
					/>
				</div>

				<div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-xs text-yellow-800">
					⚠️ به محض دریافت پاسخ 200، سانس ۸ ساعته شروع می‌شود!
				</div>

				<Button onClick={handleWatch} disabled={loading === "watch"}>
					{loading === "watch" ? <CircularProgress size={16} className="ml-2" /> : <Play className="h-4 w-4 ml-2" />}
					{t("admin.upera.screening.watch")}
				</Button>

				{resultSection === "watch" && result && (
					<pre className="bg-gray-50 p-4 rounded text-xs overflow-auto max-h-64" dir="ltr">
						{JSON.stringify(result, null, 2)}
					</pre>
				)}
			</div>

			<Divider />

			{/* Section 3: Check Screening Status */}
			<div className="border rounded-lg p-4 space-y-4">
				<h3 className="font-medium flex items-center gap-2">
					<Clock className="h-5 w-5 text-purple-600" />
					{t("admin.upera.screening.checkScreening")}
				</h3>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<TextField
						size="small"
						label={t("admin.upera.screening.movieId")}
						value={ekranForm.movieId}
						onChange={(e) => setEkranForm({ ...ekranForm, movieId: e.target.value })}
						fullWidth
						placeholder="2e66e310-9811-11ea-84e4-..."
					/>
					<TextField
						size="small"
						label={t("admin.upera.screening.mobile")}
						value={ekranForm.mobile}
						onChange={(e) => setEkranForm({ ...ekranForm, mobile: e.target.value })}
						fullWidth
						placeholder="9124572535"
					/>
				</div>

				<Button onClick={handleCheckEkran} disabled={loading === "ekran"}>
					{loading === "ekran" ? <CircularProgress size={16} className="ml-2" /> : <Clock className="h-4 w-4 ml-2" />}
					{t("admin.upera.screening.checkScreening")}
				</Button>

				{resultSection === "ekran" && result && (
					<div className="bg-gray-50 p-4 rounded space-y-2">
						{result?.data?.screening && (
							<div className="space-y-1 text-sm">
								{result.data.screening.ekran_period_end && (
									<p><strong>پایان اکران سراسری:</strong> {result.data.screening.ekran_period_end}</p>
								)}
								{result.data.screening.ekran_hour && (
									<p><strong>مدت سانس:</strong> {result.data.screening.ekran_hour} ساعت</p>
								)}
								{result.data.screening.owned_period_end && (
									<p><strong>سانس شما:</strong> {result.data.screening.owned_period_end}</p>
								)}
							</div>
						)}
						<pre className="text-xs overflow-auto max-h-48" dir="ltr">
							{JSON.stringify(result, null, 2)}
						</pre>
					</div>
				)}
			</div>
		</div>
	);
}
