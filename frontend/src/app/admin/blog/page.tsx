"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { BookOpen, Plus, Edit, Trash2, Eye, TrendingUp } from "lucide-react";
import { Button } from "@/components/admin/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/admin/ui/card";
import {
	TextField,
	Select,
	MenuItem,
	InputLabel,
	FormControl,
	Chip,
	CircularProgress,
	Alert,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button as MuiButton,
	FormControlLabel,
	Switch,
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import type { ColDef } from "ag-grid-community";
import { blogApi } from "@/lib/api/admin";
import { useTranslation } from "@/i18n";

export default function BlogPage() {
	const { t } = useTranslation();
	const [posts, setPosts] = useState<any[]>([]);
	const [stats, setStats] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [limit] = useState(50);
	const [total, setTotal] = useState(0);
	const [totalPages, setTotalPages] = useState(1);
	
	// Filters
	const [statusFilter, setStatusFilter] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("");
	const [search, setSearch] = useState("");
	
	// Form dialog
	const [formDialog, setFormDialog] = useState<{
		open: boolean;
		mode: "create" | "edit";
		post: any | null;
	}>({
		open: false,
		mode: "create",
		post: null,
	});
	
	const [formData, setFormData] = useState({
		title: "",
		slug: "",
		excerpt: "",
		content: "",
		coverImage: "",
		status: "draft",
		category: "news",
		tags: [] as string[],
		scheduledAt: "",
		isFeatured: false,
		metaTitle: "",
		metaDescription: "",
		metaKeywords: [] as string[],
	});
	
	const [feedback, setFeedback] = useState<{
		type: "success" | "error";
		message: string;
	} | null>(null);

	// Confirm dialog
	const [confirmDialog, setConfirmDialog] = useState<{
		open: boolean;
		title: string;
		message: string;
		onConfirm: () => void;
	}>({ open: false, title: "", message: "", onConfirm: () => {} });

	const fetchPosts = useCallback(async () => {
		setLoading(true);
		try {
			const params: any = { page, limit };
			if (statusFilter) params.status = statusFilter;
			if (categoryFilter) params.category = categoryFilter;
			if (search) params.search = search;
			
			const data = await blogApi.list(params);
			setPosts(data.posts || []);
			setTotal(data.total || 0);
			setTotalPages(data.totalPages || 1);
		} catch (error: any) {
			setFeedback({
				type: "error",
				message: error.response?.data?.message || "خطا در بارگذاری مقالات",
			});
		} finally {
			setLoading(false);
		}
	}, [page, limit, statusFilter, categoryFilter, search]);

	const fetchStats = useCallback(async () => {
		try {
			const data = await blogApi.getStats();
			setStats(data);
		} catch (error) {
			console.error("Failed to fetch stats:", error);
		}
	}, []);

	useEffect(() => {
		fetchPosts();
		fetchStats();
	}, [fetchPosts, fetchStats]);

	const openCreateDialog = () => {
		setFormData({
			title: "",
			slug: "",
			excerpt: "",
			content: "",
			coverImage: "",
			status: "draft",
			category: "news",
			tags: [],
			scheduledAt: "",
			isFeatured: false,
			metaTitle: "",
			metaDescription: "",
			metaKeywords: [],
		});
		setFormDialog({ open: true, mode: "create", post: null });
	};

	const openEditDialog = (post: any) => {
		setFormData({
			title: post.title,
			slug: post.slug,
			excerpt: post.excerpt,
			content: post.content,
			coverImage: post.coverImage || "",
			status: post.status,
			category: post.category,
			tags: post.tags || [],
			scheduledAt: post.scheduledAt ? new Date(post.scheduledAt).toISOString().slice(0, 16) : "",
			isFeatured: post.isFeatured,
			metaTitle: post.metaTitle || "",
			metaDescription: post.metaDescription || "",
			metaKeywords: post.metaKeywords || [],
		});
		setFormDialog({ open: true, mode: "edit", post });
	};

	const handleSubmit = async () => {
		try {
			const payload = {
				...formData,
				scheduledAt: formData.scheduledAt ? new Date(formData.scheduledAt).toISOString() : undefined,
				coverImage: formData.coverImage || undefined,
				tags: formData.tags.length > 0 ? formData.tags : undefined,
				metaKeywords: formData.metaKeywords.length > 0 ? formData.metaKeywords : undefined,
				metaTitle: formData.metaTitle || undefined,
				metaDescription: formData.metaDescription || undefined,
			};

			if (formDialog.mode === "create") {
				await blogApi.create(payload);
				setFeedback({ type: "success", message: "مقاله با موفقیت ایجاد شد" });
			} else {
				await blogApi.update(formDialog.post.id, payload);
				setFeedback({ type: "success", message: "مقاله با موفقیت بروزرسانی شد" });
			}
			
			setFormDialog({ open: false, mode: "create", post: null });
			fetchPosts();
			fetchStats();
		} catch (error: any) {
			setFeedback({
				type: "error",
				message: error.response?.data?.message || "خطا در ذخیره مقاله",
			});
		}
	};

	const handleDelete = async (id: string) => {
		setConfirmDialog({
			open: true,
			title: "حذف مقاله",
			message: "آیا مطمئن هستید که می‌خواهید این مقاله را حذف کنید؟",
			onConfirm: async () => {
				setConfirmDialog({ open: false, title: "", message: "", onConfirm: () => {} });
				try {
					await blogApi.delete(id);
					setFeedback({ type: "success", message: "مقاله حذف شد" });
					fetchPosts();
					fetchStats();
				} catch (error: any) {
					setFeedback({
						type: "error",
						message: error.response?.data?.message || "خطا در حذف مقاله",
					});
				}
			},
		});
	};

	const generateSlug = (title: string) => {
		return title
			.toLowerCase()
			.replace(/[^a-z0-9\u0600-\u06FF\s-]/g, "")
			.replace(/\s+/g, "-")
			.replace(/-+/g, "-")
			.trim();
	};

	const StatusCellRenderer = (props: any) => {
		const status = props.value;
		const colorMap: Record<string, "default" | "warning" | "success" | "info"> = {
			draft: "default",
			published: "success",
			scheduled: "info",
			archived: "warning",
		};
		
		return (
			<Chip
				label={t(`admin.blog.status.${status}`)}
				color={colorMap[status] || "default"}
				size="small"
				variant="outlined"
			/>
		);
	};

	const CategoryCellRenderer = (props: any) => {
		return (
			<Chip
				label={t(`admin.blog.category.${props.value}`)}
				size="small"
			/>
		);
	};

	const ActionsCellRenderer = (props: any) => {
		const post = props.data;
		
		return (
			<div className="flex items-center gap-1">
				<MuiButton
					size="small"
					onClick={() => openEditDialog(post)}
					startIcon={<Edit className="w-3 h-3" />}
				>
					ویرایش
				</MuiButton>
				<MuiButton
					size="small"
					color="error"
					onClick={() => handleDelete(post.id)}
					startIcon={<Trash2 className="w-3 h-3" />}
				>
					حذف
				</MuiButton>
			</div>
		);
	};

	const columnDefs: ColDef[] = useMemo(
		() => [
			{
				headerName: t("admin.blog.title"),
				field: "title",
				flex: 2,
				cellRenderer: (props: any) => (
					<div className="py-2">
						<p className="font-medium">{props.value}</p>
						<p className="text-xs text-gray-500">{props.data.slug}</p>
					</div>
				),
			},
			{
				headerName: t("admin.blog.category.label"),
				field: "category",
				cellRenderer: CategoryCellRenderer,
				width: 150,
			},
			{
				headerName: t("admin.blog.author"),
				field: "author",
				width: 150,
				cellRenderer: (props: any) => props.value?.name || "ناشناس",
			},
			{
				headerName: t("admin.blog.status.label"),
				field: "status",
				cellRenderer: StatusCellRenderer,
				width: 120,
			},
			{
				headerName: t("admin.blog.views"),
				field: "viewsCount",
				width: 100,
				cellRenderer: (props: any) => (
					<div className="flex items-center gap-1">
						<Eye className="w-3 h-3" />
						{props.value}
					</div>
				),
			},
			{
				headerName: t("admin.blog.likes"),
				field: "likesCount",
				width: 100,
			},
			{
				headerName: t("admin.blog.date"),
				field: "createdAt",
				width: 150,
				cellRenderer: (props: any) => new Date(props.value).toLocaleDateString("fa-IR"),
			},
			{
				headerName: t("admin.blog.actions"),
				field: "actions",
				cellRenderer: ActionsCellRenderer,
				width: 200,
				sortable: false,
				filter: false,
			},
		],
		[t]
	);

	return (
		<div className="space-y-4 sm:space-y-6">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
						<BookOpen className="w-6 h-6 sm:w-8 sm:h-8" />
						{t("admin.blog.title")}
					</h1>
					<p className="text-sm text-gray-600 mt-1 sm:mt-2">{t("admin.blog.description")}</p>
				</div>
				<Button onClick={openCreateDialog}>
					<Plus className="w-4 h-4 ml-2" />
					{t("admin.blog.createNew")}
				</Button>
			</div>

			{/* Statistics Cards */}
			{stats && (
				<div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-sm font-medium text-gray-600">
								کل مقالات
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stats.total}</div>
						</CardContent>
					</Card>
					
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-sm font-medium text-gray-600">
								پیش‌نویس
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stats.draft}</div>
						</CardContent>
					</Card>
					
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-sm font-medium text-green-600">
								منتشر شده
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-green-600">{stats.published}</div>
						</CardContent>
					</Card>
					
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-sm font-medium text-blue-600">
								کل بازدید
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-blue-600">{stats.totalViews}</div>
						</CardContent>
					</Card>
					
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-sm font-medium text-purple-600">
								کل لایک
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-purple-600">{stats.totalLikes}</div>
						</CardContent>
					</Card>
				</div>
			)}

			{feedback && (
				<Alert
					severity={feedback.type}
					onClose={() => setFeedback(null)}
				>
					{feedback.message}
				</Alert>
			)}

			{/* Filters */}
			<Card>
				<CardContent className="pt-6">
					<div className="flex flex-wrap gap-3 items-end">
						<TextField
							size="small"
							label={t("admin.blog.search")}
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							sx={{ minWidth: 250 }}
						/>
						
						<FormControl size="small" sx={{ minWidth: 150 }}>
							<InputLabel>{t("admin.blog.status.label")}</InputLabel>
							<Select
								value={statusFilter}
								label={t("admin.blog.status.label")}
								onChange={(e) => setStatusFilter(e.target.value)}
							>
								<MenuItem value="">همه</MenuItem>
								<MenuItem value="draft">پیش‌نویس</MenuItem>
								<MenuItem value="published">منتشر شده</MenuItem>
								<MenuItem value="scheduled">زمان‌بندی شده</MenuItem>
								<MenuItem value="archived">بایگانی</MenuItem>
							</Select>
						</FormControl>

						<FormControl size="small" sx={{ minWidth: 150 }}>
							<InputLabel>{t("admin.blog.category.label")}</InputLabel>
							<Select
								value={categoryFilter}
								label={t("admin.blog.category.label")}
								onChange={(e) => setCategoryFilter(e.target.value)}
							>
								<MenuItem value="">همه</MenuItem>
								<MenuItem value="news">اخبار</MenuItem>
								<MenuItem value="reviews">نقد و بررسی</MenuItem>
								<MenuItem value="interviews">مصاحبه</MenuItem>
								<MenuItem value="behind_scenes">پشت صحنه</MenuItem>
								<MenuItem value="industry">صنعت</MenuItem>
								<MenuItem value="technology">تکنولوژی</MenuItem>
								<MenuItem value="opinion">نظر</MenuItem>
								<MenuItem value="tutorials">آموزش</MenuItem>
							</Select>
						</FormControl>

						<Button onClick={fetchPosts} disabled={loading}>
							{loading && <CircularProgress size={16} sx={{ mr: 1 }} />}
							{t("admin.blog.refresh")}
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* AG Grid */}
			<Card>
				<CardContent className="p-0">
					<div
						className="ag-theme-alpine overflow-x-auto"
						style={{ height: "min(600px, 70vh)", width: "100%" }}
					>
						<AgGridReact
							rowData={posts}
							columnDefs={columnDefs}
							pagination={false}
							rowHeight={80}
							headerHeight={50}
							domLayout="normal"
							loading={loading}
							enableRtl={true}
						/>
					</div>
				</CardContent>
			</Card>

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="flex items-center justify-center gap-2">
					<Button
						onClick={() => setPage((p) => Math.max(1, p - 1))}
						disabled={page === 1 || loading}
						size="sm"
					>
						قبلی
					</Button>
					<span className="text-sm text-gray-600">
						صفحه {page} از {totalPages}
					</span>
					<Button
						onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
						disabled={page === totalPages || loading}
						size="sm"
					>
						بعدی
					</Button>
				</div>
			)}

			{/* Form Dialog */}
			<Dialog
				open={formDialog.open}
				onClose={() => setFormDialog({ open: false, mode: "create", post: null })}
				maxWidth="md"
				fullWidth
			>
				<DialogTitle>
					{formDialog.mode === "create" ? "ایجاد مقاله جدید" : "ویرایش مقاله"}
				</DialogTitle>
				<DialogContent>
					<div className="space-y-4 pt-4">
						<TextField
							fullWidth
							label="عنوان"
							value={formData.title}
							onChange={(e) => {
								setFormData({ ...formData, title: e.target.value });
								if (formDialog.mode === "create") {
									setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) });
								}
							}}
						/>
						
						<TextField
							fullWidth
							label="اسلاگ (URL)"
							value={formData.slug}
							onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
						/>
						
						<TextField
							fullWidth
							multiline
							rows={2}
							label="خلاصه"
							value={formData.excerpt}
							onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
						/>
						
						<TextField
							fullWidth
							multiline
							rows={6}
							label="محتوا"
							value={formData.content}
							onChange={(e) => setFormData({ ...formData, content: e.target.value })}
						/>
						
						<TextField
							fullWidth
							label="تصویر کاور (URL)"
							value={formData.coverImage}
							onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
						/>
						
						<div className="grid grid-cols-2 gap-4">
							<FormControl fullWidth>
								<InputLabel>وضعیت</InputLabel>
								<Select
									value={formData.status}
									label="وضعیت"
									onChange={(e) => setFormData({ ...formData, status: e.target.value })}
								>
									<MenuItem value="draft">پیش‌نویس</MenuItem>
									<MenuItem value="published">منتشر شده</MenuItem>
									<MenuItem value="scheduled">زمان‌بندی شده</MenuItem>
									<MenuItem value="archived">بایگانی</MenuItem>
								</Select>
							</FormControl>
							
							<FormControl fullWidth>
								<InputLabel>دسته‌بندی</InputLabel>
								<Select
									value={formData.category}
									label="دسته‌بندی"
									onChange={(e) => setFormData({ ...formData, category: e.target.value })}
								>
									<MenuItem value="news">اخبار</MenuItem>
									<MenuItem value="reviews">نقد و بررسی</MenuItem>
									<MenuItem value="interviews">مصاحبه</MenuItem>
									<MenuItem value="behind_scenes">پشت صحنه</MenuItem>
									<MenuItem value="industry">صنعت</MenuItem>
									<MenuItem value="technology">تکنولوژی</MenuItem>
									<MenuItem value="opinion">نظر</MenuItem>
									<MenuItem value="tutorials">آموزش</MenuItem>
								</Select>
							</FormControl>
						</div>
						
						<TextField
							fullWidth
							label="برچسب‌ها (با کاما جدا کنید)"
							value={formData.tags.join(", ")}
							onChange={(e) => setFormData({ 
								...formData, 
								tags: e.target.value.split(",").map(t => t.trim()).filter(t => t) 
							})}
						/>
						
						{formData.status === "scheduled" && (
							<TextField
								fullWidth
								type="datetime-local"
								label="زمان انتشار"
								value={formData.scheduledAt}
								onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
								InputLabelProps={{ shrink: true }}
							/>
						)}
						
						<FormControlLabel
							control={
								<Switch
									checked={formData.isFeatured}
									onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
								/>
							}
							label="مقاله ویژه"
						/>
					</div>
				</DialogContent>
				<DialogActions>
					<MuiButton onClick={() => setFormDialog({ open: false, mode: "create", post: null })}>
						انصراف
					</MuiButton>
					<MuiButton
						onClick={handleSubmit}
						variant="contained"
						disabled={!formData.title || !formData.slug || !formData.excerpt || !formData.content}
					>
						{formDialog.mode === "create" ? "ایجاد" : "بروزرسانی"}
					</MuiButton>
				</DialogActions>
			</Dialog>

			{/* Confirm Dialog */}
			<Dialog
				open={confirmDialog.open}
				onClose={() => setConfirmDialog({ open: false, title: "", message: "", onConfirm: () => {} })}
			>
				<DialogTitle>{confirmDialog.title}</DialogTitle>
				<DialogContent>
					<DialogContentText>{confirmDialog.message}</DialogContentText>
				</DialogContent>
				<DialogActions>
					<MuiButton onClick={() => setConfirmDialog({ open: false, title: "", message: "", onConfirm: () => {} })}>
						انصراف
					</MuiButton>
					<MuiButton onClick={confirmDialog.onConfirm} color="error" variant="contained">
						حذف
					</MuiButton>
				</DialogActions>
			</Dialog>
		</div>
	);
}
