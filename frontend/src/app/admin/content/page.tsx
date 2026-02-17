"use client";

import { Edit, Plus, Trash2, Film, Tv, Image, MapPin, Gift, MoreVertical, Copy } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useMemo, useCallback } from "react";
import { Button } from "@/components/admin/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/admin/ui/card";
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
	Chip,
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ColDef, GridReadyEvent } from "ag-grid-community";
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

	// Load last used values from localStorage
	const getLastFormValues = (key: string, defaults: any) => {
		if (typeof window === "undefined") return defaults;
		try {
			const stored = localStorage.getItem(`adminContent_${key}`);
			return stored ? { ...defaults, ...JSON.parse(stored) } : defaults;
		} catch {
			return defaults;
		}
	};

	const saveFormValues = (key: string, values: any) => {
		if (typeof window === "undefined") return;
		try {
			// Extract only the user-fillable fields (exclude dynamic ones like contentId)
			const { title, titleFa, imageUrl, discountPercent, discountCode, linkUrl, label, labelFa, ...rest } = values;
			const toSave = { title, titleFa, imageUrl, discountPercent, discountCode, linkUrl, label, labelFa };
			localStorage.setItem(`adminContent_${key}`, JSON.stringify(toSave));
		} catch (e) {
			console.error("Failed to save form values:", e);
		}
	};

	// Slider dialog
	const [sliderDialog, setSliderDialog] = useState(false);
	const [sliderForm, setSliderForm] = useState(() => 
		getLastFormValues("slider", {
			title: "",
			titleFa: "",
			imageUrl: "",
			section: "hero",
			sortOrder: 0,
		})
	);

	// Pin dialog
	const [pinDialog, setPinDialog] = useState(false);
	const [pinForm, setPinForm] = useState(() => 
		getLastFormValues("pin", {
			section: "hero",
			label: "",
			labelFa: "",
			sortOrder: 0,
		})
	);

	// Offer dialog
	const [offerDialog, setOfferDialog] = useState(false);
	const [offerForm, setOfferForm] = useState(() => 
		getLastFormValues("offer", {
			title: "",
			titleFa: "",
			discountPercent: 0,
			discountCode: "",
			linkUrl: "",
			sortOrder: 0,
		})
	);

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
		const lastValues = getLastFormValues("slider", {});
		const currentItem = menuItem; // Preserve before closing menu
		setSliderForm({
			title: currentItem?.title || lastValues.title || "",
			titleFa: currentItem?.titleFa || currentItem?.title || lastValues.titleFa || "",
			imageUrl: currentItem?.posterUrl || lastValues.imageUrl || "",
			section: lastValues.section || "hero",
			sortOrder: lastValues.sortOrder || 0,
			contentId: currentItem?.id, // Store the ID in the form
		});
		setSliderDialog(true);
		closeActionMenu();
	};

	const openPinDialog = () => {
		const lastValues = getLastFormValues("pin", {});
		const currentItem = menuItem; // Preserve before closing menu
		setPinForm({ 
			section: lastValues.section || "hero", 
			label: lastValues.label || "", 
			labelFa: lastValues.labelFa || "", 
			sortOrder: lastValues.sortOrder || 0,
			contentId: currentItem?.id, // Store the ID in the form
		});
		setPinDialog(true);
		closeActionMenu();
	};

	const openOfferDialog = () => {
		const lastValues = getLastFormValues("offer", {});
		const currentItem = menuItem; // Preserve before closing menu
		setOfferForm({
			title: currentItem?.title || lastValues.title || "",
			titleFa: currentItem?.titleFa || currentItem?.title || lastValues.titleFa || "",
			discountPercent: lastValues.discountPercent || 0,
			discountCode: lastValues.discountCode || "",
			linkUrl: currentItem?.id ? `/item/${currentItem.id}` : lastValues.linkUrl || "",
			sortOrder: lastValues.sortOrder || 0,
			contentId: currentItem?.id, // Store the ID in the form
		});
		setOfferDialog(true);
		closeActionMenu();
	};

	const handleSliderSave = async () => {
		if (!sliderForm.contentId) {
			showFeedback("error", "شناسه محتوا یافت نشد");
			return;
		}
		try {
			await slidersApi.create(sliderForm);
			saveFormValues("slider", sliderForm); // Save for next time
			showFeedback("success", "محتوا به اسلایدر اضافه شد");
			setSliderDialog(false);
		} catch (e: any) {
			showFeedback("error", e?.response?.data?.message || "خطا در افزودن به اسلایدر");
		}
	};

	const handlePinSave = async () => {
		if (!pinForm.contentId) {
			showFeedback("error", "شناسه محتوا یافت نشد");
			return;
		}
		try {
			await pinsApi.create(pinForm);
			saveFormValues("pin", pinForm); // Save for next time
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
			saveFormValues("offer", offerForm); // Save for next time
			showFeedback("success", "پیشنهاد ایجاد شد");
			setOfferDialog(false);
		} catch (e: any) {
			showFeedback("error", e?.response?.data?.message || "خطا در ایجاد پیشنهاد");
		}
	};

	// ── AG Grid Cell Renderers ──
	const PosterRenderer = useCallback((params: any) => {
		const item = params.data;
		if (item.posterUrl) {
			return (
				<img
					src={item.posterUrl}
					alt={item.title}
					className="h-12 w-9 rounded object-cover"
				/>
			);
		}
		return (
			<div className="flex h-12 w-9 items-center justify-center rounded bg-gray-100">
				{item.type === "movie" ? (
					<Film className="h-4 w-4 text-gray-400" />
				) : (
					<Tv className="h-4 w-4 text-gray-400" />
				)}
			</div>
		);
	}, []);

	const TitleRenderer = useCallback((params: any) => {
		return (
			<Link
				href={`/admin/content/${params.data.id}`}
				className="hover:text-blue-600 hover:underline font-medium"
			>
				{params.value}
			</Link>
		);
	}, []);

	const TypeRenderer = useCallback((params: any) => {
		return (
			<Chip
				icon={params.value === "movie" ? <Film className="h-3.5 w-3.5" /> : <Tv className="h-3.5 w-3.5" />}
				label={t(`admin.content.${params.value}`) || params.value}
				size="small"
				variant="outlined"
				color={params.value === "movie" ? "primary" : "secondary"}
			/>
		);
	}, [t]);

	const StatusRenderer = useCallback((params: any) => {
		const item = params.data;
		const isToggling = togglingId === item.id;
		return (
			<Chip
				label={isToggling ? "..." : (t(`admin.content.status.${item.status}`) || item.status)}
				size="small"
				color={item.status === "published" ? "success" : item.status === "archived" ? "default" : "warning"}
				onClick={() => !isToggling && handleToggleStatus(item.id, item.status)}
				title={item.status === "published" ? "کلیک برای پیش‌نویس" : "کلیک برای انتشار"}
				style={{ cursor: isToggling ? "not-allowed" : "pointer" }}
			/>
		);
	}, [togglingId, t]);

	const ActionsRenderer = useCallback((params: any) => {
		const item = params.data;
		return (
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
		);
	}, []);

	// ── AG Grid Column Definitions ──
	const columnDefs = useMemo<ColDef[]>(() => [
		{
			field: "posterUrl",
			headerName: t("admin.content.poster"),
			cellRenderer: PosterRenderer,
			width: 80,
			sortable: false,
			filter: false,
			pinned: "right",
		},
		{
			field: "id",
			headerName: "شناسه",
			width: 130,
			sortable: false,
			filter: false,
			cellRenderer: (params: any) => {
				const id = params.value;
				if (!id) return "-";
				return (
					<div className="flex items-center gap-1 cursor-pointer group" title="کپی شناسه" onClick={() => {
						navigator.clipboard.writeText(id);
						showFeedback("success", "شناسه کپی شد");
					}}>
						<span className="text-xs text-gray-500 font-mono truncate">{id.slice(0, 8)}…</span>
						<Copy className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
					</div>
				);
			},
		},
		{
			field: "title",
			headerName: t("admin.upload.basicInfo.title"),
			cellRenderer: TitleRenderer,
			sortable: true,
			filter: "agTextColumnFilter",
			flex: 2,
			minWidth: 200,
		},
		{
			field: "type",
			headerName: t("admin.upload.basicInfo.type"),
			cellRenderer: TypeRenderer,
			sortable: true,
			filter: "agTextColumnFilter",
			width: 140,
		},
		{
			field: "status",
			headerName: t("admin.content.detail.status"),
			cellRenderer: StatusRenderer,
			sortable: true,
			filter: "agTextColumnFilter",
			width: 150,
		},
		{
			field: "year",
			headerName: t("admin.content.year"),
			sortable: true,
			filter: "agNumberColumnFilter",
			width: 100,
			valueFormatter: (params) => params.value || "-",
		},
		{
			field: "actions",
			headerName: t("admin.content.actions"),
			cellRenderer: ActionsRenderer,
			width: 180,
			sortable: false,
			filter: false,
			pinned: "left",
		},
	], [t, PosterRenderer, TitleRenderer, TypeRenderer, StatusRenderer, ActionsRenderer, showFeedback]);

	return (
		<div className="space-y-4 sm:space-y-6">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-xl sm:text-3xl font-bold text-gray-900">
						{t("admin.content.title")}
					</h1>
					<p className="text-sm text-gray-600">{t("admin.content.list")}</p>
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
						<div className="ag-theme-alpine overflow-x-auto" style={{ height: "min(650px, 70vh)", width: "100%" }} dir="rtl">
							<AgGridReact
								columnDefs={columnDefs}
								rowData={content}
								pagination={true}
								paginationPageSize={20}
								paginationPageSizeSelector={[10, 20, 50, 100]}
								rowSelection={{ mode: "singleRow", enableClickSelection: false }}
								enableRtl={true}
								loading={loading}
								animateRows={true}
								rowHeight={70}
								headerHeight={56}
								defaultColDef={{
									resizable: true,
									sortable: true,
									filter: true,
								}}
							/>
						</div>
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
