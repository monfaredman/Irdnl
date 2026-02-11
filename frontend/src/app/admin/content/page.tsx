"use client";

import { Edit, Plus, Trash2, Film, Tv, Image, MapPin, Gift, MoreVertical } from "lucide-react";
import Link from "next/link";
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
	Select,
	MenuItem,
	InputLabel,
	FormControl,
	Menu,
	ListItemIcon,
	ListItemText,
	IconButton,
} from "@mui/material";
import { contentApi, slidersApi, pinsApi, offersApi } from "@/lib/api/admin";
import { useTranslation } from "@/i18n";

export default function ContentManagementPage() {
	const { t } = useTranslation();
	const [content, setContent] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [total, setTotal] = useState(0);
	const [search, setSearch] = useState("");
	const [typeFilter, setTypeFilter] = useState("");
	const [statusFilter, setStatusFilter] = useState("");
	const [togglingId, setTogglingId] = useState<string | null>(null);
	const [feedback, setFeedback] = useState<{
		type: "success" | "error";
		message: string;
	} | null>(null);
	const [confirmDialog, setConfirmDialog] = useState<{
		open: boolean;
		title: string;
		message: string;
		onConfirm: () => void;
	}>({
		open: false,
		title: "",
		message: "",
		onConfirm: () => {},
	});

	// ── Action menu & quick-action dialogs state ──
	const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
	const [menuItem, setMenuItem] = useState<any>(null);

	// Slider dialog
	const [sliderDialog, setSliderDialog] = useState(false);
	const [sliderForm, setSliderForm] = useState({
		title: "",
		titleFa: "",
		imageUrl: "",
		section: "hero",
		sortOrder: 0,
	});

	// Pin dialog
	const [pinDialog, setPinDialog] = useState(false);
	const [pinForm, setPinForm] = useState({
		section: "hero",
		label: "",
		labelFa: "",
		sortOrder: 0,
	});

	// Offer dialog
	const [offerDialog, setOfferDialog] = useState(false);
	const [offerForm, setOfferForm] = useState({
		title: "",
		titleFa: "",
		discountPercent: 0,
		discountCode: "",
		linkUrl: "",
		sortOrder: 0,
	});

	const SLIDER_SECTIONS = [
		{ value: "hero", label: "اسلایدر اصلی (Hero)" },
		{ value: "banner1", label: "بنر ۱" },
		{ value: "banner2", label: "بنر ۲" },
		{ value: "promo", label: "تبلیغاتی" },
	];

	const PIN_SECTIONS = [
		{ value: "hero", label: "اسلایدر اصلی (Hero)" },
		{ value: "new-movies", label: "فیلم جدید" },
		{ value: "foreign-series", label: "سریال خارجی" },
		{ value: "iranian-series", label: "سریال ایرانی" },
		{ value: "dubbed", label: "دوبله فارسی" },
		{ value: "animation", label: "انیمیشن" },
		{ value: "trending", label: "پرطرفدار" },
		{ value: "widget-grid", label: "ویجت گرید" },
	];

	const fetchContent = async () => {
		setLoading(true);
		try {
			const params: any = { page, limit: 20 };
			if (search) params.search = search;
			if (typeFilter) params.type = typeFilter;
			if (statusFilter) params.status = statusFilter;
			const response = await contentApi.list(params);
			setContent(response.data || []);
			setTotal(response.total || 0);
		} catch (error) {
			console.error("Failed to fetch content:", error);
			showFeedback("error", t("admin.content.fetchFailed"));
		} finally {
			setLoading(false);
		}
	};

	const showFeedback = (type: "success" | "error", message: string) => {
		setFeedback({ type, message });
	};

	const showConfirm = (
		title: string,
		message: string,
		onConfirm: () => void,
	) => {
		setConfirmDialog({
			open: true,
			title,
			message,
			onConfirm,
		});
	};

	const handleConfirmClose = (confirmed: boolean) => {
		if (confirmed) {
			confirmDialog.onConfirm();
		}
		setConfirmDialog({
			open: false,
			title: "",
			message: "",
			onConfirm: () => {},
		});
	};

	useEffect(() => {
		fetchContent();
	}, [page, search, typeFilter, statusFilter]);

	const handleDelete = async (id: string) => {
		showConfirm(
			t("admin.content.title"),
			t("admin.messages.confirmDelete"),
			async () => {
				try {
					await contentApi.delete(id);
					showFeedback("success", t("admin.content.deleteSuccess"));
					fetchContent();
				} catch (error) {
					console.error("Failed to delete content:", error);
					showFeedback("error", t("admin.content.deleteFailed"));
				}
			},
		);
	};

	const handleToggleStatus = async (id: string, currentStatus: string) => {
		const newStatus = currentStatus === "published" ? "draft" : "published";
		setTogglingId(id);
		try {
			await contentApi.update(id, { status: newStatus });
			showFeedback("success", t("admin.content.statusUpdateSuccess"));
			await fetchContent();
		} catch (error) {
			console.error("Failed to update status:", error);
			showFeedback("error", t("admin.content.statusUpdateFailed"));
		} finally {
			setTogglingId(null);
		}
	};

	// ── Quick-action handlers ──
	const openActionMenu = (event: React.MouseEvent<HTMLElement>, item: any) => {
		setMenuAnchor(event.currentTarget);
		setMenuItem(item);
	};

	const closeActionMenu = () => {
		setMenuAnchor(null);
		setMenuItem(null);
	};

	const openSliderDialog = () => {
		setSliderForm({
			title: menuItem?.title || "",
			titleFa: menuItem?.titleFa || menuItem?.title || "",
			imageUrl: menuItem?.posterUrl || "",
			section: "hero",
			sortOrder: 0,
		});
		setSliderDialog(true);
		closeActionMenu();
	};

	const openPinDialog = () => {
		setPinForm({ section: "hero", label: "", labelFa: "", sortOrder: 0 });
		setPinDialog(true);
		closeActionMenu();
	};

	const openOfferDialog = () => {
		setOfferForm({
			title: menuItem?.title || "",
			titleFa: menuItem?.titleFa || menuItem?.title || "",
			discountPercent: 0,
			discountCode: "",
			linkUrl: `/item/${menuItem?.id}`,
			sortOrder: 0,
		});
		setOfferDialog(true);
		closeActionMenu();
	};

	const handleSliderSave = async () => {
		try {
			await slidersApi.create({
				...sliderForm,
				contentId: menuItem?.id,
			});
			showFeedback("success", "محتوا به اسلایدر اضافه شد");
			setSliderDialog(false);
		} catch (e: any) {
			showFeedback("error", e?.response?.data?.message || "خطا در افزودن به اسلایدر");
		}
	};

	const handlePinSave = async () => {
		try {
			await pinsApi.create({
				...pinForm,
				contentId: menuItem?.id,
			});
			showFeedback("success", "محتوا پین شد");
			setPinDialog(false);
		} catch (e: any) {
			showFeedback("error", e?.response?.data?.message || "خطا در پین کردن");
		}
	};

	const handleOfferSave = async () => {
		try {
			await offersApi.create({
				...offerForm,
				linkUrl: offerForm.linkUrl || undefined,
			});
			showFeedback("success", "پیشنهاد ایجاد شد");
			setOfferDialog(false);
		} catch (e: any) {
			showFeedback("error", e?.response?.data?.message || "خطا در ایجاد پیشنهاد");
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">
						{t("admin.content.title")}
					</h1>
					<p className="text-gray-600">{t("admin.content.list")}</p>
				</div>
				<Link href="/admin/content/new">
					<Button>
						<Plus className="ml-2 h-4 w-4" />
						{t("admin.content.createNew")}
					</Button>
				</Link>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>{t("admin.content.list")}</CardTitle>
				</CardHeader>
				<CardContent>
					{/* Filters Row */}
					<div className="mb-4 flex flex-col gap-3 sm:flex-row">
						<input
							type="text"
							placeholder={t("admin.content.searchPlaceholder")}
							value={search}
							onChange={(e) => {
								setSearch(e.target.value);
								setPage(1);
							}}
							className="flex-1 rounded-md border border-gray-300 px-3 py-2"
						/>
						<select
							value={typeFilter}
							onChange={(e) => {
								setTypeFilter(e.target.value);
								setPage(1);
							}}
							className="rounded-md border border-gray-300 px-3 py-2 bg-white"
						>
							<option value="">{t("admin.content.allTypes")}</option>
							<option value="movie">{t("admin.content.movie")}</option>
							<option value="series">{t("admin.content.series")}</option>
						</select>
						<select
							value={statusFilter}
							onChange={(e) => {
								setStatusFilter(e.target.value);
								setPage(1);
							}}
							className="rounded-md border border-gray-300 px-3 py-2 bg-white"
						>
							<option value="">{t("admin.content.allStatuses")}</option>
							<option value="draft">{t("admin.content.status.draft")}</option>
							<option value="published">{t("admin.content.status.published")}</option>
							<option value="archived">{t("admin.content.status.archived")}</option>
						</select>
					</div>
					{loading ? (
						<div className="p-6 text-center">{t("admin.messages.loading")}</div>
					) : (
						<>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="w-16">{t("admin.content.poster")}</TableHead>
										<TableHead>{t("admin.upload.basicInfo.title")}</TableHead>
										<TableHead>{t("admin.upload.basicInfo.type")}</TableHead>
										<TableHead>{t("admin.content.detail.status")}</TableHead>
										<TableHead>{t("admin.content.year")}</TableHead>
										<TableHead>{t("admin.content.actions")}</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{content.map((item) => (
										<TableRow key={item.id}>
											{/* Poster Thumbnail */}
											<TableCell>
												{item.posterUrl ? (
													<img
														src={item.posterUrl}
														alt={item.title}
														className="h-12 w-9 rounded object-cover"
													/>
												) : (
													<div className="flex h-12 w-9 items-center justify-center rounded bg-gray-100">
														{item.type === "movie" ? (
															<Film className="h-4 w-4 text-gray-400" />
														) : (
															<Tv className="h-4 w-4 text-gray-400" />
														)}
													</div>
												)}
											</TableCell>
											<TableCell className="font-medium">
												<Link
													href={`/admin/content/${item.id}`}
													className="hover:text-blue-600 hover:underline"
												>
													{item.title}
												</Link>
											</TableCell>
											<TableCell>
												<span className="inline-flex items-center gap-1 text-sm">
													{item.type === "movie" ? (
														<Film className="h-3.5 w-3.5" />
													) : (
														<Tv className="h-3.5 w-3.5" />
													)}
													{t(`admin.content.${item.type}`) || item.type}
												</span>
											</TableCell>
											<TableCell>
												<button
													type="button"
													onClick={() => handleToggleStatus(item.id, item.status)}
													disabled={togglingId === item.id}
													className={`cursor-pointer rounded-full px-2 py-1 text-xs font-medium transition-all hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50 ${
														item.status === "published"
															? "bg-green-100 text-green-800"
															: item.status === "archived"
																? "bg-gray-100 text-gray-800"
																: "bg-yellow-100 text-yellow-800"
													}`}
													title={item.status === "published" ? "کلیک برای پیش‌نویس" : "کلیک برای انتشار"}
												>
													{togglingId === item.id ? "..." : (t(`admin.content.status.${item.status}`) || item.status)}
												</button>
											</TableCell>
											<TableCell>{item.year || "-"}</TableCell>
											<TableCell>
												<div className="flex gap-1 items-center">
													<Link href={`/admin/content/${item.id}`}>
														<Button variant="outline" size="sm">
															<Edit className="h-4 w-4" />
														</Button>
													</Link>
													<Button
														variant="destructive"
														size="sm"
														onClick={() => handleDelete(item.id)}
													>
														<Trash2 className="h-4 w-4" />
													</Button>
													<IconButton
														size="small"
														onClick={(e) => openActionMenu(e, item)}
														title="عملیات بیشتر"
													>
														<MoreVertical className="h-4 w-4" />
													</IconButton>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
							<div className="mt-4 flex items-center justify-between">
								<div className="text-sm text-gray-600">
									{t("admin.content.showing")} {(page - 1) * 20 + 1} {t("admin.content.to")}{" "}
									{Math.min(page * 20, total)} {t("admin.content.of")} {total}
								</div>
								<div className="flex gap-2">
									<Button
										variant="outline"
										onClick={() => setPage((p) => Math.max(1, p - 1))}
										disabled={page === 1}
									>
										{t("admin.content.previous")}
									</Button>
									<Button
										variant="outline"
										onClick={() => setPage((p) => p + 1)}
										disabled={page * 20 >= total}
									>
										{t("admin.content.next")}
									</Button>
								</div>
							</div>
						</>
					)}
				</CardContent>
			</Card>

			{/* Action Menu for content rows */}
			<Menu
				anchorEl={menuAnchor}
				open={Boolean(menuAnchor)}
				onClose={closeActionMenu}
			>
				<MenuItem onClick={openSliderDialog}>
					<ListItemIcon><Image className="h-4 w-4" /></ListItemIcon>
					<ListItemText>افزودن به اسلایدر</ListItemText>
				</MenuItem>
				<MenuItem onClick={openPinDialog}>
					<ListItemIcon><MapPin className="h-4 w-4" /></ListItemIcon>
					<ListItemText>پین کردن</ListItemText>
				</MenuItem>
				<MenuItem onClick={openOfferDialog}>
					<ListItemIcon><Gift className="h-4 w-4" /></ListItemIcon>
					<ListItemText>افزودن به پیشنهادها</ListItemText>
				</MenuItem>
			</Menu>

			{/* Add to Slider Dialog */}
			<Dialog open={sliderDialog} onClose={() => setSliderDialog(false)} maxWidth="sm" fullWidth dir="rtl">
				<DialogTitle>
					افزودن به اسلایدر
					{menuItem && <span className="text-sm text-gray-500 mr-2">— {menuItem.title}</span>}
				</DialogTitle>
				<DialogContent>
					<div className="grid grid-cols-2 gap-4 mt-2">
						<TextField
							label="عنوان (انگلیسی)"
							value={sliderForm.title}
							onChange={(e) => setSliderForm({ ...sliderForm, title: e.target.value })}
							fullWidth
							size="small"
						/>
						<TextField
							label="عنوان فارسی"
							value={sliderForm.titleFa}
							onChange={(e) => setSliderForm({ ...sliderForm, titleFa: e.target.value })}
							fullWidth
							size="small"
						/>
						<TextField
							label="لینک تصویر"
							value={sliderForm.imageUrl}
							onChange={(e) => setSliderForm({ ...sliderForm, imageUrl: e.target.value })}
							fullWidth
							size="small"
							placeholder="https://..."
						/>
						<FormControl fullWidth size="small">
							<InputLabel>بخش</InputLabel>
							<Select
								value={sliderForm.section}
								label="بخش"
								onChange={(e) => setSliderForm({ ...sliderForm, section: e.target.value })}
							>
								{SLIDER_SECTIONS.map((s) => (
									<MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
								))}
							</Select>
						</FormControl>
						<TextField
							label="ترتیب نمایش"
							type="number"
							value={sliderForm.sortOrder}
							onChange={(e) => setSliderForm({ ...sliderForm, sortOrder: parseInt(e.target.value) || 0 })}
							fullWidth
							size="small"
						/>
					</div>
				</DialogContent>
				<DialogActions>
					<MuiButton onClick={() => setSliderDialog(false)}>انصراف</MuiButton>
					<MuiButton variant="contained" onClick={handleSliderSave} disabled={!sliderForm.title}>
						افزودن
					</MuiButton>
				</DialogActions>
			</Dialog>

			{/* Pin Dialog */}
			<Dialog open={pinDialog} onClose={() => setPinDialog(false)} maxWidth="sm" fullWidth dir="rtl">
				<DialogTitle>
					پین کردن محتوا
					{menuItem && <span className="text-sm text-gray-500 mr-2">— {menuItem.title}</span>}
				</DialogTitle>
				<DialogContent>
					<div className="grid grid-cols-2 gap-4 mt-2">
						<FormControl fullWidth size="small">
							<InputLabel>بخش صفحه اصلی</InputLabel>
							<Select
								value={pinForm.section}
								label="بخش صفحه اصلی"
								onChange={(e) => setPinForm({ ...pinForm, section: e.target.value })}
							>
								{PIN_SECTIONS.map((s) => (
									<MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
								))}
							</Select>
						</FormControl>
						<TextField
							label="ترتیب نمایش"
							type="number"
							value={pinForm.sortOrder}
							onChange={(e) => setPinForm({ ...pinForm, sortOrder: parseInt(e.target.value) || 0 })}
							fullWidth
							size="small"
						/>
						<TextField
							label="برچسب (انگلیسی)"
							value={pinForm.label}
							onChange={(e) => setPinForm({ ...pinForm, label: e.target.value })}
							fullWidth
							size="small"
							placeholder="Featured"
						/>
						<TextField
							label="برچسب فارسی"
							value={pinForm.labelFa}
							onChange={(e) => setPinForm({ ...pinForm, labelFa: e.target.value })}
							fullWidth
							size="small"
							placeholder="ویژه"
						/>
					</div>
				</DialogContent>
				<DialogActions>
					<MuiButton onClick={() => setPinDialog(false)}>انصراف</MuiButton>
					<MuiButton variant="contained" onClick={handlePinSave}>
						پین کردن
					</MuiButton>
				</DialogActions>
			</Dialog>

			{/* Add to Offer Dialog */}
			<Dialog open={offerDialog} onClose={() => setOfferDialog(false)} maxWidth="sm" fullWidth dir="rtl">
				<DialogTitle>
					افزودن به پیشنهادها
					{menuItem && <span className="text-sm text-gray-500 mr-2">— {menuItem.title}</span>}
				</DialogTitle>
				<DialogContent>
					<div className="grid grid-cols-2 gap-4 mt-2">
						<TextField
							label="عنوان پیشنهاد (انگلیسی)"
							value={offerForm.title}
							onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
							fullWidth
							size="small"
						/>
						<TextField
							label="عنوان فارسی"
							value={offerForm.titleFa}
							onChange={(e) => setOfferForm({ ...offerForm, titleFa: e.target.value })}
							fullWidth
							size="small"
						/>
						<TextField
							label="درصد تخفیف"
							type="number"
							value={offerForm.discountPercent}
							onChange={(e) => setOfferForm({ ...offerForm, discountPercent: parseInt(e.target.value) || 0 })}
							fullWidth
							size="small"
							inputProps={{ min: 0, max: 100 }}
						/>
						<TextField
							label="کد تخفیف"
							value={offerForm.discountCode}
							onChange={(e) => setOfferForm({ ...offerForm, discountCode: e.target.value })}
							fullWidth
							size="small"
							placeholder="SPECIAL2026"
						/>
						<TextField
							label="لینک مقصد"
							value={offerForm.linkUrl}
							onChange={(e) => setOfferForm({ ...offerForm, linkUrl: e.target.value })}
							fullWidth
							size="small"
						/>
						<TextField
							label="ترتیب نمایش"
							type="number"
							value={offerForm.sortOrder}
							onChange={(e) => setOfferForm({ ...offerForm, sortOrder: parseInt(e.target.value) || 0 })}
							fullWidth
							size="small"
						/>
					</div>
				</DialogContent>
				<DialogActions>
					<MuiButton onClick={() => setOfferDialog(false)}>انصراف</MuiButton>
					<MuiButton variant="contained" onClick={handleOfferSave} disabled={!offerForm.title}>
						ایجاد پیشنهاد
					</MuiButton>
				</DialogActions>
			</Dialog>

			{/* Confirmation Dialog */}
			<Dialog
				open={confirmDialog.open}
				onClose={() => handleConfirmClose(false)}
				dir="rtl"
			>
				<DialogTitle>{confirmDialog.title}</DialogTitle>
				<DialogContent>
					<DialogContentText>{confirmDialog.message}</DialogContentText>
				</DialogContent>
				<DialogActions>
					<MuiButton onClick={() => handleConfirmClose(false)} color="inherit">
						{t("admin.form.cancel")}
					</MuiButton>
					<MuiButton
						onClick={() => handleConfirmClose(true)}
						color="error"
						variant="contained"
					>
						{t("admin.form.delete")}
					</MuiButton>
				</DialogActions>
			</Dialog>

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
