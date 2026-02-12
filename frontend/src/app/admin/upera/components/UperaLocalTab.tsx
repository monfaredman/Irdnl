"use client";

import { useState, useEffect, useCallback } from "react";
import { Download, Trash2, Database, Search } from "lucide-react";
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
import { uperaApi } from "@/lib/api/admin";
import { useTranslation } from "@/i18n";

export function UperaLocalTab() {
	const { t } = useTranslation();
	const [content, setContent] = useState<any[]>([]);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [typeFilter, setTypeFilter] = useState("");
	const [statusFilter, setStatusFilter] = useState("");
	const [search, setSearch] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [importingId, setImportingId] = useState<string | null>(null);
	const [confirmDialog, setConfirmDialog] = useState<{
		open: boolean;
		id: string;
	}>({ open: false, id: "" });

	const fetchLocalContent = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const params: any = { page, limit: 20 };
			if (typeFilter) params.type = typeFilter;
			if (statusFilter) params.status = statusFilter;
			if (search) params.search = search;

			const data = await uperaApi.getLocalContent(params);
			setContent(data.data || []);
			setTotal(data.total || 0);
		} catch (err: any) {
			setError(err.response?.data?.message || err.message);
		} finally {
			setLoading(false);
		}
	}, [page, typeFilter, statusFilter, search]);

	useEffect(() => {
		fetchLocalContent();
	}, [fetchLocalContent]);

	const handleImport = async (id: string) => {
		setImportingId(id);
		setError(null);
		try {
			await uperaApi.importToDatabase(id);
			setSuccess(t("admin.upera.local.importSuccess"));
			setTimeout(() => setSuccess(null), 3000);
			fetchLocalContent();
		} catch (err: any) {
			setError(err.response?.data?.message || t("admin.upera.local.importFailed"));
		} finally {
			setImportingId(null);
		}
	};

	const handleDelete = async (id: string) => {
		try {
			await uperaApi.deleteLocalContent(id);
			setSuccess(t("admin.upera.local.deleteSuccess"));
			setTimeout(() => setSuccess(null), 3000);
			fetchLocalContent();
		} catch (err: any) {
			setError(err.response?.data?.message || t("admin.upera.local.deleteFailed"));
		}
		setConfirmDialog({ open: false, id: "" });
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "imported":
				return "success";
			case "failed":
				return "error";
			default:
				return "warning";
		}
	};

	const getStatusLabel = (status: string) => {
		switch (status) {
			case "imported":
				return t("admin.upera.local.status.imported");
			case "failed":
				return t("admin.upera.local.status.failed");
			default:
				return t("admin.upera.local.status.pending");
		}
	};

	return (
		<div className="space-y-6">
			<h2 className="text-lg font-semibold">{t("admin.upera.local.title")}</h2>

			{/* Filters */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<TextField
					size="small"
					label={t("admin.content.searchPlaceholder")}
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && fetchLocalContent()}
					fullWidth
					InputProps={{
						endAdornment: (
							<Search className="h-4 w-4 text-gray-400 cursor-pointer" onClick={fetchLocalContent} />
						),
					}}
				/>

				<FormControl size="small" fullWidth>
					<InputLabel>{t("admin.upera.local.filterType")}</InputLabel>
					<Select
						value={typeFilter}
						label={t("admin.upera.local.filterType")}
						onChange={(e) => setTypeFilter(e.target.value)}
					>
						<MenuItem value="">{t("admin.upera.local.all")}</MenuItem>
						<MenuItem value="movie">{t("admin.content.movie")}</MenuItem>
						<MenuItem value="series">{t("admin.content.series")}</MenuItem>
					</Select>
				</FormControl>

				<FormControl size="small" fullWidth>
					<InputLabel>{t("admin.upera.local.filterStatus")}</InputLabel>
					<Select
						value={statusFilter}
						label={t("admin.upera.local.filterStatus")}
						onChange={(e) => setStatusFilter(e.target.value)}
					>
						<MenuItem value="">{t("admin.upera.local.all")}</MenuItem>
						<MenuItem value="pending">{t("admin.upera.local.status.pending")}</MenuItem>
						<MenuItem value="imported">{t("admin.upera.local.status.imported")}</MenuItem>
						<MenuItem value="failed">{t("admin.upera.local.status.failed")}</MenuItem>
					</Select>
				</FormControl>

				<Button onClick={fetchLocalContent} disabled={loading}>
					{loading ? <CircularProgress size={16} /> : <Search className="h-4 w-4 ml-1" />}
					{t("admin.upera.browse.fetch")}
				</Button>
			</div>

			{/* Messages */}
			{error && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}
			{success && <Alert severity="success" onClose={() => setSuccess(null)}>{success}</Alert>}

			{/* Content Table */}
			{loading ? (
				<div className="flex justify-center py-12">
					<CircularProgress />
				</div>
			) : content.length > 0 ? (
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b bg-gray-50">
								<th className="p-3 text-right font-medium text-gray-600">پوستر</th>
								<th className="p-3 text-right font-medium text-gray-600">عنوان</th>
								<th className="p-3 text-right font-medium text-gray-600">نوع</th>
								<th className="p-3 text-right font-medium text-gray-600">سال</th>
								<th className="p-3 text-right font-medium text-gray-600">IMDb</th>
								<th className="p-3 text-right font-medium text-gray-600">وضعیت</th>
								<th className="p-3 text-right font-medium text-gray-600">عملیات</th>
							</tr>
						</thead>
						<tbody>
							{content.map((item: any) => (
								<tr key={item.id} className="border-b hover:bg-gray-50">
									<td className="p-3">
										{item.posterUrl ? (
											<img
												src={item.posterUrl}
												alt={item.titleFa || item.titleEn}
												className="w-12 h-16 object-cover rounded"
											/>
										) : (
											<div className="w-12 h-16 bg-gray-200 rounded flex items-center justify-center">
												<span className="text-xs text-gray-400">—</span>
											</div>
										)}
									</td>
									<td className="p-3">
										<div className="font-medium">{item.titleFa || "—"}</div>
										<div className="text-xs text-gray-500">{item.titleEn || ""}</div>
									</td>
									<td className="p-3">
										<Chip
											label={item.type === "movie" ? t("admin.content.movie") : t("admin.content.series")}
											size="small"
											variant="outlined"
										/>
									</td>
									<td className="p-3 text-gray-600">{item.year || "—"}</td>
									<td className="p-3 text-gray-600">{item.imdbRating || "—"}</td>
									<td className="p-3">
										<Chip
											label={getStatusLabel(item.importStatus)}
											size="small"
											color={getStatusColor(item.importStatus) as any}
										/>
									</td>
									<td className="p-3">
										<div className="flex gap-1">
											{item.importStatus !== "imported" && (
												<Button
													size="sm"
													onClick={() => handleImport(item.id)}
													disabled={importingId === item.id}
												>
													{importingId === item.id ? (
														<CircularProgress size={14} />
													) : (
														<Database className="h-3 w-3 ml-1" />
													)}
													{t("admin.upera.local.importToDb")}
												</Button>
											)}
											<Button
												size="sm"
												variant="outline"
												onClick={() => setConfirmDialog({ open: true, id: item.id })}
											>
												<Trash2 className="h-3 w-3 ml-1" />
												{t("admin.upera.local.delete")}
											</Button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			) : (
				<div className="text-center py-12 text-gray-400">
					{t("admin.messages.noData")}
				</div>
			)}

			{/* Pagination */}
			{total > 20 && (
				<div className="flex justify-center gap-2">
					<Button
						variant="outline"
						disabled={page <= 1}
						onClick={() => setPage((p) => p - 1)}
					>
						{t("admin.form.previous")}
					</Button>
					<span className="flex items-center px-4 text-sm text-gray-600">
						{page} / {Math.ceil(total / 20)}
					</span>
					<Button
						variant="outline"
						disabled={page >= Math.ceil(total / 20)}
						onClick={() => setPage((p) => p + 1)}
					>
						{t("admin.form.next")}
					</Button>
				</div>
			)}

			{/* Delete Confirm Dialog */}
			<Dialog
				open={confirmDialog.open}
				onClose={() => setConfirmDialog({ open: false, id: "" })}
			>
				<DialogTitle>{t("admin.upera.local.deleteConfirm")}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						{t("admin.messages.confirmDelete")}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<MuiButton onClick={() => setConfirmDialog({ open: false, id: "" })}>
						{t("admin.form.cancel")}
					</MuiButton>
					<MuiButton
						onClick={() => handleDelete(confirmDialog.id)}
						color="error"
						variant="contained"
					>
						{t("admin.upera.local.delete")}
					</MuiButton>
				</DialogActions>
			</Dialog>
		</div>
	);
}
