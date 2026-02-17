"use client";

import { Edit, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
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

const emptyForm: Omit<ChildCategory, "id"> = {
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
	showInMenu: true,
	showInLanding: false,
	sortOrder: 0,
	urlPath: "",
	parentId: "",
};

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

	// Form dialog
	const [formOpen, setFormOpen] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [form, setForm] = useState(emptyForm);

	// Load children when dialog opens or parentId changes
	useEffect(() => {
		if (open && parentId) {
			loadChildren();
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

	const handleAdd = () => {
		setEditingId(null);
		setForm({ ...emptyForm, parentId });
		setFormOpen(true);
	};

	const handleEdit = (id: string) => {
		const item = children.find((c) => c.id === id);
		if (item) {
			setEditingId(id);
			setForm(item);
			setFormOpen(true);
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

	const handleFormSubmit = async () => {
		try {
			if (editingId) {
				await categoriesApi.updateChild(parentId, editingId, form);
				setFeedback({
					type: "success",
					message: t("admin.form.updateSuccess"),
				});
			} else {
				await categoriesApi.createChild(parentId, { ...form, parentId });
				setFeedback({
					type: "success",
					message: t("admin.form.createSuccess"),
				});
			}
			setFormOpen(false);
			loadChildren();
		} catch (error: any) {
			setFeedback({
				type: "error",
				message:
					error?.response?.data?.message ||
					(editingId ? t("admin.form.updateFailed") : t("admin.form.createFailed")),
			});
		}
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
			headerName: t("admin.categories.urlPath"),
			field: "urlPath",
			flex: 1,
			minWidth: 120,
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
						onClick={() => handleEdit(params.data!.id)}
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
			<Dialog
				open={open}
				onClose={onClose}
				maxWidth="lg"
				fullWidth
			>
				<DialogTitle>
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
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
						<Button onClick={handleAdd}>
							<Plus className="mr-2 h-4 w-4" />
							{t("admin.categories.addChildCategory")}
						</Button>
					</Box>

					<div
						className="ag-theme-alpine"
						style={{ height: "500px", width: "100%" }}
					>
						<AgGridReact<ChildCategory>
							rowData={children}
							columnDefs={columnDefs}
							domLayout="normal"
							loading={loading}
							pagination={false}
							enableRtl={true}
							defaultColDef={{
								sortable: true,
								resizable: true,
								filter: true,
							}}
						/>
					</div>
				</DialogContent>
			</Dialog>

			{/* Form Dialog */}
			<Dialog
				open={formOpen}
				onClose={() => setFormOpen(false)}
				maxWidth="md"
				fullWidth
			>
				<DialogTitle>
					{editingId ? t("admin.categories.editChildCategory") : t("admin.categories.addChildCategory")}
				</DialogTitle>
				<DialogContent>
					<div className="grid grid-cols-2 gap-4 mt-2">
						<TextField
							label={t("admin.categories.slug")}
							value={form.slug}
							onChange={(e) => setForm({ ...form, slug: e.target.value })}
							fullWidth
							size="small"
							required
							placeholder="foreign-action"
						/>
						<TextField
							label={t("admin.categories.urlPath")}
							value={form.urlPath}
							onChange={(e) => setForm({ ...form, urlPath: e.target.value })}
							fullWidth
							size="small"
							required
							placeholder="action"
							helperText={t("admin.categories.urlPathHelper")}
						/>
						<TextField
							label={t("admin.categories.namePersian")}
							value={form.nameFa}
							onChange={(e) => setForm({ ...form, nameFa: e.target.value })}
							fullWidth
							size="small"
							required
						/>
						<TextField
							label={t("admin.categories.nameEnglish")}
							value={form.nameEn}
							onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
							fullWidth
							size="small"
							required
						/>
						<FormControl fullWidth size="small">
							<InputLabel>{t("admin.categories.contentType")}</InputLabel>
							<Select
								value={form.contentType}
								onChange={(e) =>
									setForm({ ...form, contentType: e.target.value })
								}
								label={t("admin.categories.contentType")}
							>
								<MenuItem value="movie">{t("admin.categories.movie")}</MenuItem>
								<MenuItem value="series">{t("admin.categories.series")}</MenuItem>
								<MenuItem value="mixed">{t("admin.categories.mixed")}</MenuItem>
							</Select>
						</FormControl>
						<TextField
							label={t("admin.categories.sortOrder")}
							type="number"
							value={form.sortOrder}
							onChange={(e) =>
								setForm({ ...form, sortOrder: Number(e.target.value) })
							}
							fullWidth
							size="small"
						/>
						<TextField
							label={t("admin.categories.descriptionPersian")}
							value={form.descriptionFa || ""}
							onChange={(e) =>
								setForm({ ...form, descriptionFa: e.target.value })
							}
							fullWidth
							size="small"
							multiline
							rows={2}
						/>
						<TextField
							label={t("admin.categories.descriptionEnglish")}
							value={form.descriptionEn || ""}
							onChange={(e) =>
								setForm({ ...form, descriptionEn: e.target.value })
							}
							fullWidth
							size="small"
							multiline
							rows={2}
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
							label={t("admin.categories.active")}
						/>
						<FormControlLabel
							control={
								<Switch
									checked={form.showInMenu}
									onChange={(e) =>
										setForm({ ...form, showInMenu: e.target.checked })
									}
									color="primary"
								/>
							}
							label={t("admin.categories.showInMenu")}
						/>
						<FormControlLabel
							control={
								<Switch
									checked={form.showInLanding}
									onChange={(e) =>
										setForm({ ...form, showInLanding: e.target.checked })
									}
									color="secondary"
								/>
							}
							label={t("admin.categories.showInLanding")}
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
							label={t("admin.categories.showEpisodes")}
						/>
					</div>
				</DialogContent>
				<DialogActions>
					<MuiButton onClick={() => setFormOpen(false)}>{t("admin.form.cancel")}</MuiButton>
					<MuiButton onClick={handleFormSubmit} variant="contained">
						{editingId ? t("admin.form.update") : t("admin.form.create")}
					</MuiButton>
				</DialogActions>
			</Dialog>

			{/* Confirm Delete Dialog */}
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
		</>
	);
}
