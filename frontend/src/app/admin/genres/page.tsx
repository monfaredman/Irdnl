"use client";

import { Edit, Plus, Trash2, Tags } from "lucide-react";
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
	Chip,
	Autocomplete,
} from "@mui/material";
import { genresApi, categoriesApi } from "@/lib/api/admin";

interface GenreItem {
	id: string;
	slug: string;
	nameEn: string;
	nameFa: string;
	tmdbGenreId: string | null;
	categorySlugs: string[];
	posterUrl: string | null;
	logoUrl: string | null;
	backdropUrl: string | null;
	isActive: boolean;
	sortOrder: number;
}

interface CategoryOption {
	slug: string;
	nameFa: string;
	nameEn: string;
}

const emptyForm = {
	slug: "",
	nameEn: "",
	nameFa: "",
	tmdbGenreId: "",
	categorySlugs: [] as string[],
	posterUrl: "",
	logoUrl: "",
	backdropUrl: "",
	isActive: true,
	sortOrder: 0,
};

export default function GenresPage() {
	const [genres, setGenres] = useState<GenreItem[]>([]);
	const [categories, setCategories] = useState<CategoryOption[]>([]);
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
	const [filterCategory, setFilterCategory] = useState("");

	const fetchGenres = async () => {
		setLoading(true);
		try {
			const res = await genresApi.list(filterCategory || undefined);
			setGenres(res.data || []);
		} catch {
			showFeedback("error", "خطا در دریافت ژانرها");
		} finally {
			setLoading(false);
		}
	};

	const fetchCategories = async () => {
		try {
			const res = await categoriesApi.list();
			setCategories(
				(res.data || []).map((c: any) => ({
					slug: c.slug,
					nameFa: c.nameFa,
					nameEn: c.nameEn,
				})),
			);
		} catch {
			/* silent */
		}
	};

	useEffect(() => {
		fetchCategories();
	}, []);

	useEffect(() => {
		fetchGenres();
	}, [filterCategory]);

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

	const openEditForm = (g: GenreItem) => {
		setEditingId(g.id);
		setForm({
			slug: g.slug,
			nameEn: g.nameEn,
			nameFa: g.nameFa,
			tmdbGenreId: g.tmdbGenreId || "",
			categorySlugs: g.categorySlugs || [],
			posterUrl: g.posterUrl || "",
			logoUrl: g.logoUrl || "",
			backdropUrl: g.backdropUrl || "",
			isActive: g.isActive,
			sortOrder: g.sortOrder,
		});
		setFormOpen(true);
	};

	const handleSave = async () => {
		try {
			const payload = {
				...form,
				tmdbGenreId: form.tmdbGenreId || undefined,
				posterUrl: form.posterUrl || undefined,
				logoUrl: form.logoUrl || undefined,
				backdropUrl: form.backdropUrl || undefined,
			};
			if (editingId) {
				await genresApi.update(editingId, payload);
				showFeedback("success", "ژانر با موفقیت ویرایش شد");
			} else {
				await genresApi.create(payload);
				showFeedback("success", "ژانر با موفقیت ایجاد شد");
			}
			setFormOpen(false);
			fetchGenres();
		} catch (e: any) {
			showFeedback("error", e?.response?.data?.message || "خطا در ذخیره ژانر");
		}
	};

	const handleDelete = (g: GenreItem) => {
		showConfirm("حذف ژانر", `آیا از حذف "${g.nameFa}" مطمئن هستید؟`, async () => {
			try {
				await genresApi.delete(g.id);
				showFeedback("success", "ژانر حذف شد");
				fetchGenres();
			} catch {
				showFeedback("error", "خطا در حذف ژانر");
			}
		});
	};

	const handleToggleActive = async (g: GenreItem) => {
		try {
			await genresApi.update(g.id, { isActive: !g.isActive });
			fetchGenres();
		} catch {
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
			headerName: "نامک",
			width: 150,
			sortable: true,
			filter: true,
			cellRenderer: (params: any) => (
				<span className="font-mono text-xs">{params.value}</span>
			),
		},
		{
			field: "posterUrl",
			headerName: "پوستر",
			width: 100,
			sortable: false,
			filter: false,
			cellRenderer: (params: any) => {
				const url = params.value;
				return url ? (
					<img src={url} alt="Poster" className="w-10 h-14 object-cover rounded" />
				) : (
					<span className="text-xs text-gray-400">—</span>
				);
			},
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
			field: "tmdbGenreId",
			headerName: "TMDB ID",
			width: 120,
			sortable: true,
			filter: true,
			cellRenderer: (params: any) => (
				<span className="font-mono text-xs">{params.value || "—"}</span>
			),
		},
		{
			field: "categorySlugs",
			headerName: "دسته‌بندی‌ها",
			width: 220,
			sortable: false,
			filter: false,
			cellRenderer: (params: any) => {
				const slugs = params.value || [];
				return (
					<div className="flex flex-wrap gap-1 max-w-[200px]">
						{slugs.slice(0, 3).map((slug: string) => (
							<Chip key={slug} label={slug} size="small" variant="outlined" />
						))}
						{slugs.length > 3 && (
							<Chip
								label={`+${slugs.length - 3}`}
								size="small"
								variant="outlined"
							/>
						)}
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
				const genre = params.data;
				return (
					<Switch
						size="small"
						checked={params.value}
						onChange={() => handleToggleActive(genre)}
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
				const genre = params.data;
				return (
					<div className="flex gap-1">
						<Button variant="ghost" size="sm" onClick={() => openEditForm(genre)}>
							<Edit className="h-4 w-4" />
						</Button>
						<Button variant="ghost" size="sm" onClick={() => handleDelete(genre)}>
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
						<Tags className="h-6 w-6" />
						مدیریت ژانرها
					</h1>
					<p className="text-gray-500 mt-1">
						ژانرهای محتوا (اکشن، درام، کمدی و ...)
					</p>
				</div>
				<Button onClick={openCreateForm}>
					<Plus className="ml-2 h-4 w-4" />
					افزودن ژانر
				</Button>
			</div>

			{/* Filter by category */}
			<Card>
				<CardContent className="pt-4">
					<div className="flex items-center gap-4">
						<span className="text-sm font-medium text-gray-700">فیلتر بر اساس دسته‌بندی:</span>
						<div className="flex flex-wrap gap-2">
							<Chip
								label="همه"
								variant={filterCategory === "" ? "filled" : "outlined"}
								color={filterCategory === "" ? "primary" : "default"}
								onClick={() => setFilterCategory("")}
								size="small"
							/>
							{categories.map((cat) => (
								<Chip
									key={cat.slug}
									label={cat.nameFa}
									variant={filterCategory === cat.slug ? "filled" : "outlined"}
									color={filterCategory === cat.slug ? "primary" : "default"}
									onClick={() => setFilterCategory(cat.slug)}
									size="small"
								/>
							))}
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>ژانرها ({genres.length})</CardTitle>
				</CardHeader>
				<CardContent>
					{loading ? (
						<p className="text-center py-8 text-gray-500">در حال بارگذاری...</p>
					) : genres.length === 0 ? (
						<p className="text-center py-8 text-gray-500">ژانری یافت نشد</p>
					) : (
						<div className="ag-theme-alpine" style={{ height: 600, width: "100%" }} dir="rtl">
							<AgGridReact
								rowData={genres}
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
				<DialogTitle>{editingId ? "ویرایش ژانر" : "افزودن ژانر جدید"}</DialogTitle>
				<DialogContent>
					<div className="grid grid-cols-2 gap-4 mt-2">
						<TextField
							label="نامک (Slug)"
							value={form.slug}
							onChange={(e) => setForm({ ...form, slug: e.target.value })}
							fullWidth
							size="small"
							placeholder="action"
						/>
						<TextField
							label="TMDB Genre ID"
							value={form.tmdbGenreId}
							onChange={(e) => setForm({ ...form, tmdbGenreId: e.target.value })}
							fullWidth
							size="small"
							placeholder="28"
						/>
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
						<div className="col-span-2">
							<Autocomplete
								multiple
								options={categories.map((c) => c.slug)}
								value={form.categorySlugs}
								onChange={(_, v) => setForm({ ...form, categorySlugs: v })}
								getOptionLabel={(slug) => {
									const cat = categories.find((c) => c.slug === slug);
									return cat ? `${cat.nameFa} (${slug})` : slug;
								}}
								renderInput={(params) => (
									<TextField {...params} label="دسته‌بندی‌ها" size="small" />
								)}
								size="small"
							/>
						</div>
						<TextField
							label="لینک تصویر پوستر (Poster URL)"
							value={form.posterUrl}
							onChange={(e) => setForm({ ...form, posterUrl: e.target.value })}
							fullWidth
							size="small"
							placeholder="https://image.tmdb.org/t/p/original/..."
						/>
						<TextField
							label="لینک لوگو (Logo URL)"
							value={form.logoUrl}
							onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
							fullWidth
							size="small"
							placeholder="https://image.tmdb.org/t/p/original/..."
						/>
						<div className="col-span-2">
							<TextField
								label="لینک تصویر پس‌زمینه (Backdrop URL)"
								value={form.backdropUrl}
								onChange={(e) => setForm({ ...form, backdropUrl: e.target.value })}
								fullWidth
								size="small"
								placeholder="https://image.tmdb.org/t/p/original/..."
							/>
						</div>
						{/* Image Previews */}
						{(form.posterUrl || form.logoUrl || form.backdropUrl) && (
							<div className="col-span-2 flex gap-4 flex-wrap">
								{form.posterUrl && (
									<div className="text-center">
										<p className="text-xs text-gray-500 mb-1">پوستر</p>
										<img src={form.posterUrl} alt="Poster" className="h-24 rounded object-cover" />
									</div>
								)}
								{form.logoUrl && (
									<div className="text-center">
										<p className="text-xs text-gray-500 mb-1">لوگو</p>
										<img src={form.logoUrl} alt="Logo" className="h-24 rounded object-contain" />
									</div>
								)}
								{form.backdropUrl && (
									<div className="text-center">
										<p className="text-xs text-gray-500 mb-1">پس‌زمینه</p>
										<img src={form.backdropUrl} alt="Backdrop" className="h-24 rounded object-cover" />
									</div>
								)}
							</div>
						)}
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
