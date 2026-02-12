"use client";

import { Edit, Plus, Trash2, FolderTree } from "lucide-react";
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
import { categoriesApi } from "@/lib/api/admin";
import { useTranslation } from "@/i18n";

interface CategoryItem {
	id: string;
	slug: string;
	nameEn: string;
	nameFa: string;
	contentType: string;
	descriptionEn?: string;
	descriptionFa?: string;
	gradientColors?: string[];
	icon?: string;
	imageUrl?: string;
	tmdbParams?: Record<string, any>;
	showEpisodes: boolean;
	isActive: boolean;
	sortOrder: number;
}

const emptyForm: Omit<CategoryItem, "id"> = {
	slug: "",
	nameEn: "",
	nameFa: "",
	contentType: "movie",
	descriptionEn: "",
	descriptionFa: "",
	gradientColors: [],
	icon: "",
	imageUrl: "",
	tmdbParams: {},
	showEpisodes: false,
	isActive: true,
	sortOrder: 0,
};

export default function CategoriesPage() {
	const { t } = useTranslation();
	const [categories, setCategories] = useState<CategoryItem[]>([]);
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

	// Form dialog
	const [formOpen, setFormOpen] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [form, setForm] = useState(emptyForm);
	const [gradientInput, setGradientInput] = useState("");

	const fetchCategories = async () => {
		setLoading(true);
		try {
			const res = await categoriesApi.list();
			setCategories(res.data || []);
		} catch (e) {
			showFeedback("error", "خطا در دریافت دسته‌بندی‌ها");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCategories();
	}, []);

	const showFeedback = (type: "success" | "error", message: string) => {
		setFeedback({ type, message });
	};

	const showConfirm = (
		title: string,
		message: string,
		onConfirm: () => void,
	) => {
		setConfirmDialog({ open: true, title, message, onConfirm });
	};

	const handleConfirmClose = (confirmed: boolean) => {
		if (confirmed) confirmDialog.onConfirm();
		setConfirmDialog({ open: false, title: "", message: "", onConfirm: () => {} });
	};

	const openCreateForm = () => {
		setEditingId(null);
		setForm(emptyForm);
		setGradientInput("");
		setFormOpen(true);
	};

	const openEditForm = (cat: CategoryItem) => {
		setEditingId(cat.id);
		setForm({
			slug: cat.slug,
			nameEn: cat.nameEn,
			nameFa: cat.nameFa,
			contentType: cat.contentType,
			descriptionEn: cat.descriptionEn || "",
			descriptionFa: cat.descriptionFa || "",
			gradientColors: cat.gradientColors || [],
			icon: cat.icon || "",
			imageUrl: cat.imageUrl || "",
			tmdbParams: cat.tmdbParams || {},
			showEpisodes: cat.showEpisodes,
			isActive: cat.isActive,
			sortOrder: cat.sortOrder,
		});
		setGradientInput((cat.gradientColors || []).join(", "));
		setFormOpen(true);
	};

	const handleSave = async () => {
		try {
			const payload = {
				...form,
				gradientColors: gradientInput
					.split(",")
					.map((s) => s.trim())
					.filter(Boolean),
			};
			if (editingId) {
				await categoriesApi.update(editingId, payload);
				showFeedback("success", "دسته‌بندی با موفقیت ویرایش شد");
			} else {
				await categoriesApi.create(payload);
				showFeedback("success", "دسته‌بندی با موفقیت ایجاد شد");
			}
			setFormOpen(false);
			fetchCategories();
		} catch (e: any) {
			showFeedback(
				"error",
				e?.response?.data?.message || "خطا در ذخیره دسته‌بندی",
			);
		}
	};

	const handleDelete = (cat: CategoryItem) => {
		showConfirm(
			"حذف دسته‌بندی",
			`آیا از حذف "${cat.nameFa}" مطمئن هستید؟`,
			async () => {
				try {
					await categoriesApi.delete(cat.id);
					showFeedback("success", "دسته‌بندی حذف شد");
					fetchCategories();
				} catch (e) {
					showFeedback("error", "خطا در حذف دسته‌بندی");
				}
			},
		);
	};

	const handleToggleActive = async (cat: CategoryItem) => {
		try {
			await categoriesApi.update(cat.id, { isActive: !cat.isActive });
			fetchCategories();
		} catch (e) {
			showFeedback("error", "خطا در تغییر وضعیت");
		}
	};

	// AG Grid column definitions
	const columnDefs: ColDef[] = [
		{
			field: "sortOrder",
			headerName: "ترتیب",
			width: 100,
			sortable: true,
		},
		{
			field: "slug",
			headerName: "نامک (Slug)",
			width: 150,
			sortable: true,
			filter: true,
			cellRenderer: (params: any) => (
				<span className="font-mono text-xs">{params.value}</span>
			),
		},
		{
			field: "nameFa",
			headerName: "نام فارسی",
			flex: 1,
			sortable: true,
			filter: true,
			cellRenderer: (params: any) => (
				<span className="font-medium">{params.value}</span>
			),
		},
		{
			field: "nameEn",
			headerName: "نام انگلیسی",
			flex: 1,
			sortable: true,
			filter: true,
		},
		{
			field: "contentType",
			headerName: "نوع محتوا",
			width: 130,
			sortable: true,
			filter: true,
			cellRenderer: (params: any) => (
				<Chip
					label={params.value}
					size="small"
					color={
						params.value === "movie"
							? "primary"
							: params.value === "series"
								? "secondary"
								: "default"
					}
				/>
			),
		},
		{
			field: "gradientColors",
			headerName: "رنگ‌ها",
			width: 150,
			sortable: false,
			filter: false,
			cellRenderer: (params: any) => {
				const colors = params.value || [];
				return (
					<div className="flex gap-1">
						{colors.map((c: string, i: number) => (
							<div
								key={i}
								className="w-5 h-5 rounded border"
								style={{ backgroundColor: c }}
								title={c}
							/>
						))}
					</div>
				);
			},
		},
		{
			field: "isActive",
			headerName: "وضعیت",
			width: 100,
			sortable: true,
			filter: true,
			cellRenderer: (params: any) => {
				const category = params.data;
				return (
					<Switch
						size="small"
						checked={params.value}
						onChange={() => handleToggleActive(category)}
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
				const category = params.data;
				return (
					<div className="flex gap-1">
						<Button variant="ghost" size="sm" onClick={() => openEditForm(category)}>
							<Edit className="h-4 w-4" />
						</Button>
						<Button variant="ghost" size="sm" onClick={() => handleDelete(category)}>
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
						<FolderTree className="h-6 w-6" />
						مدیریت دسته‌بندی‌ها
					</h1>
					<p className="text-gray-500 mt-1">
						دسته‌بندی‌های محتوا (فیلم خارجی، سریال ایرانی، انیمیشن و ...)
					</p>
				</div>
				<Button onClick={openCreateForm}>
					<Plus className="ml-2 h-4 w-4" />
					افزودن دسته‌بندی
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>دسته‌بندی‌ها ({categories.length})</CardTitle>
				</CardHeader>
				<CardContent>
					{loading ? (
						<p className="text-center py-8 text-gray-500">در حال بارگذاری...</p>
					) : categories.length === 0 ? (
						<p className="text-center py-8 text-gray-500">
							دسته‌بندی یافت نشد
						</p>
					) : (
						<div className="ag-theme-alpine" style={{ height: 600, width: "100%" }} dir="rtl">
							<AgGridReact
								rowData={categories}
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
			<Dialog
				open={formOpen}
				onClose={() => setFormOpen(false)}
				maxWidth="md"
				fullWidth
			>
				<DialogTitle>
					{editingId ? "ویرایش دسته‌بندی" : "افزودن دسته‌بندی جدید"}
				</DialogTitle>
				<DialogContent>
					<div className="grid grid-cols-2 gap-4 mt-2">
						<TextField
							label="نامک (Slug)"
							value={form.slug}
							onChange={(e) => setForm({ ...form, slug: e.target.value })}
							fullWidth
							size="small"
							placeholder="movies-foreign"
						/>
						<FormControl fullWidth size="small">
							<InputLabel>نوع محتوا</InputLabel>
							<Select
								value={form.contentType}
								label="نوع محتوا"
								onChange={(e) =>
									setForm({ ...form, contentType: e.target.value })
								}
							>
								<MenuItem value="movie">فیلم</MenuItem>
								<MenuItem value="series">سریال</MenuItem>
								<MenuItem value="mixed">ترکیبی</MenuItem>
							</Select>
						</FormControl>
						<TextField
							label="نام فارسی"
							value={form.nameFa}
							onChange={(e) => setForm({ ...form, nameFa: e.target.value })}
							fullWidth
							size="small"
						/>
						<TextField
							label="نام انگلیسی"
							value={form.nameEn}
							onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
							fullWidth
							size="small"
						/>
						<TextField
							label="توضیح فارسی"
							value={form.descriptionFa}
							onChange={(e) =>
								setForm({ ...form, descriptionFa: e.target.value })
							}
							fullWidth
							size="small"
							multiline
							rows={2}
						/>
						<TextField
							label="توضیح انگلیسی"
							value={form.descriptionEn}
							onChange={(e) =>
								setForm({ ...form, descriptionEn: e.target.value })
							}
							fullWidth
							size="small"
							multiline
							rows={2}
						/>
						<TextField
							label="رنگ‌های گرادیان (با کاما)"
							value={gradientInput}
							onChange={(e) => setGradientInput(e.target.value)}
							fullWidth
							size="small"
							placeholder="#3B82F6, #1D4ED8"
						/>
						<TextField
							label="آیکون"
							value={form.icon}
							onChange={(e) => setForm({ ...form, icon: e.target.value })}
							fullWidth
							size="small"
							placeholder="film"
						/>
						<TextField
							label="لینک تصویر"
							value={form.imageUrl}
							onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
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
									checked={form.showEpisodes}
									onChange={(e) =>
										setForm({ ...form, showEpisodes: e.target.checked })
									}
								/>
							}
							label="نمایش قسمت‌ها"
						/>
						<FormControlLabel
							control={
								<Switch
									checked={form.isActive}
									onChange={(e) =>
										setForm({ ...form, isActive: e.target.checked })
									}
								/>
							}
							label="فعال"
						/>
					</div>
				</DialogContent>
				<DialogActions>
					<MuiButton onClick={() => setFormOpen(false)}>انصراف</MuiButton>
					<MuiButton
						variant="contained"
						onClick={handleSave}
						disabled={!form.slug || !form.nameEn || !form.nameFa}
					>
						{editingId ? "ذخیره تغییرات" : "ایجاد"}
					</MuiButton>
				</DialogActions>
			</Dialog>

			{/* Confirm Dialog */}
			<Dialog
				open={confirmDialog.open}
				onClose={() => handleConfirmClose(false)}
			>
				<DialogTitle>{confirmDialog.title}</DialogTitle>
				<DialogContent>
					<DialogContentText>{confirmDialog.message}</DialogContentText>
				</DialogContent>
				<DialogActions>
					<MuiButton onClick={() => handleConfirmClose(false)}>
						انصراف
					</MuiButton>
					<MuiButton
						onClick={() => handleConfirmClose(true)}
						color="error"
						variant="contained"
					>
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
					<Alert
						severity={feedback.type}
						variant="filled"
						onClose={() => setFeedback(null)}
					>
						{feedback.message}
					</Alert>
				) : undefined}
			</Snackbar>
		</div>
	);
}
