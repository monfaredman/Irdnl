"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Database, Trash2, Download, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/admin/ui/button";
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
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, GridReadyEvent } from "ag-grid-community";
import { tmdbApi } from "@/lib/api/admin";
import { useTranslation } from "@/i18n";

interface SavedContent {
	id: string;
	tmdbId: string;
	mediaType: "movie" | "tv";
	title: string;
	originalTitle: string;
	description: string;
	posterUrl: string;
	backdropUrl: string;
	year: number;
	rating: number;
	originalLanguage: string;
	importStatus: "pending" | "imported" | "failed";
	importedContentId?: string;
	createdAt: string;
	updatedAt: string;
}

export function TMDBSavedTab() {
	const { t } = useTranslation();
	
	const [rowData, setRowData] = useState<SavedContent[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	
	// Filters
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [typeFilter, setTypeFilter] = useState<string>("all");

	// Confirm dialog
	const [confirmDialog, setConfirmDialog] = useState<{
		open: boolean;
		id: string;
	}>({ open: false, id: "" });
	
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	const fetchSavedContent = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const params: any = { page, limit: 50 };
			if (searchQuery) params.search = searchQuery;
			if (statusFilter !== "all") params.status = statusFilter;
			if (typeFilter !== "all") params.mediaType = typeFilter;
			
			const data = await tmdbApi.getSavedContent(params);
			setRowData(data.items || []);
			setTotalPages(data.totalPages || 1);
		} catch (err: any) {
			setError(err.response?.data?.message || err.message);
			setRowData([]);
		} finally {
			setLoading(false);
		}
	}, [page, searchQuery, statusFilter, typeFilter]);

	useEffect(() => {
		fetchSavedContent();
	}, [fetchSavedContent]);

	const handleImport = useCallback(async (savedContentId: string) => {
		setError(null);
		try {
			await tmdbApi.importToDatabase(savedContentId);
			setSuccess(t("admin.tmdb.saved.importSuccess"));
			setTimeout(() => setSuccess(null), 3000);
			fetchSavedContent();
		} catch (err: any) {
			setError(err.response?.data?.message || err.message);
		}
	}, [t, fetchSavedContent]);

	const handleDelete = useCallback(async (id: string) => {
		setConfirmDialog({ open: true, id });
	}, []);

	const handleConfirmDelete = useCallback(async () => {
		const id = confirmDialog.id;
		setConfirmDialog({ open: false, id: "" });
		setError(null);
		try {
			await tmdbApi.deleteSavedContent(id);
			setSuccess(t("admin.tmdb.saved.deleteSuccess"));
			setTimeout(() => setSuccess(null), 3000);
			fetchSavedContent();
		} catch (err: any) {
			setError(err.response?.data?.message || err.message);
		}
	}, [t, fetchSavedContent, confirmDialog.id]);

	const StatusCellRenderer = (props: any) => {
		const status = props.value;
		let color: "default" | "warning" | "success" | "error" = "default";
		let icon = <Clock className="w-3 h-3" />;
		
		if (status === "pending") {
			color = "warning";
			icon = <Clock className="w-3 h-3" />;
		} else if (status === "imported") {
			color = "success";
			icon = <CheckCircle className="w-3 h-3" />;
		} else if (status === "failed") {
			color = "error";
			icon = <XCircle className="w-3 h-3" />;
		}
		
		return (
			<Chip
				icon={icon}
				label={t(`admin.tmdb.saved.status.${status}`)}
				color={color}
				size="small"
				variant="outlined"
			/>
		);
	};

	const ActionsCellRenderer = (props: any) => {
		const { id, importStatus } = props.data;
		
		return (
			<div className="flex items-center gap-2 h-full">
				{importStatus === "pending" && (
					<Button
						onClick={() => handleImport(id)}
						size="sm"
						variant="outline"
					>
						<Download className="w-3 h-3 ml-1" />
						{t("admin.tmdb.saved.import")}
					</Button>
				)}
				<Button
					onClick={() => handleDelete(id)}
					size="sm"
					variant="destructive"
				>
					<Trash2 className="w-3 h-3 ml-1" />
					{t("admin.tmdb.saved.delete")}
				</Button>
			</div>
		);
	};

	const PosterCellRenderer = (props: any) => {
		const posterUrl = props.value;
		return posterUrl ? (
			<img
				src={posterUrl}
				alt="Poster"
				className="w-10 h-14 object-cover rounded"
			/>
		) : null;
	};

	const columnDefs: ColDef[] = useMemo(
		() => [
			{
				headerName: t("admin.tmdb.saved.poster"),
				field: "posterUrl",
				cellRenderer: PosterCellRenderer,
				width: 80,
				sortable: false,
				filter: false,
			},
			{
				headerName: t("admin.tmdb.saved.title"),
				field: "title",
				flex: 2,
				filter: true,
			},
			{
				headerName: t("admin.tmdb.saved.type"),
				field: "mediaType",
				width: 100,
				cellRenderer: (props: any) => (
					<Chip
						label={props.value === "movie" ? t("admin.tmdb.saved.typeMovie") : t("admin.tmdb.saved.typeTv")}
						size="small"
						color="info"
						variant="outlined"
					/>
				),
			},
			{
				headerName: t("admin.tmdb.saved.year"),
				field: "year",
				width: 100,
			},
			{
				headerName: t("admin.tmdb.saved.rating"),
				field: "rating",
				width: 100,
				cellRenderer: (props: any) => `⭐ ${props.value.toFixed(1)}`,
			},
			{
				headerName: t("admin.tmdb.saved.status.label"),
				field: "importStatus",
				width: 140,
				cellRenderer: StatusCellRenderer,
			},
			{
				headerName: t("admin.tmdb.saved.actions"),
				field: "actions",
				cellRenderer: ActionsCellRenderer,
				width: 220,
				sortable: false,
				filter: false,
			},
		],
		[t, handleImport, handleDelete],
	);

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
					<Database className="w-5 h-5" />
					{t("admin.tmdb.saved.title")}
				</h3>
			</div>

			{error && (
				<Alert severity="error" onClose={() => setError(null)}>
					{error}
				</Alert>
			)}

			{success && (
				<Alert severity="success" onClose={() => setSuccess(null)}>
					{success}
				</Alert>
			)}

			{/* Filters */}
			<div className="flex flex-wrap gap-3">
				<TextField
					size="small"
					placeholder={t("admin.tmdb.saved.search")}
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					sx={{ minWidth: 250 }}
				/>
				
				<FormControl size="small" sx={{ minWidth: 140 }}>
					<InputLabel>{t("admin.tmdb.saved.filterType")}</InputLabel>
					<Select
						value={typeFilter}
						label={t("admin.tmdb.saved.filterType")}
						onChange={(e) => setTypeFilter(e.target.value)}
					>
						<MenuItem value="all">{t("admin.tmdb.saved.filterTypeAll")}</MenuItem>
						<MenuItem value="movie">{t("admin.tmdb.saved.typeMovie")}</MenuItem>
						<MenuItem value="tv">{t("admin.tmdb.saved.typeTv")}</MenuItem>
					</Select>
				</FormControl>

				<FormControl size="small" sx={{ minWidth: 140 }}>
					<InputLabel>{t("admin.tmdb.saved.filterStatus")}</InputLabel>
					<Select
						value={statusFilter}
						label={t("admin.tmdb.saved.filterStatus")}
						onChange={(e) => setStatusFilter(e.target.value)}
					>
						<MenuItem value="all">{t("admin.tmdb.saved.filterStatusAll")}</MenuItem>
						<MenuItem value="pending">{t("admin.tmdb.saved.status.pending")}</MenuItem>
						<MenuItem value="imported">{t("admin.tmdb.saved.status.imported")}</MenuItem>
						<MenuItem value="failed">{t("admin.tmdb.saved.status.failed")}</MenuItem>
					</Select>
				</FormControl>

				<Button onClick={fetchSavedContent} disabled={loading}>
					{loading && <CircularProgress size={16} sx={{ mr: 1 }} />}
					{t("admin.tmdb.saved.refresh")}
				</Button>
			</div>

			{/* AG Grid */}
			<div
				className="ag-theme-alpine-dark"
				style={{ height: 600, width: "100%" }}
			>
				<AgGridReact
					rowData={rowData}
					columnDefs={columnDefs}
					pagination={false}
					rowHeight={70}
					headerHeight={50}
					domLayout="normal"
					loading={loading}
					enableRtl={true}
				/>
			</div>

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="flex items-center justify-center gap-2">
					<Button
						onClick={() => setPage((p) => Math.max(1, p - 1))}
						disabled={page === 1 || loading}
						size="sm"
					>
						{t("admin.tmdb.saved.previous")}
					</Button>
					<span className="text-sm text-gray-600">
						{t("admin.tmdb.saved.page")} {page} / {totalPages}
					</span>
					<Button
						onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
						disabled={page === totalPages || loading}
						size="sm"
					>
						{t("admin.tmdb.saved.next")}
					</Button>
				</div>
			)}

			{/* Confirm Delete Dialog */}
			<Dialog
				open={confirmDialog.open}
				onClose={() => setConfirmDialog({ open: false, id: "" })}
			>
				<DialogTitle>{t("admin.tmdb.saved.delete")}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						{t("admin.tmdb.saved.deleteConfirm")}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<MuiButton onClick={() => setConfirmDialog({ open: false, id: "" })}>
						{t("admin.form.cancel")}
					</MuiButton>
					<MuiButton onClick={handleConfirmDelete} color="error" variant="contained">
						{t("admin.tmdb.saved.delete")}
					</MuiButton>
				</DialogActions>
			</Dialog>
		</div>
	);
}
