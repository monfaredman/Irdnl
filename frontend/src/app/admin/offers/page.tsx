"use client";

import { Edit, Plus, Trash2, Percent } from "lucide-react";
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
import {
	Snackbar,
	Alert,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button as MuiButton,
	TextField,
	Switch,
	FormControlLabel,
	Chip,
} from "@mui/material";
import { offersApi } from "@/lib/api/admin";

interface OfferItem {
	id: string;
	title: string;
	titleFa: string | null;
	description: string | null;
	descriptionFa: string | null;
	imageUrl: string | null;
	linkUrl: string | null;
	contentId: string | null;
	discountPercent: number | null;
	discountCode: string | null;
	originalPrice: number | null;
	offerPrice: number | null;
	isActive: boolean;
	sortOrder: number;
	startDate: string | null;
	endDate: string | null;
}

const emptyForm = {
	title: "",
	titleFa: "",
	description: "",
	descriptionFa: "",
	imageUrl: "",
	linkUrl: "",
	contentId: "",
	discountPercent: 0,
	discountCode: "",
	originalPrice: 0,
	offerPrice: 0,
	isActive: true,
	sortOrder: 0,
	startDate: "",
	endDate: "",
};

export default function OffersPage() {
	const [offers, setOffers] = useState<OfferItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [feedback, setFeedback] = useState<{
		type: "success" | "error";
		message: string;
	} | null>(null);
	const [confirmDialog, setConfirmDialog] = useState<{
		open: boolean;
		title: string;
		message: string;
		onConfirm: () => void;
	}>({ open: false, title: "", message: "", onConfirm: () => {} });

	const [formOpen, setFormOpen] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [form, setForm] = useState(emptyForm);

	const fetchOffers = async () => {
		setLoading(true);
		try {
			const res = await offersApi.list();
			setOffers(res.data || []);
		} catch {
			showFeedback("error", "خطا در دریافت پیشنهادها");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchOffers();
	}, []);

	const showFeedback = (type: "success" | "error", message: string) => {
		setFeedback({ type, message });
	};

	const showConfirm = (title: string, message: string, onConfirm: () => void) => {
		setConfirmDialog({ open: true, title, message, onConfirm });
	};

	const handleConfirmClose = (confirmed: boolean) => {
		if (confirmed) confirmDialog.onConfirm();
		setConfirmDialog({ open: false, title: "", message: "", onConfirm: () => {} });
	};

	const openCreateForm = () => {
		setEditingId(null);
		setForm(emptyForm);
		setFormOpen(true);
	};

	const openEditForm = (o: OfferItem) => {
		setEditingId(o.id);
		setForm({
			title: o.title,
			titleFa: o.titleFa || "",
			description: o.description || "",
			descriptionFa: o.descriptionFa || "",
			imageUrl: o.imageUrl || "",
			linkUrl: o.linkUrl || "",
			contentId: o.contentId || "",
			discountPercent: o.discountPercent || 0,
			discountCode: o.discountCode || "",
			originalPrice: o.originalPrice || 0,
			offerPrice: o.offerPrice || 0,
			isActive: o.isActive,
			sortOrder: o.sortOrder,
			startDate: o.startDate ? o.startDate.split("T")[0] : "",
			endDate: o.endDate ? o.endDate.split("T")[0] : "",
		});
		setFormOpen(true);
	};

	const handleSave = async () => {
		try {
			const payload: any = {
				...form,
				contentId: form.contentId || undefined,
				discountPercent: form.discountPercent || undefined,
				discountCode: form.discountCode || undefined,
				originalPrice: form.originalPrice || undefined,
				offerPrice: form.offerPrice || undefined,
				startDate: form.startDate || undefined,
				endDate: form.endDate || undefined,
			};
			if (editingId) {
				await offersApi.update(editingId, payload);
				showFeedback("success", "پیشنهاد با موفقیت ویرایش شد");
			} else {
				await offersApi.create(payload);
				showFeedback("success", "پیشنهاد با موفقیت ایجاد شد");
			}
			setFormOpen(false);
			fetchOffers();
		} catch (e: any) {
			showFeedback("error", e?.response?.data?.message || "خطا در ذخیره پیشنهاد");
		}
	};

	const handleDelete = (o: OfferItem) => {
		showConfirm("حذف پیشنهاد", `آیا از حذف "${o.titleFa || o.title}" مطمئن هستید؟`, async () => {
			try {
				await offersApi.delete(o.id);
				showFeedback("success", "پیشنهاد حذف شد");
				fetchOffers();
			} catch {
				showFeedback("error", "خطا در حذف پیشنهاد");
			}
		});
	};

	const handleToggleActive = async (o: OfferItem) => {
		try {
			await offersApi.update(o.id, { isActive: !o.isActive });
			fetchOffers();
		} catch {
			showFeedback("error", "خطا در تغییر وضعیت");
		}
	};

	const formatPrice = (price: number | null) => {
		if (!price) return "—";
		return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
	};

	return (
		<div className="space-y-4 sm:space-y-6">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
						<Percent className="h-5 w-5 sm:h-6 sm:w-6" />
						مدیریت پیشنهادها و تخفیف‌ها
					</h1>
					<p className="text-sm text-gray-500 mt-1">
						تخفیف‌ها، جشنواره‌ها و پیشنهادهای ویژه
					</p>
				</div>
				<Button onClick={openCreateForm}>
					<Plus className="ml-2 h-4 w-4" />
					افزودن پیشنهاد
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>پیشنهادها ({offers.length})</CardTitle>
				</CardHeader>
				<CardContent>
					{loading ? (
						<p className="text-center py-8 text-gray-500">در حال بارگذاری...</p>
					) : offers.length === 0 ? (
						<p className="text-center py-8 text-gray-500">پیشنهادی یافت نشد</p>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>ترتیب</TableHead>
									<TableHead>تصویر</TableHead>
									<TableHead>عنوان</TableHead>
									<TableHead>تخفیف</TableHead>
									<TableHead>کد</TableHead>
									<TableHead>قیمت اصلی</TableHead>
									<TableHead>قیمت ویژه</TableHead>
									<TableHead>بازه زمانی</TableHead>
									<TableHead>وضعیت</TableHead>
									<TableHead>عملیات</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{offers.map((o) => (
									<TableRow key={o.id}>
										<TableCell>{o.sortOrder}</TableCell>
										<TableCell>
											{o.imageUrl ? (
												<img
													src={o.imageUrl}
													alt={o.title}
													className="w-12 h-12 object-cover rounded"
												/>
											) : (
												<div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">
													—
												</div>
											)}
										</TableCell>
										<TableCell>
											<div>
												<p className="font-medium">{o.titleFa || o.title}</p>
												{o.titleFa && (
													<p className="text-xs text-gray-400">{o.title}</p>
												)}
											</div>
										</TableCell>
										<TableCell>
											{o.discountPercent ? (
												<Chip
													label={`${o.discountPercent}%`}
													size="small"
													color="error"
												/>
											) : (
												"—"
											)}
										</TableCell>
										<TableCell className="font-mono text-xs">
											{o.discountCode || "—"}
										</TableCell>
										<TableCell className="text-xs">
											{formatPrice(o.originalPrice)}
										</TableCell>
										<TableCell className="text-xs font-medium text-green-600">
											{formatPrice(o.offerPrice)}
										</TableCell>
										<TableCell className="text-xs">
											{o.startDate
												? new Date(o.startDate).toLocaleDateString("fa-IR")
												: "—"}
											{" ← "}
											{o.endDate
												? new Date(o.endDate).toLocaleDateString("fa-IR")
												: "—"}
										</TableCell>
										<TableCell>
											<Switch
												size="small"
												checked={o.isActive}
												onChange={() => handleToggleActive(o)}
											/>
										</TableCell>
										<TableCell>
											<div className="flex gap-1">
												<Button variant="ghost" size="sm" onClick={() => openEditForm(o)}>
													<Edit className="h-4 w-4" />
												</Button>
												<Button variant="ghost" size="sm" onClick={() => handleDelete(o)}>
													<Trash2 className="h-4 w-4 text-red-500" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>

			{/* Create/Edit Dialog */}
			<Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="md" fullWidth>
				<DialogTitle>{editingId ? "ویرایش پیشنهاد" : "افزودن پیشنهاد جدید"}</DialogTitle>
				<DialogContent>
					<div className="grid grid-cols-2 gap-4 mt-2">
						<TextField
							label="عنوان (انگلیسی)"
							value={form.title}
							onChange={(e) => setForm({ ...form, title: e.target.value })}
							fullWidth
							size="small"
						/>
						<TextField
							label="عنوان فارسی"
							value={form.titleFa}
							onChange={(e) => setForm({ ...form, titleFa: e.target.value })}
							fullWidth
							size="small"
						/>
						<TextField
							label="توضیح (انگلیسی)"
							value={form.description}
							onChange={(e) => setForm({ ...form, description: e.target.value })}
							fullWidth
							size="small"
							multiline
							rows={2}
						/>
						<TextField
							label="توضیح فارسی"
							value={form.descriptionFa}
							onChange={(e) => setForm({ ...form, descriptionFa: e.target.value })}
							fullWidth
							size="small"
							multiline
							rows={2}
						/>
						<TextField
							label="لینک تصویر"
							value={form.imageUrl}
							onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
							fullWidth
							size="small"
						/>
						<TextField
							label="لینک مقصد"
							value={form.linkUrl}
							onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
							fullWidth
							size="small"
						/>
						<TextField
							label="شناسه محتوا (Content ID)"
							value={form.contentId}
							onChange={(e) => setForm({ ...form, contentId: e.target.value })}
							fullWidth
							size="small"
							placeholder="UUID محتوای مرتبط"
						/>
						<TextField
							label="درصد تخفیف"
							type="number"
							value={form.discountPercent}
							onChange={(e) =>
								setForm({ ...form, discountPercent: parseInt(e.target.value) || 0 })
							}
							fullWidth
							size="small"
							inputProps={{ min: 0, max: 100 }}
						/>
						<TextField
							label="کد تخفیف"
							value={form.discountCode}
							onChange={(e) => setForm({ ...form, discountCode: e.target.value })}
							fullWidth
							size="small"
							placeholder="WINTER2026"
						/>
						<TextField
							label="قیمت اصلی (تومان)"
							type="number"
							value={form.originalPrice}
							onChange={(e) =>
								setForm({ ...form, originalPrice: parseInt(e.target.value) || 0 })
							}
							fullWidth
							size="small"
						/>
						<TextField
							label="قیمت ویژه (تومان)"
							type="number"
							value={form.offerPrice}
							onChange={(e) =>
								setForm({ ...form, offerPrice: parseInt(e.target.value) || 0 })
							}
							fullWidth
							size="small"
						/>
						<TextField
							label="ترتیب نمایش"
							type="number"
							value={form.sortOrder}
							onChange={(e) =>
								setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })
							}
							fullWidth
							size="small"
						/>
						<FormControlLabel
							control={
								<Switch
									checked={form.isActive}
									onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
								/>
							}
							label="فعال"
						/>
						<TextField
							label="تاریخ شروع"
							type="date"
							value={form.startDate}
							onChange={(e) => setForm({ ...form, startDate: e.target.value })}
							fullWidth
							size="small"
							InputLabelProps={{ shrink: true }}
						/>
						<TextField
							label="تاریخ پایان"
							type="date"
							value={form.endDate}
							onChange={(e) => setForm({ ...form, endDate: e.target.value })}
							fullWidth
							size="small"
							InputLabelProps={{ shrink: true }}
						/>
					</div>
				</DialogContent>
				<DialogActions>
					<MuiButton onClick={() => setFormOpen(false)}>انصراف</MuiButton>
					<MuiButton
						variant="contained"
						onClick={handleSave}
						disabled={!form.title}
					>
						{editingId ? "ذخیره تغییرات" : "ایجاد"}
					</MuiButton>
				</DialogActions>
			</Dialog>

			{/* Confirm Dialog */}
			<Dialog open={confirmDialog.open} onClose={() => handleConfirmClose(false)}>
				<DialogTitle>{confirmDialog.title}</DialogTitle>
				<DialogContent>
					<DialogContentText>{confirmDialog.message}</DialogContentText>
				</DialogContent>
				<DialogActions>
					<MuiButton onClick={() => handleConfirmClose(false)}>انصراف</MuiButton>
					<MuiButton onClick={() => handleConfirmClose(true)} color="error" variant="contained">
						حذف
					</MuiButton>
				</DialogActions>
			</Dialog>

			{/* Feedback Snackbar */}
			<Snackbar
				open={!!feedback}
				autoHideDuration={4000}
				onClose={() => setFeedback(null)}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			>
				{feedback ? (
					<Alert severity={feedback.type} variant="filled" onClose={() => setFeedback(null)}>
						{feedback.message}
					</Alert>
				) : undefined}
			</Snackbar>
		</div>
	);
}
