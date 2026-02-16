"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Library, Plus, Edit, Trash2, Eye, Search } from "lucide-react";
import { Button } from "@/components/admin/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/admin/ui/card";
import {
	TextField,
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
	Autocomplete,
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import type { ColDef } from "ag-grid-community";
import { collectionsApi, contentApi } from "@/lib/api/admin";
import { useTranslation } from "@/i18n";

interface Collection {
	id: string;
	slug: string;
	title: string;
	titleFa?: string;
	description?: string;
	descriptionFa?: string;
	posterUrl?: string;
	backdropUrl?: string;
	contentIds?: string[];
	isActive: boolean;
	sortOrder: number;
	createdAt?: string;
}

interface ContentOption {
	id: string;
	title: string;
	type: string;
}

export default function CollectionsPage() {
	const { t } = useTranslation();

	const [collections, setCollections] = useState<Collection[]>([]);
	const [loading, setLoading] = useState(true);
	const [feedback, setFeedback] = useState<{
		type: "success" | "error";
		message: string;
	} | null>(null);

	// Available content for picking
	const [contentOptions, setContentOptions] = useState<ContentOption[]>([]);
	const [contentSearch, setContentSearch] = useState("");

	// Form dialog
	const [formDialog, setFormDialog] = useState<{
		open: boolean;
		mode: "create" | "edit";
		collection: Collection | null;
	}>({ open: false, mode: "create", collection: null });

	const [formData, setFormData] = useState({
		slug: "",
		title: "",
		titleFa: "",
		description: "",
		descriptionFa: "",
		posterUrl: "",
		backdropUrl: "",
		contentIds: [] as string[],
		isActive: true,
		sortOrder: 0,
	});

	// Delete confirmation
	const [confirmDialog, setConfirmDialog] = useState<{
		open: boolean;
		id: string | null;
		title: string;
	}>({ open: false, id: null, title: "" });

	const fetchCollections = useCallback(async () => {
		try {
			setLoading(true);
			const res = await collectionsApi.list({ page: 1, limit: 100 });
			const list = res?.collections || res?.data || (Array.isArray(res) ? res : []);
			setCollections(list);
		} catch {
			setFeedback({ type: "error", message: "خطا در بارگذاری مجموعه‌ها" });
		} finally {
			setLoading(false);
		}
	}, []);

	const fetchContent = useCallback(async (search?: string) => {
		try {
			const res = await contentApi.list({ page: 1, limit: 50, search });
			const items = res.data || res.items || [];
			setContentOptions(
				items.map((c: any) => ({
					id: c.id,
					title: c.titleFa || c.title || c.id,
					type: c.type || "movie",
				})),
			);
		} catch {
			/* ignore */
		}
	}, []);

	useEffect(() => {
		fetchCollections();
		fetchContent();
	}, [fetchCollections, fetchContent]);

	const openCreateDialog = () => {
		setFormData({
			slug: "",
			title: "",
			titleFa: "",
			description: "",
			descriptionFa: "",
			posterUrl: "",
			backdropUrl: "",
			contentIds: [],
			isActive: true,
			sortOrder: 0,
		});
		setFormDialog({ open: true, mode: "create", collection: null });
	};

	const openEditDialog = (collection: Collection) => {
		setFormData({
			slug: collection.slug || "",
			title: collection.title || "",
			titleFa: collection.titleFa || "",
			description: collection.description || "",
			descriptionFa: collection.descriptionFa || "",
			posterUrl: collection.posterUrl || "",
			backdropUrl: collection.backdropUrl || "",
			contentIds: collection.contentIds || [],
			isActive: collection.isActive,
			sortOrder: collection.sortOrder || 0,
		});
		setFormDialog({ open: true, mode: "edit", collection });
	};

	const handleSave = async () => {
		try {
			if (formDialog.mode === "create") {
				await collectionsApi.create(formData);
				setFeedback({ type: "success", message: "مجموعه با موفقیت ایجاد شد" });
			} else if (formDialog.collection) {
				await collectionsApi.update(formDialog.collection.id, formData);
				setFeedback({ type: "success", message: "مجموعه با موفقیت بروزرسانی شد" });
			}
			setFormDialog({ open: false, mode: "create", collection: null });
			fetchCollections();
		} catch {
			setFeedback({ type: "error", message: "خطا در ذخیره مجموعه" });
		}
	};

	const handleDelete = async () => {
		if (!confirmDialog.id) return;
		try {
			await collectionsApi.delete(confirmDialog.id);
			setFeedback({ type: "success", message: "مجموعه حذف شد" });
			setConfirmDialog({ open: false, id: null, title: "" });
			fetchCollections();
		} catch {
			setFeedback({ type: "error", message: "خطا در حذف مجموعه" });
		}
	};

	const columnDefs = useMemo<ColDef[]>(
		() => [
			{
				headerName: "عنوان",
				field: "title",
				flex: 1,
				minWidth: 160,
				cellRenderer: (params: any) => (
					<div>
						<div className="font-semibold text-gray-900">
							{params.data.titleFa || params.data.title}
						</div>
						{params.data.titleFa && (
							<div className="text-xs text-gray-500">{params.data.title}</div>
						)}
					</div>
				),
			},
			{
				headerName: "شناسه",
				field: "slug",
				width: 140,
			},
			{
				headerName: "تعداد محتوا",
				field: "contentIds",
				width: 120,
				valueGetter: (params: any) =>
					params.data.contentIds?.length || 0,
			},
			{
				headerName: "ترتیب",
				field: "sortOrder",
				width: 90,
			},
			{
				headerName: "وضعیت",
				field: "isActive",
				width: 100,
				cellRenderer: (params: any) => (
					<Chip
						label={params.value ? "فعال" : "غیرفعال"}
						size="small"
						color={params.value ? "success" : "default"}
					/>
				),
			},
			{
				headerName: "عملیات",
				field: "id",
				width: 140,
				sortable: false,
				filter: false,
				cellRenderer: (params: any) => (
					<div className="flex items-center gap-1 h-full">
						<button
							type="button"
							className="p-1.5 rounded hover:bg-blue-50 text-blue-600"
							onClick={() => openEditDialog(params.data)}
							title="ویرایش"
						>
							<Edit size={16} />
						</button>
						<button
							type="button"
							className="p-1.5 rounded hover:bg-red-50 text-red-600"
							onClick={() =>
								setConfirmDialog({
									open: true,
									id: params.data.id,
									title: params.data.titleFa || params.data.title,
								})
							}
							title="حذف"
						>
							<Trash2 size={16} />
						</button>
					</div>
				),
			},
		],
		[],
	);

	return (
		<div className="space-y-6" dir="rtl">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<Library className="w-8 h-8 text-blue-600" />
					<div>
						<h1 className="text-2xl font-bold text-gray-900">مجموعه‌ها</h1>
						<p className="text-gray-600 text-sm">
							مدیریت مجموعه‌های محتوا
						</p>
					</div>
				</div>
				<Button onClick={openCreateDialog} className="gap-2">
					<Plus size={18} />
					ایجاد مجموعه جدید
				</Button>
			</div>

			{/* Feedback */}
			{feedback && (
				<Alert
					severity={feedback.type}
					onClose={() => setFeedback(null)}
					sx={{ mb: 2 }}
				>
					{feedback.message}
				</Alert>
			)}

			{/* Stats */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card>
					<CardContent className="p-4">
						<div className="text-sm text-gray-600">کل مجموعه‌ها</div>
						<div className="text-2xl font-bold text-gray-900">
							{collections.length}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<div className="text-sm text-gray-600">فعال</div>
						<div className="text-2xl font-bold text-green-600">
							{collections.filter((c) => c.isActive).length}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<div className="text-sm text-gray-600">کل محتوای اضافه‌شده</div>
						<div className="text-2xl font-bold text-blue-600">
							{collections.reduce(
								(sum, c) => sum + (c.contentIds?.length || 0),
								0,
							)}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Data Table */}
			<Card>
				<CardContent className="p-0">
					{loading ? (
						<div className="flex justify-center py-12">
							<CircularProgress />
						</div>
					) : (
						<div
							className="ag-theme-alpine"
							style={{ height: 500, width: "100%" }}
						>
							<AgGridReact
								rowData={collections}
								columnDefs={columnDefs}
								defaultColDef={{
									sortable: true,
									filter: true,
									resizable: true,
								}}
								pagination
								paginationPageSize={20}
								enableRtl={true}
								domLayout="normal"
								getRowId={(params) => params.data.id}
							/>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Create/Edit Dialog */}
			<Dialog
				open={formDialog.open}
				onClose={() =>
					setFormDialog({ open: false, mode: "create", collection: null })
				}
				maxWidth="md"
				fullWidth
			>
				<DialogTitle>
					{formDialog.mode === "create"
						? "ایجاد مجموعه جدید"
						: "ویرایش مجموعه"}
				</DialogTitle>
				<DialogContent>
					<div className="grid grid-cols-2 gap-4 mt-2">
						<TextField
							label="عنوان (انگلیسی)"
							value={formData.title}
							onChange={(e) =>
								setFormData({ ...formData, title: e.target.value })
							}
							fullWidth
							size="small"
						/>
						<TextField
							label="عنوان (فارسی)"
							value={formData.titleFa}
							onChange={(e) =>
								setFormData({ ...formData, titleFa: e.target.value })
							}
							fullWidth
							size="small"
						/>
						<TextField
							label="شناسه (slug)"
							value={formData.slug}
							onChange={(e) =>
								setFormData({ ...formData, slug: e.target.value })
							}
							fullWidth
							size="small"
						/>
						<TextField
							label="ترتیب نمایش"
							type="number"
							value={formData.sortOrder}
							onChange={(e) =>
								setFormData({
									...formData,
									sortOrder: Number(e.target.value),
								})
							}
							fullWidth
							size="small"
						/>
						<TextField
							label="توضیحات (انگلیسی)"
							value={formData.description}
							onChange={(e) =>
								setFormData({ ...formData, description: e.target.value })
							}
							fullWidth
							multiline
							rows={2}
							size="small"
							className="col-span-2"
						/>
						<TextField
							label="توضیحات (فارسی)"
							value={formData.descriptionFa}
							onChange={(e) =>
								setFormData({ ...formData, descriptionFa: e.target.value })
							}
							fullWidth
							multiline
							rows={2}
							size="small"
							className="col-span-2"
						/>
						<TextField
							label="تصویر پوستر (URL)"
							value={formData.posterUrl}
							onChange={(e) =>
								setFormData({ ...formData, posterUrl: e.target.value })
							}
							fullWidth
							size="small"
						/>
						<TextField
							label="تصویر پس‌زمینه (URL)"
							value={formData.backdropUrl}
							onChange={(e) =>
								setFormData({ ...formData, backdropUrl: e.target.value })
							}
							fullWidth
							size="small"
						/>
					</div>

					{/* Content picker */}
					<div className="mt-4">
						<Autocomplete
							multiple
							options={contentOptions}
							getOptionLabel={(option) =>
								`${option.title} (${option.type})`
							}
							value={contentOptions.filter((c) =>
								formData.contentIds.includes(c.id),
							)}
							onChange={(_, newValue) =>
								setFormData({
									...formData,
									contentIds: newValue.map((v) => v.id),
								})
							}
							onInputChange={(_, value) => {
								setContentSearch(value);
								if (value.length >= 2) fetchContent(value);
							}}
							renderInput={(params) => (
								<TextField
									{...params}
									label="محتوای مجموعه"
									placeholder="جستجوی محتوا..."
									size="small"
								/>
							)}
							renderTags={(value, getTagProps) =>
								value.map((option, index) => {
									const { key, ...tagProps } = getTagProps({ index });
									return (
										<Chip
											key={key}
											label={option.title}
											size="small"
											{...tagProps}
										/>
									);
								})
							}
							isOptionEqualToValue={(option, value) =>
								option.id === value.id
							}
							noOptionsText="محتوایی یافت نشد"
						/>
					</div>

					<div className="mt-4">
						<FormControlLabel
							control={
								<Switch
									checked={formData.isActive}
									onChange={(e) =>
										setFormData({
											...formData,
											isActive: e.target.checked,
										})
									}
								/>
							}
							label="فعال"
						/>
					</div>
				</DialogContent>
				<DialogActions>
					<MuiButton
						onClick={() =>
							setFormDialog({
								open: false,
								mode: "create",
								collection: null,
							})
						}
					>
						انصراف
					</MuiButton>
					<MuiButton
						variant="contained"
						onClick={handleSave}
						disabled={!formData.title || !formData.slug}
					>
						{formDialog.mode === "create" ? "ایجاد" : "بروزرسانی"}
					</MuiButton>
				</DialogActions>
			</Dialog>

			{/* Delete Confirm Dialog */}
			<Dialog
				open={confirmDialog.open}
				onClose={() =>
					setConfirmDialog({ open: false, id: null, title: "" })
				}
			>
				<DialogTitle>حذف مجموعه</DialogTitle>
				<DialogContent>
					<DialogContentText>
						آیا مطمئنید که می‌خواهید مجموعه &quot;{confirmDialog.title}&quot;
						را حذف کنید؟
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<MuiButton
						onClick={() =>
							setConfirmDialog({ open: false, id: null, title: "" })
						}
					>
						انصراف
					</MuiButton>
					<MuiButton
						variant="contained"
						color="error"
						onClick={handleDelete}
					>
						حذف
					</MuiButton>
				</DialogActions>
			</Dialog>
		</div>
	);
}
