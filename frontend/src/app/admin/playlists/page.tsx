"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { ListMusic, Trash2 } from "lucide-react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/admin/ui/card";
import {
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
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import type { ColDef } from "ag-grid-community";
import adminApi from "@/lib/api/admin";
import { useTranslation } from "@/i18n";

interface Playlist {
	id: string;
	title: string;
	description?: string;
	isPublic: boolean;
	userId: string;
	likeCount: number;
	shareCount: number;
	createdAt: string;
	updatedAt: string;
	items?: any[];
	user?: { id: string; name: string; email?: string };
}

export default function AdminPlaylistsPage() {
	const { t } = useTranslation();

	const [playlists, setPlaylists] = useState<Playlist[]>([]);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(true);
	const [feedback, setFeedback] = useState<{
		type: "success" | "error";
		message: string;
	} | null>(null);
	const [page, setPage] = useState(1);

	// Delete confirmation
	const [confirmDialog, setConfirmDialog] = useState<{
		open: boolean;
		id: string | null;
		title: string;
	}>({ open: false, id: null, title: "" });

	const fetchPlaylists = useCallback(async () => {
		try {
			setLoading(true);
			const res = await adminApi.get("/playlists", {
				params: { page, limit: 50 },
			});
			setPlaylists(res.data.data || []);
			setTotal(res.data.total || 0);
		} catch {
			setFeedback({ type: "error", message: "خطا در بارگذاری لیست‌های پخش" });
		} finally {
			setLoading(false);
		}
	}, [page]);

	useEffect(() => {
		fetchPlaylists();
	}, [fetchPlaylists]);

	const handleDelete = async () => {
		if (!confirmDialog.id) return;
		try {
			await adminApi.delete(`/playlists/${confirmDialog.id}`);
			setFeedback({ type: "success", message: "لیست پخش حذف شد" });
			setConfirmDialog({ open: false, id: null, title: "" });
			fetchPlaylists();
		} catch {
			setFeedback({ type: "error", message: "خطا در حذف لیست پخش" });
		}
	};

	const columnDefs = useMemo<ColDef[]>(
		() => [
			{
				headerName: "عنوان",
				field: "title",
				flex: 1,
				minWidth: 180,
			},
			{
				headerName: "کاربر",
				field: "user",
				width: 160,
				valueGetter: (params: any) =>
					params.data.user?.name || params.data.userId,
			},
			{
				headerName: "تعداد آیتم",
				field: "items",
				width: 110,
				valueGetter: (params: any) =>
					params.data.items?.length || 0,
			},
			{
				headerName: "لایک",
				field: "likeCount",
				width: 90,
			},
			{
				headerName: "اشتراک‌گذاری",
				field: "shareCount",
				width: 110,
			},
			{
				headerName: "وضعیت",
				field: "isPublic",
				width: 100,
				cellRenderer: (params: any) => (
					<Chip
						label={params.value ? "عمومی" : "خصوصی"}
						size="small"
						color={params.value ? "primary" : "default"}
					/>
				),
			},
			{
				headerName: "تاریخ ایجاد",
				field: "createdAt",
				width: 140,
				valueGetter: (params: any) => {
					if (!params.data.createdAt) return "";
					return new Intl.DateTimeFormat("fa-IR", {
						year: "numeric",
						month: "short",
						day: "numeric",
					}).format(new Date(params.data.createdAt));
				},
			},
			{
				headerName: "عملیات",
				field: "id",
				width: 100,
				sortable: false,
				filter: false,
				cellRenderer: (params: any) => (
					<div className="flex items-center gap-1 h-full">
						<button
							type="button"
							className="p-1.5 rounded hover:bg-red-50 text-red-600"
							onClick={() =>
								setConfirmDialog({
									open: true,
									id: params.data.id,
									title: params.data.title,
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
		<div className="space-y-4 sm:space-y-6" dir="rtl">
			{/* Header */}
			<div className="flex items-center gap-2 sm:gap-3">
				<ListMusic className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
				<div>
					<h1 className="text-xl sm:text-2xl font-bold text-gray-900">لیست‌های پخش</h1>
					<p className="text-gray-600 text-sm">
						مدیریت لیست‌های پخش کاربران
					</p>
				</div>
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
						<div className="text-sm text-gray-600">کل لیست‌های پخش</div>
						<div className="text-2xl font-bold text-gray-900">{total}</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<div className="text-sm text-gray-600">عمومی</div>
						<div className="text-2xl font-bold text-blue-600">
							{playlists.filter((p) => p.isPublic).length}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<div className="text-sm text-gray-600">مجموع لایک‌ها</div>
						<div className="text-2xl font-bold text-pink-600">
							{playlists.reduce((sum, p) => sum + p.likeCount, 0)}
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
								rowData={playlists}
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

			{/* Delete Confirm Dialog */}
			<Dialog
				open={confirmDialog.open}
				onClose={() =>
					setConfirmDialog({ open: false, id: null, title: "" })
				}
			>
				<DialogTitle>حذف لیست پخش</DialogTitle>
				<DialogContent>
					<DialogContentText>
						آیا مطمئنید که می‌خواهید لیست پخش &quot;{confirmDialog.title}
						&quot; را حذف کنید؟
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
