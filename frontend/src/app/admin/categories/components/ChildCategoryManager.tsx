"use client";

import { Edit, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { Button } from "@/components/admin/ui/button";
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
	IconButton,
	Box,
	Typography,
	Chip,
} from "@mui/material";
import { categoriesApi } from "@/lib/api/admin";
import { useTranslation } from "@/i18n";

interface ChildCategory {
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
	showInMenu: boolean;
	showInLanding: boolean;
	sortOrder: number;
	urlPath: string;
	parentId: string;
}

interface AllCategory {
	id: string;
	slug: string;
	nameEn: string;
	nameFa: string;
	parentId: string | null;
	sortOrder: number;
	isActive: boolean;
}

interface ChildCategoryManagerProps {
	parentId: string;
	parentName: string;
	open: boolean;
	onClose: () => void;
}

export default function ChildCategoryManager({
	parentId,
	parentName,
	open,
	onClose,
}: ChildCategoryManagerProps) {
	const { t } = useTranslation();
	const [children, setChildren] = useState<ChildCategory[]>([]);
	const [allCategories, setAllCategories] = useState<AllCategory[]>([]);
	const [loading, setLoading] = useState(false);
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

	// Add child dialog (link existing category)
	const [addOpen, setAddOpen] = useState(false);
	const [selectedCategoryId, setSelectedCategoryId] = useState("");
	const [addSortOrder, setAddSortOrder] = useState(0);
	const [addIsActive, setAddIsActive] = useState(true);

	// Edit dialog (edit existing child properties)
	const [editOpen, setEditOpen] = useState(false);
	const [editingChild, setEditingChild] = useState<ChildCategory | null>(null);
	const [editSortOrder, setEditSortOrder] = useState(0);
	const [editIsActive, setEditIsActive] = useState(true);

	// Load children when dialog opens or parentId changes
	useEffect(() => {
		if (open && parentId) {
			loadChildren();
			loadAllCategories();
		}
	}, [open, parentId]);

	const loadChildren = async () => {
		setLoading(true);
		try {
			const result = await categoriesApi.listChildren(parentId);
			setChildren(result.data || []);
		} catch (error: any) {
			setFeedback({
				type: "error",
				message: error?.response?.data?.message || t("admin.form.failedToLoad"),
			});
		} finally {
			setLoading(false);
		}
	};

	const loadAllCategories = async () => {
		try {
			const result = await categoriesApi.list();
			setAllCategories(result.data || []);
		} catch {
			// silent
		}
	};

	// Filtered: exclude current parent and already-assigned children
	const availableCategories = allCategories.filter(
		(cat) => cat.id !== parentId && !children.some((c) => c.id === cat.id),
	);

	const handleOpenAdd = () => {
		setSelectedCategoryId("");
		setAddSortOrder(children.length);
		setAddIsActive(true);
		setAddOpen(true);
	};

	const handleAddSubmit = async () => {
		if (!selectedCategoryId) return;
		try {
			await categoriesApi.linkAsChild(parentId, selectedCategoryId, addSortOrder, addIsActive);
			setFeedback({ type: "success", message: "زیردسته با موفقیت اضافه شد" });
			setAddOpen(false);
			loadChildren();
		} catch (error: any) {
			setFeedback({
				type: "error",
				message: error?.response?.data?.message || "خطا در افزودن زیردسته",
			});
		}
	};

	const handleOpenEdit = (child: ChildCategory) => {
		setEditingChild(child);
		setEditSortOrder(child.sortOrder);
		setEditIsActive(child.isActive);
		setEditOpen(true);
	};

	const handleEditSubmit = async () => {
		if (!editingChild) return;
		try {
			await categoriesApi.updateChild(parentId, editingChild.id, {
				sortOrder: editSortOrder,
				isActive: editIsActive,
			});
			setFeedback({ type: "success", message: t("admin.form.updateSuccess") });
			setEditOpen(false);
			loadChildren();
		} catch (error: any) {
			setFeedback({
				type: "error",
				message: error?.response?.data?.message || t("admin.form.updateFailed"),
			});
		}
	};

	const handleDelete = (id: string, name: string) => {
		setConfirmDialog({
			open: true,
			title: t("admin.form.confirmDelete"),
			message: `${t("admin.form.confirmDeleteMessage")} "${name}"?`,
			onConfirm: async () => {
				try {
					await categoriesApi.deleteChild(parentId, id);
					setFeedback({
						type: "success",
						message: t("admin.form.deleteSuccess"),
					});
					loadChildren();
				} catch (error: any) {
					setFeedback({
						type: "error",
						message: error?.response?.data?.message || t("admin.form.deleteFailed"),
					});
				}
			},
		});
	};

	const handleConfirmClose = (confirmed: boolean) => {
		if (confirmed) {
			confirmDialog.onConfirm();
		}
		setConfirmDialog({ open: false, title: "", message: "", onConfirm: () => {} });
	};

	const columnDefs: ColDef<ChildCategory>[] = [
		{
			headerName: t("admin.categories.namePersian"),
			field: "nameFa",
			flex: 1,
			minWidth: 150,
		},
		{
			headerName: t("admin.categories.nameEnglish"),
			field: "nameEn",
			flex: 1,
			minWidth: 150,
		},
		{
			headerName: t("admin.categories.slug"),
			field: "slug",
			flex: 1,
			minWidth: 150,
		},
		{
			headerName: t("admin.categories.sortOrder"),
			field: "sortOrder",
			width: 100,
		},
		{
			headerName: t("admin.categories.active"),
			field: "isActive",
			width: 90,
			cellRenderer: (params: ICellRendererParams<ChildCategory>) => (
				<Chip
					label={params.value ? t("admin.form.yes") : t("admin.form.no")}
					color={params.value ? "success" : "default"}
					size="small"
				/>
			),
		},
		{
			headerName: t("admin.content.actions"),
			width: 120,
			cellRenderer: (params: ICellRendererParams<ChildCategory>) => (
				<div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
					<IconButton
						size="small"
						color="primary"
						onClick={() => handleOpenEdit(params.data!)}
					>
						<Edit size={16} />
					</IconButton>
					<IconButton
						size="small"
						color="error"
						onClick={() => handleDelete(params.data!.id, params.data!.nameFa)}
					>
						<Trash2 size={16} />
					</IconButton>
				</div>
			),
		},
	];

	return (
		<>
			{/* Main dialog: shows existing children list */}
			<Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
				<DialogTitle>
					<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
						<Typography variant="h6">
							{t("admin.categories.manageChildCategories")}: {parentName}
						</Typography>
						<IconButton onClick={onClose}>
							<X />
						</IconButton>
					</Box>
				</DialogTitle>
				<DialogContent>
					<Box sx={{ mb: 2, mt: 1 }}>
						<Button onClick={handleOpenAdd}>
							<Plus className="mr-2 h-4 w-4" />
							{t("admin.categories.addChildCategory")}
						</Button>
					</Box>
					<div className="ag-theme-alpine" style={{ height: "500px", width: "100%" }}>
						<AgGridReact<ChildCategory>
							rowData={children}
							columnDefs={columnDefs}
							domLayout="normal"
							loading={loading}
							pagination={false}
							enableRtl={true}
							defaultColDef={{ sortable: true, resizable: true, filter: true }}
						/>
					</div>
				</DialogContent>
			</Dialog>

			{/* Add Child Dialog — select existing category + status + sort order */}
			<Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="xs" fullWidth>
				<DialogTitle>{t("admin.categories.addChildCategory")}</DialogTitle>
				<DialogContent>
					<Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
						<FormControl fullWidth size="small" required>
							<InputLabel>انتخاب دسته‌بندی</InputLabel>
							<Select
								value={selectedCategoryId}
								label="انتخاب دسته‌بندی"
								onChange={(e) => setSelectedCategoryId(e.target.value)}
							>
								{availableCategories.length === 0 ? (
									<MenuItem disabled value="">
										دسته‌ای موجود نیست
									</MenuItem>
								) : (
									availableCategories.map((cat) => (
										<MenuItem key={cat.id} value={cat.id}>
											{cat.nameFa} ({cat.nameEn})
										</MenuItem>
									))
								)}
							</Select>
						</FormControl>
						<FormControlLabel
							control={
								<Switch
									checked={addIsActive}
									onChange={(e) => setAddIsActive(e.target.checked)}
								/>
							}
							label={t("admin.categories.active")}
						/>
						<TextField
							label={t("admin.categories.sortOrder")}
							type="number"
							value={addSortOrder}
							onChange={(e) => setAddSortOrder(Number(e.target.value))}
							fullWidth
							size="small"
							inputProps={{ min: 0 }}
						/>
					</Box>
				</DialogContent>
				<DialogActions>
					<MuiButton onClick={() => setAddOpen(false)}>{t("admin.form.cancel")}</MuiButton>
					<MuiButton
						onClick={handleAddSubmit}
						variant="contained"
						disabled={!selectedCategoryId}
					>
						افزودن
					</MuiButton>
				</DialogActions>
			</Dialog>

			{/* Edit Child Dialog — only status + sort order */}
			{editingChild && (
				<Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="xs" fullWidth>
					<DialogTitle>
						{t("admin.categories.editChildCategory")}: {editingChild.nameFa}
					</DialogTitle>
					<DialogContent>
						<Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
							<FormControlLabel
								control={
									<Switch
										checked={editIsActive}
										onChange={(e) => setEditIsActive(e.target.checked)}
									/>
								}
								label={t("admin.categories.active")}
							/>
							<TextField
								label={t("admin.categories.sortOrder")}
								type="number"
								value={editSortOrder}
								onChange={(e) => setEditSortOrder(Number(e.target.value))}
								fullWidth
								size="small"
								inputProps={{ min: 0 }}
							/>
						</Box>
					</DialogContent>
					<DialogActions>
						<MuiButton onClick={() => setEditOpen(false)}>{t("admin.form.cancel")}</MuiButton>
						<MuiButton onClick={handleEditSubmit} variant="contained">
							{t("admin.form.update")}
						</MuiButton>
					</DialogActions>
				</Dialog>
			)}

			{/* Confirm Delete Dialog */}
			<Dialog open={confirmDialog.open} onClose={() => handleConfirmClose(false)}>
				<DialogTitle>{confirmDialog.title}</DialogTitle>
				<DialogContent>
					<DialogContentText>{confirmDialog.message}</DialogContentText>
				</DialogContent>
				<DialogActions>
					<MuiButton onClick={() => handleConfirmClose(false)}>
						{t("admin.form.cancel")}
					</MuiButton>
					<MuiButton onClick={() => handleConfirmClose(true)} color="error" variant="contained">
						{t("admin.form.delete")}
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
		</>
	);
}
