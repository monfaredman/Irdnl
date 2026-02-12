"use client";

import { useState } from "react";
import { CreditCard, Link as LinkIcon, CheckCircle } from "lucide-react";
import { Button } from "@/components/admin/ui/button";
import {
	TextField,
	Select,
	MenuItem,
	InputLabel,
	FormControl,
	Alert,
	CircularProgress,
	Divider,
} from "@mui/material";
import { uperaApi } from "@/lib/api/admin";
import { useTranslation } from "@/i18n";

export function UperaPurchaseTab() {
	const { t } = useTranslation();

	// Payment URL form
	const [paymentForm, setPaymentForm] = useState({
		qualityId: "",
		episodeId: "",
		movieId: "",
		paymentMethod: "saman",
		mobile: "",
		callbackUrl: "",
	});

	// Get Link form
	const [linkForm, setLinkForm] = useState({
		id: "",
		type: "movie" as "movie" | "episode",
		mobile: "",
	});

	// Payment Callback form
	const [callbackForm, setCallbackForm] = useState({
		paymentId: "",
		refNum: "",
		checkItAgain: 0,
	});

	const [loading, setLoading] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [result, setResult] = useState<any>(null);
	const [resultSection, setResultSection] = useState<string | null>(null);

	const handleGetPaymentUrl = async () => {
		setLoading("payment");
		setError(null);
		try {
			const data = await uperaApi.getPaymentUrl({
				qualityId: Number(paymentForm.qualityId),
				episodeId: paymentForm.episodeId || undefined,
				movieId: paymentForm.movieId || undefined,
				paymentMethod: paymentForm.paymentMethod,
				mobile: paymentForm.mobile,
				callbackUrl: paymentForm.callbackUrl,
			});
			setResult(data);
			setResultSection("payment");
		} catch (err: any) {
			setError(err.response?.data?.message || err.message);
		} finally {
			setLoading(null);
		}
	};

	const handleGetLink = async () => {
		setLoading("link");
		setError(null);
		try {
			const data = await uperaApi.getLink({
				id: linkForm.id,
				type: linkForm.type,
				mobile: linkForm.mobile,
			});
			setResult(data);
			setResultSection("link");
		} catch (err: any) {
			setError(err.response?.data?.message || err.message);
		} finally {
			setLoading(null);
		}
	};

	const handlePaymentCallback = async () => {
		setLoading("callback");
		setError(null);
		try {
			const data = await uperaApi.paymentCallback({
				paymentId: callbackForm.paymentId,
				refNum: callbackForm.refNum,
				checkItAgain: callbackForm.checkItAgain,
			});
			setResult(data);
			setResultSection("callback");
		} catch (err: any) {
			setError(err.response?.data?.message || err.message);
		} finally {
			setLoading(null);
		}
	};

	return (
		<div className="space-y-8">
			<h2 className="text-lg font-semibold">{t("admin.upera.purchase.title")}</h2>

			{error && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}

			{/* Section 1: Get Payment URL */}
			<div className="border rounded-lg p-4 space-y-4">
				<h3 className="font-medium flex items-center gap-2">
					<CreditCard className="h-5 w-5 text-blue-600" />
					{t("admin.upera.purchase.getPaymentUrl")}
				</h3>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<TextField
						size="small"
						label={t("admin.upera.purchase.qualityId")}
						value={paymentForm.qualityId}
						onChange={(e) => setPaymentForm({ ...paymentForm, qualityId: e.target.value })}
						fullWidth
						placeholder="2930327"
					/>
					<TextField
						size="small"
						label={`${t("admin.upera.purchase.contentId")} (${t("admin.upera.purchase.movie")})`}
						value={paymentForm.movieId}
						onChange={(e) => setPaymentForm({ ...paymentForm, movieId: e.target.value })}
						fullWidth
						placeholder="642e0ac0-5852-11ee-b920-..."
					/>
					<TextField
						size="small"
						label={`${t("admin.upera.purchase.contentId")} (${t("admin.upera.purchase.episode")})`}
						value={paymentForm.episodeId}
						onChange={(e) => setPaymentForm({ ...paymentForm, episodeId: e.target.value })}
						fullWidth
						placeholder="(اختیاری)"
					/>
					<TextField
						size="small"
						label={t("admin.upera.purchase.paymentMethod")}
						value={paymentForm.paymentMethod}
						onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
						fullWidth
					/>
					<TextField
						size="small"
						label={t("admin.upera.purchase.mobile")}
						value={paymentForm.mobile}
						onChange={(e) => setPaymentForm({ ...paymentForm, mobile: e.target.value })}
						fullWidth
						placeholder="09124572535"
					/>
					<TextField
						size="small"
						label={t("admin.upera.purchase.callbackUrl")}
						value={paymentForm.callbackUrl}
						onChange={(e) => setPaymentForm({ ...paymentForm, callbackUrl: e.target.value })}
						fullWidth
						placeholder="https://example.com/callback"
					/>
				</div>

				<Button onClick={handleGetPaymentUrl} disabled={loading === "payment"}>
					{loading === "payment" ? <CircularProgress size={16} className="ml-2" /> : <CreditCard className="h-4 w-4 ml-2" />}
					{t("admin.upera.purchase.getPaymentUrl")}
				</Button>

				{resultSection === "payment" && result && (
					<pre className="bg-gray-50 p-4 rounded text-xs overflow-auto max-h-64" dir="ltr">
						{JSON.stringify(result, null, 2)}
					</pre>
				)}
			</div>

			<Divider />

			{/* Section 2: Get Download/Stream Link */}
			<div className="border rounded-lg p-4 space-y-4">
				<h3 className="font-medium flex items-center gap-2">
					<LinkIcon className="h-5 w-5 text-green-600" />
					{t("admin.upera.purchase.getLink")}
				</h3>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<TextField
						size="small"
						label={t("admin.upera.purchase.contentId")}
						value={linkForm.id}
						onChange={(e) => setLinkForm({ ...linkForm, id: e.target.value })}
						fullWidth
						placeholder="642e0ac0-5852-11ee-b920-..."
					/>
					<FormControl size="small" fullWidth>
						<InputLabel>{t("admin.upera.purchase.contentType")}</InputLabel>
						<Select
							value={linkForm.type}
							label={t("admin.upera.purchase.contentType")}
							onChange={(e) => setLinkForm({ ...linkForm, type: e.target.value as "movie" | "episode" })}
						>
							<MenuItem value="movie">{t("admin.upera.purchase.movie")}</MenuItem>
							<MenuItem value="episode">{t("admin.upera.purchase.episode")}</MenuItem>
						</Select>
					</FormControl>
					<TextField
						size="small"
						label={t("admin.upera.purchase.mobile")}
						value={linkForm.mobile}
						onChange={(e) => setLinkForm({ ...linkForm, mobile: e.target.value })}
						fullWidth
						placeholder="09124572535"
					/>
				</div>

				<Button onClick={handleGetLink} disabled={loading === "link"}>
					{loading === "link" ? <CircularProgress size={16} className="ml-2" /> : <LinkIcon className="h-4 w-4 ml-2" />}
					{t("admin.upera.purchase.getLink")}
				</Button>

				{resultSection === "link" && result && (
					<pre className="bg-gray-50 p-4 rounded text-xs overflow-auto max-h-64" dir="ltr">
						{JSON.stringify(result, null, 2)}
					</pre>
				)}
			</div>

			<Divider />

			{/* Section 3: Payment Callback */}
			<div className="border rounded-lg p-4 space-y-4">
				<h3 className="font-medium flex items-center gap-2">
					<CheckCircle className="h-5 w-5 text-purple-600" />
					{t("admin.upera.purchase.paymentCallback")}
				</h3>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<TextField
						size="small"
						label={t("admin.upera.purchase.paymentId")}
						value={callbackForm.paymentId}
						onChange={(e) => setCallbackForm({ ...callbackForm, paymentId: e.target.value })}
						fullWidth
						placeholder="49158fe4e3f944f4..."
					/>
					<TextField
						size="small"
						label={t("admin.upera.purchase.refNum")}
						value={callbackForm.refNum}
						onChange={(e) => setCallbackForm({ ...callbackForm, refNum: e.target.value })}
						fullWidth
					/>
					<FormControl size="small" fullWidth>
						<InputLabel>بررسی مجدد</InputLabel>
						<Select
							value={callbackForm.checkItAgain}
							label="بررسی مجدد"
							onChange={(e) => setCallbackForm({ ...callbackForm, checkItAgain: Number(e.target.value) })}
						>
							<MenuItem value={0}>بار اول</MenuItem>
							<MenuItem value={1}>بررسی مجدد</MenuItem>
						</Select>
					</FormControl>
				</div>

				<Button onClick={handlePaymentCallback} disabled={loading === "callback"}>
					{loading === "callback" ? <CircularProgress size={16} className="ml-2" /> : <CheckCircle className="h-4 w-4 ml-2" />}
					{t("admin.upera.purchase.paymentCallback")}
				</Button>

				{resultSection === "callback" && result && (
					<pre className="bg-gray-50 p-4 rounded text-xs overflow-auto max-h-64" dir="ltr">
						{JSON.stringify(result, null, 2)}
					</pre>
				)}
			</div>
		</div>
	);
}
