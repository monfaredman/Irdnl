"use client";

import { Edit, Plus, Trash2, Tags } from "lucide-react";
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
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>ترتیب</TableHead>
									<TableHead>نامک</TableHead>
									<TableHead>نام فارسی</TableHead>
									<TableHead>نام انگلیسی</TableHead>
									<TableHead>TMDB ID</TableHead>
									<TableHead>دسته‌بندی‌ها</TableHead>
									<TableHead>وضعیت</TableHead>
									<TableHead>عملیات</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{genres.map((g) => (
									<TableRow key={g.id}>
										<TableCell>{g.sortOrder}</TableCell>
										<TableCell className="font-mono text-xs">{g.slug}</TableCell>
										<TableCell className="font-medium">{g.nameFa}</TableCell>
										<TableCell>{g.nameEn}</TableCell>
										<TableCell className="font-mono text-xs">
											{g.tmdbGenreId || "—"}
										</TableCell>
										<TableCell>
											<div className="flex flex-wrap gap-1 max-w-[200px]">
												{(g.categorySlugs || []).slice(0, 3).map((slug) => (
													<Chip key={slug} label={slug} size="small" variant="outlined" />
												))}
												{(g.categorySlugs || []).length > 3 && (
													<Chip
														label={`+${(g.categorySlugs || []).length - 3}`}
														size="small"
														variant="outlined"
													/>
												)}
											</div>
										</TableCell>
										<TableCell>
											<Switch
												size="small"
												checked={g.isActive}
												onChange={() => handleToggleActive(g)}
											/>
										</TableCell>
										<TableCell>
											<div className="flex gap-1">
												<Button variant="ghost" size="sm" onClick={() => openEditForm(g)}>
													<Edit className="h-4 w-4" />
												</Button>
												<Button variant="ghost" size="sm" onClick={() => handleDelete(g)}>
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
