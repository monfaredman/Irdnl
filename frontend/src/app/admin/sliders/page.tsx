"use client";

import { Edit, Plus, Trash2, Image } from "lucide-react";
import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import type { ColDef } from "ag-grid-community";
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
	Select,
	MenuItem,
	InputLabel,
	FormControl,
	Chip,
} from "@mui/material";
import { slidersApi } from "@/lib/api/admin";

interface SliderItem {
	id: string;
	title: string;
	titleFa: string | null;
	description: string | null;
	descriptionFa: string | null;
	imageUrl: string | null;
	mobileImageUrl: string | null;
	videoUrl: string | null;
	linkUrl: string | null;
	buttonText: string | null;
	buttonTextFa: string | null;
	contentId: string | null;
	content?: { id: string; title: string } | null;
	section: string;
	isActive: boolean;
	showSlider: boolean;
	onlyKids: boolean;
	sortOrder: number;
	startDate: string | null;
	endDate: string | null;
}

const SECTIONS = [
	{ value: "hero", label: "اسلایدر اصلی (Hero)" },
	{ value: "banner1", label: "بنر ۱" },
	{ value: "banner2", label: "بنر ۲" },
	{ value: "promo", label: "تبلیغاتی" },
];

const emptyForm = {
	title: "",
	titleFa: "",
	description: "",
	descriptionFa: "",
	imageUrl: "",
	mobileImageUrl: "",
	videoUrl: "",
	linkUrl: "",
	buttonText: "",
	buttonTextFa: "",
	contentId: "",
	section: "hero",
	isActive: true,
	showSlider: true,
	onlyKids: false,
	sortOrder: 0,
	startDate: "",
	endDate: "",
};

export default function SlidersPage() {
	const [sliders, setSliders] = useState<SliderItem[]>([]);
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
	const [filterSection, setFilterSection] = useState("");

	const fetchSliders = async () => {
		setLoading(true);
		try {
			const res = await slidersApi.list(filterSection || undefined);
			setSliders(res.data || []);
		} catch {
			showFeedback("error", "خطا در دریافت اسلایدرها");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchSliders();
	}, [filterSection]);

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

	const openEditForm = (s: SliderItem) => {
		setEditingId(s.id);
		setForm({
			title: s.title,
			titleFa: s.titleFa || "",
			description: s.description || "",
			descriptionFa: s.descriptionFa || "",
			imageUrl: s.imageUrl || "",
			mobileImageUrl: s.mobileImageUrl || "",
			videoUrl: s.videoUrl || "",
			linkUrl: s.linkUrl || "",
			buttonText: s.buttonText || "",
			buttonTextFa: s.buttonTextFa || "",
			contentId: s.contentId || "",
			section: s.section,
			isActive: s.isActive,
			showSlider: s.showSlider !== false,
			onlyKids: s.onlyKids || false,
			sortOrder: s.sortOrder,
			startDate: s.startDate ? s.startDate.split("T")[0] : "",
			endDate: s.endDate ? s.endDate.split("T")[0] : "",
		});
		setFormOpen(true);
	};

	const handleSave = async () => {
		try {
			// Upgrade TMDB image quality from w500 to w1280
			let imageUrl = form.imageUrl;
			if (imageUrl) {
				imageUrl = imageUrl.replace(/\/w\d+\//g, '/w1280/');
			}
			let mobileImageUrl = form.mobileImageUrl;
			if (mobileImageUrl) {
				mobileImageUrl = mobileImageUrl.replace(/\/w\d+\//g, '/w1280/');
			}
			const payload: any = {
				...form,
				imageUrl: imageUrl || undefined,
				mobileImageUrl: mobileImageUrl || undefined,
				videoUrl: form.videoUrl || undefined,
				linkUrl: form.linkUrl || (form.contentId ? `/item/${form.contentId}` : undefined),
				buttonText: form.buttonText || undefined,
				buttonTextFa: form.buttonTextFa || undefined,
				contentId: form.contentId || undefined,
				startDate: form.startDate || undefined,
				endDate: form.endDate || undefined,
			};
			if (editingId) {
				await slidersApi.update(editingId, payload);
				showFeedback("success", "اسلایدر با موفقیت ویرایش شد");
			} else {
				await slidersApi.create(payload);
				showFeedback("success", "اسلایدر با موفقیت ایجاد شد");
			}
			setFormOpen(false);
			fetchSliders();
		} catch (e: any) {
			showFeedback("error", e?.response?.data?.message || "خطا در ذخیره اسلایدر");
		}
	};

	const handleDelete = (s: SliderItem) => {
		showConfirm("حذف اسلایدر", `آیا از حذف "${s.title}" مطمئن هستید؟`, async () => {
			try {
				await slidersApi.delete(s.id);
				showFeedback("success", "اسلایدر حذف شد");
				fetchSliders();
			} catch {
				showFeedback("error", "خطا در حذف اسلایدر");
			}
		});
	};

	const handleToggleActive = async (s: SliderItem) => {
		try {
			await slidersApi.update(s.id, { isActive: !s.isActive });
			fetchSliders();
		} catch {
			showFeedback("error", "خطا در تغییر وضعیت");
		}
	};

	const getSectionLabel = (val: string) =>
		SECTIONS.find((s) => s.value === val)?.label || val;

	// AG Grid column definitions
	const columnDefs: ColDef[] = [
		{
			field: "sortOrder",
			headerName: "ترتیب",
			width: 100,
			sortable: true,
		},
		{
			field: "imageUrl",
			headerName: "تصویر",
			width: 120,
			sortable: false,
			filter: false,
			cellRenderer: (params: any) => {
				const imageUrl = params.value;
				return imageUrl ? (
					<img
						src={imageUrl}
						alt="Slider"
						className="w-16 h-10 object-cover rounded"
					/>
				) : (
					<div className="w-16 h-10 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">
						—
					</div>
				);
			},
		},
		{
			field: "title",
			headerName: "عنوان",
			flex: 1,
			sortable: true,
			filter: true,
			cellRenderer: (params: any) => {
				const slider = params.data;
				return (
					<div>
						<p className="font-medium">{slider.titleFa || slider.title}</p>
						{slider.titleFa && (
							<p className="text-xs text-gray-400">{slider.title}</p>
						)}
					</div>
				);
			},
		},
		{
			field: "section",
			headerName: "بخش",
			width: 180,
			sortable: true,
			filter: true,
			cellRenderer: (params: any) => {
				return <Chip label={getSectionLabel(params.value)} size="small" />;
			},
		},
		{
			field: "contentId",
			headerName: "محتوا",
			width: 150,
			sortable: false,
			filter: false,
			cellRenderer: (params: any) => {
				const slider = params.data;
				const text = slider.content?.title || (slider.contentId ? slider.contentId.slice(0, 8) + "..." : "—");
				return <span className="text-xs">{text}</span>;
			},
		},
		{
			field: "isActive",
			headerName: "وضعیت",
			width: 100,
			sortable: true,
			filter: true,
			cellRenderer: (params: any) => {
				const slider = params.data;
				return (
					<Switch
						size="small"
						checked={params.value}
						onChange={() => handleToggleActive(slider)}
					/>
				);
			},
		},
		{
			field: "actions",
			headerName: "عملیات",
			width: 120,
			sortable: false,
			filter: false,
			cellRenderer: (params: any) => {
				const slider = params.data;
				return (
					<div className="flex gap-1">
						<Button variant="ghost" size="sm" onClick={() => openEditForm(slider)}>
							<Edit className="h-4 w-4" />
						</Button>
						<Button variant="ghost" size="sm" onClick={() => handleDelete(slider)}>
							<Trash2 className="h-4 w-4 text-red-500" />
						</Button>
					</div>
				);
			},
		},
	];

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
						<Image className="h-6 w-6" />
						مدیریت اسلایدرها
					</h1>
					<p className="text-gray-500 mt-1">
						بنرها و اسلایدرهای صفحه اصلی
					</p>
				</div>
				<Button onClick={openCreateForm}>
					<Plus className="ml-2 h-4 w-4" />
					افزودن اسلایدر
				</Button>
			</div>

			{/* Filter by section */}
			<Card>
				<CardContent className="pt-4">
					<div className="flex items-center gap-4">
						<span className="text-sm font-medium text-gray-700">بخش:</span>
						<div className="flex flex-wrap gap-2">
							<Chip
								label="همه"
								variant={filterSection === "" ? "filled" : "outlined"}
								color={filterSection === "" ? "primary" : "default"}
								onClick={() => setFilterSection("")}
								size="small"
							/>
							{SECTIONS.map((sec) => (
								<Chip
									key={sec.value}
									label={sec.label}
									variant={filterSection === sec.value ? "filled" : "outlined"}
									color={filterSection === sec.value ? "primary" : "default"}
									onClick={() => setFilterSection(sec.value)}
									size="small"
								/>
							))}
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>اسلایدرها ({sliders.length})</CardTitle>
				</CardHeader>
				<CardContent>
					{loading ? (
						<p className="text-center py-8 text-gray-500">در حال بارگذاری...</p>
					) : sliders.length === 0 ? (
						<p className="text-center py-8 text-gray-500">اسلایدری یافت نشد</p>
					) : (
						<div className="ag-theme-alpine" style={{ height: 600, width: "100%" }} dir="rtl">
							<AgGridReact
								rowData={sliders}
								columnDefs={columnDefs}
								pagination={true}
								paginationPageSize={20}
								paginationPageSizeSelector={[10, 20, 50, 100]}
								domLayout="normal"
								enableRtl={true}
								suppressMovableColumns={false}
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

			{/* Create/Edit Dialog */}
			<Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="md" fullWidth>
				<DialogTitle>{editingId ? "ویرایش اسلایدر" : "افزودن اسلایدر جدید"}</DialogTitle>
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
							placeholder="https://..."
						/>
						<TextField
							label="تصویر موبایل"
							value={form.mobileImageUrl}
							onChange={(e) => setForm({ ...form, mobileImageUrl: e.target.value })}
							fullWidth
							size="small"
							placeholder="https://... (تصویر مخصوص موبایل)"
						/>
						<TextField
							label="لینک ویدیو"
							value={form.videoUrl}
							onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
							fullWidth
							size="small"
							placeholder="https://... (ویدیو پس‌زمینه)"
						/>
						<TextField
							label="لینک مقصد"
							value={form.linkUrl}
							onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
							fullWidth
							size="small"
							placeholder="/item/..."
						/>
						<TextField
							label="متن دکمه (انگلیسی)"
							value={form.buttonText}
							onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
							fullWidth
							size="small"
							placeholder="Watch Now"
						/>
						<TextField
							label="متن دکمه (فارسی)"
							value={form.buttonTextFa}
							onChange={(e) => setForm({ ...form, buttonTextFa: e.target.value })}
							fullWidth
							size="small"
							placeholder="تماشا کنید"
						/>
						<TextField
							label="شناسه محتوا (Content ID)"
							value={form.contentId}
							onChange={(e) => setForm({ ...form, contentId: e.target.value })}
							fullWidth
							size="small"
							placeholder="UUID محتوا (اختیاری)"
						/>
						<FormControl fullWidth size="small">
							<InputLabel>بخش</InputLabel>
							<Select
								value={form.section}
								label="بخش"
								onChange={(e) => setForm({ ...form, section: e.target.value })}
							>
								{SECTIONS.map((sec) => (
									<MenuItem key={sec.value} value={sec.value}>
										{sec.label}
									</MenuItem>
								))}
							</Select>
						</FormControl>
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
						<FormControlLabel
							control={
								<Switch
									checked={form.showSlider}
									onChange={(e) => setForm({ ...form, showSlider: e.target.checked })}
								/>
							}
							label="نمایش اسلایدر"
						/>
						<FormControlLabel
							control={
								<Switch
									checked={form.onlyKids}
									onChange={(e) => setForm({ ...form, onlyKids: e.target.checked })}
								/>
							}
							label="فقط کودکان"
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
