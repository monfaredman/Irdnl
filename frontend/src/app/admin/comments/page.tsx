"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { MessageSquare, Check, X, Flag, Trash2, Reply, TrendingUp } from "lucide-react";
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
	Checkbox,
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import type { ColDef } from "ag-grid-community";
import { commentsApi } from "@/lib/api/admin";
import { useTranslation } from "@/i18n";

export default function CommentsPage() {
	const { t } = useTranslation();
	const [comments, setComments] = useState<any[]>([]);
	const [stats, setStats] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [limit] = useState(50);
	const [total, setTotal] = useState(0);
	const [totalPages, setTotalPages] = useState(1);
	
	// Filters
	const [statusFilter, setStatusFilter] = useState("");
	const [typeFilter, setTypeFilter] = useState("");
	const [search, setSearch] = useState("");
	
	// Reply dialog
	const [replyDialog, setReplyDialog] = useState<{
		open: boolean;
		comment: any | null;
		reply: string;
	}>({
		open: false,
		comment: null,
		reply: "",
	});
	
	// Selection
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	
	// Confirm dialog
	const [confirmDialog, setConfirmDialog] = useState<{
		open: boolean;
		title: string;
		message: string;
		onConfirm: () => void;
	}>({ open: false, title: "", message: "", onConfirm: () => {} });
	
	// Feedback
	const [feedback, setFeedback] = useState<{
		type: "success" | "error";
		message: string;
	} | null>(null);

	const fetchComments = useCallback(async () => {
		setLoading(true);
		try {
			const params: any = { page, limit };
			if (statusFilter) params.status = statusFilter;
			if (typeFilter) params.type = typeFilter;
			if (search) params.search = search;
			
			const data = await commentsApi.list(params);
			setComments(data.comments || []);
			setTotal(data.total || 0);
			setTotalPages(data.totalPages || 1);
		} catch (error: any) {
			setFeedback({
				type: "error",
				message: error.response?.data?.message || "خطا در بارگذاری نظرات",
			});
		} finally {
			setLoading(false);
		}
	}, [page, limit, statusFilter, typeFilter, search]);

	const fetchStats = useCallback(async () => {
		try {
			const data = await commentsApi.getStats();
			setStats(data);
		} catch (error) {
			console.error("Failed to fetch stats:", error);
		}
	}, []);

	useEffect(() => {
		fetchComments();
		fetchStats();
	}, [fetchComments, fetchStats]);

	const handleApprove = async (id: string) => {
		try {
			await commentsApi.approve(id);
			setFeedback({ type: "success", message: "نظر تایید شد" });
			fetchComments();
			fetchStats();
		} catch (error: any) {
			setFeedback({
				type: "error",
				message: error.response?.data?.message || "خطا در تایید نظر",
			});
		}
	};

	const handleReject = async (id: string) => {
		try {
			await commentsApi.reject(id);
			setFeedback({ type: "success", message: "نظر رد شد" });
			fetchComments();
			fetchStats();
		} catch (error: any) {
			setFeedback({
				type: "error",
				message: error.response?.data?.message || "خطا در رد نظر",
			});
		}
	};

	const handleMarkAsSpam = async (id: string) => {
		try {
			await commentsApi.markAsSpam(id);
			setFeedback({ type: "success", message: "نظر به عنوان اسپم علامت‌گذاری شد" });
			fetchComments();
			fetchStats();
		} catch (error: any) {
			setFeedback({
				type: "error",
				message: error.response?.data?.message || "خطا در علامت‌گذاری اسپم",
			});
		}
	};

	const handleDelete = async (id: string) => {
		setConfirmDialog({
			open: true,
			title: "حذف نظر",
			message: "آیا مطمئن هستید که می‌خواهید این نظر را حذف کنید؟",
			onConfirm: async () => {
				setConfirmDialog({ open: false, title: "", message: "", onConfirm: () => {} });
				try {
					await commentsApi.delete(id);
					setFeedback({ type: "success", message: "نظر حذف شد" });
					fetchComments();
					fetchStats();
				} catch (error: any) {
					setFeedback({
						type: "error",
						message: error.response?.data?.message || "خطا در حذف نظر",
					});
				}
			},
		});
	};

	const handleReply = async () => {
		if (!replyDialog.comment || !replyDialog.reply.trim()) return;
		
		try {
			await commentsApi.update(replyDialog.comment.id, {
				adminReply: replyDialog.reply,
			});
			setFeedback({ type: "success", message: "پاسخ ثبت شد" });
			setReplyDialog({ open: false, comment: null, reply: "" });
			fetchComments();
		} catch (error: any) {
			setFeedback({
				type: "error",
				message: error.response?.data?.message || "خطا در ثبت پاسخ",
			});
		}
	};

	const handleBulkAction = async (action: "approve" | "reject" | "delete" | "spam") => {
		if (selectedIds.length === 0) {
			setFeedback({ type: "error", message: "لطفا حداقل یک نظر را انتخاب کنید" });
			return;
		}
		
		if (action === "delete") {
			setConfirmDialog({
				open: true,
				title: "حذف نظرات",
				message: `آیا مطمئن هستید که می‌خواهید ${selectedIds.length} نظر را حذف کنید؟`,
				onConfirm: async () => {
					setConfirmDialog({ open: false, title: "", message: "", onConfirm: () => {} });
					try {
						const result = await commentsApi.bulkAction(selectedIds, action);
						setFeedback({
							type: "success",
							message: `${result.success} نظر با موفقیت حذف شد`,
						});
						setSelectedIds([]);
						fetchComments();
						fetchStats();
					} catch (error: any) {
						setFeedback({
							type: "error",
							message: error.response?.data?.message || "خطا در عملیات دسته‌جمعی",
						});
					}
				},
			});
			return;
		}
		
		try {
			const result = await commentsApi.bulkAction(selectedIds, action);
			setFeedback({
				type: "success",
				message: `${result.success} نظر با موفقیت ${action === "approve" ? "تایید" : action === "reject" ? "رد" : action === "spam" ? "اسپم" : "حذف"} شد`,
			});
			setSelectedIds([]);
			fetchComments();
			fetchStats();
		} catch (error: any) {
			setFeedback({
				type: "error",
				message: error.response?.data?.message || "خطا در انجام عملیات",
			});
		}
	};

	const StatusCellRenderer = (props: any) => {
		const status = props.value;
		const colorMap: Record<string, "default" | "warning" | "success" | "error"> = {
			pending: "warning",
			approved: "success",
			rejected: "error",
			spam: "error",
		};
		
		return (
			<Chip
				label={t(`admin.comments.status.${status}`)}
				color={colorMap[status] || "default"}
				size="small"
				variant="outlined"
			/>
		);
	};

	const TypeCellRenderer = (props: any) => {
		const type = props.value;
		const colorMap: Record<string, "default" | "info" | "warning" | "error"> = {
			comment: "info",
			support: "warning",
			report: "error",
			feedback: "info",
		};
		
		return (
			<Chip
				label={t(`admin.comments.type.${type}`)}
				color={colorMap[type] || "default"}
				size="small"
			/>
		);
	};

	const ActionsCellRenderer = (props: any) => {
		const comment = props.data;
		
		return (
			<div className="flex items-center gap-1">
				{comment.status === "pending" && (
					<>
						<MuiButton
							size="small"
							color="success"
							onClick={() => handleApprove(comment.id)}
							startIcon={<Check className="w-3 h-3" />}
						>
							تایید
						</MuiButton>
						<MuiButton
							size="small"
							color="error"
							onClick={() => handleReject(comment.id)}
							startIcon={<X className="w-3 h-3" />}
						>
							رد
						</MuiButton>
					</>
				)}
				<MuiButton
					size="small"
					onClick={() => setReplyDialog({ open: true, comment, reply: comment.adminReply || "" })}
					startIcon={<Reply className="w-3 h-3" />}
				>
					پاسخ
				</MuiButton>
				<MuiButton
					size="small"
					color="warning"
					onClick={() => handleMarkAsSpam(comment.id)}
					startIcon={<Flag className="w-3 h-3" />}
				>
					اسپم
				</MuiButton>
				<MuiButton
					size="small"
					color="error"
					onClick={() => handleDelete(comment.id)}
					startIcon={<Trash2 className="w-3 h-3" />}
				>
					حذف
				</MuiButton>
			</div>
		);
	};

	const SelectionCellRenderer = (props: any) => {
		const comment = props.data;
		const isSelected = selectedIds.includes(comment.id);
		
		return (
			<Checkbox
				checked={isSelected}
				onChange={(e) => {
					if (e.target.checked) {
						setSelectedIds([...selectedIds, comment.id]);
					} else {
						setSelectedIds(selectedIds.filter(id => id !== comment.id));
					}
				}}
			/>
		);
	};

	const columnDefs: ColDef[] = useMemo(
		() => [
			{
				headerName: "",
				field: "select",
				cellRenderer: SelectionCellRenderer,
				width: 50,
				sortable: false,
				filter: false,
			},
			{
				headerName: t("admin.comments.type.label"),
				field: "type",
				cellRenderer: TypeCellRenderer,
				width: 120,
			},
			{
				headerName: t("admin.comments.text"),
				field: "text",
				flex: 2,
				cellRenderer: (props: any) => (
					<div className="py-2">
						<p className="text-sm line-clamp-2">{props.value}</p>
						{props.data.adminReply && (
							<p className="text-xs text-blue-600 mt-1">پاسخ: {props.data.adminReply}</p>
						)}
					</div>
				),
			},
			{
				headerName: t("admin.comments.user"),
				field: "userName",
				width: 150,
				cellRenderer: (props: any) => props.data.user?.name || props.value || "ناشناس",
			},
			{
				headerName: t("admin.comments.content"),
				field: "content",
				width: 200,
				cellRenderer: (props: any) => props.value?.title || "-",
			},
			{
				headerName: t("admin.comments.rating"),
				field: "rating",
				width: 100,
				cellRenderer: (props: any) => props.value > 0 ? `⭐ ${props.value}` : "-",
			},
			{
				headerName: t("admin.comments.status.label"),
				field: "status",
				cellRenderer: StatusCellRenderer,
				width: 120,
			},
			{
				headerName: t("admin.comments.date"),
				field: "createdAt",
				width: 150,
				cellRenderer: (props: any) => new Date(props.value).toLocaleDateString("fa-IR"),
			},
			{
				headerName: t("admin.comments.actions"),
				field: "actions",
				cellRenderer: ActionsCellRenderer,
				width: 400,
				sortable: false,
				filter: false,
			},
		],
		[t, selectedIds]
	);

	return (
		<div className="space-y-4 sm:space-y-6">
			<div>
				<h1 className="text-xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
					<MessageSquare className="w-6 h-6 sm:w-8 sm:h-8" />
					{t("admin.comments.title")}
				</h1>
				<p className="text-sm text-gray-600 mt-1 sm:mt-2">{t("admin.comments.description")}</p>
			</div>

			{/* Statistics Cards */}
			{stats && (
				<div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-sm font-medium text-gray-600">
								کل نظرات
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stats.total}</div>
						</CardContent>
					</Card>
					
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-sm font-medium text-amber-600">
								در انتظار تایید
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
						</CardContent>
					</Card>
					
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-sm font-medium text-green-600">
								تایید شده
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-green-600">{stats.approved}</div>
						</CardContent>
					</Card>
					
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-sm font-medium text-red-600">
								رد شده
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
						</CardContent>
					</Card>
					
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-sm font-medium text-gray-600">
								اسپم
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-gray-600">{stats.spam}</div>
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
							label={t("admin.comments.search")}
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							sx={{ minWidth: 250 }}
						/>
						
						<FormControl size="small" sx={{ minWidth: 150 }}>
							<InputLabel>{t("admin.comments.status.label")}</InputLabel>
							<Select
								value={statusFilter}
								label={t("admin.comments.status.label")}
								onChange={(e) => setStatusFilter(e.target.value)}
							>
								<MenuItem value="">همه</MenuItem>
								<MenuItem value="pending">در انتظار</MenuItem>
								<MenuItem value="approved">تایید شده</MenuItem>
								<MenuItem value="rejected">رد شده</MenuItem>
								<MenuItem value="spam">اسپم</MenuItem>
							</Select>
						</FormControl>

						<FormControl size="small" sx={{ minWidth: 150 }}>
							<InputLabel>{t("admin.comments.type.label")}</InputLabel>
							<Select
								value={typeFilter}
								label={t("admin.comments.type.label")}
								onChange={(e) => setTypeFilter(e.target.value)}
							>
								<MenuItem value="">همه</MenuItem>
								<MenuItem value="comment">نظر</MenuItem>
								<MenuItem value="support">پشتیبانی</MenuItem>
								<MenuItem value="report">گزارش</MenuItem>
								<MenuItem value="feedback">بازخورد</MenuItem>
							</Select>
						</FormControl>

						<Button onClick={fetchComments} disabled={loading}>
							{loading && <CircularProgress size={16} sx={{ mr: 1 }} />}
							{t("admin.comments.refresh")}
						</Button>

						{selectedIds.length > 0 && (
							<div className="flex gap-2 mr-auto">
								<MuiButton
									size="small"
									color="success"
									variant="contained"
									onClick={() => handleBulkAction("approve")}
								>
									تایید همه ({selectedIds.length})
								</MuiButton>
								<MuiButton
									size="small"
									color="error"
									variant="contained"
									onClick={() => handleBulkAction("reject")}
								>
									رد همه ({selectedIds.length})
								</MuiButton>
								<MuiButton
									size="small"
									color="error"
									variant="outlined"
									onClick={() => handleBulkAction("delete")}
								>
									حذف همه ({selectedIds.length})
								</MuiButton>
							</div>
						)}
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
							rowData={comments}
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

			{/* Reply Dialog */}
			<Dialog
				open={replyDialog.open}
				onClose={() => setReplyDialog({ open: false, comment: null, reply: "" })}
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle>پاسخ به نظر</DialogTitle>
				<DialogContent>
					{replyDialog.comment && (
						<>
							<p className="text-sm text-gray-600 mb-4">
								{replyDialog.comment.text}
							</p>
							<TextField
								fullWidth
								multiline
								rows={4}
								label="پاسخ شما"
								value={replyDialog.reply}
								onChange={(e) => setReplyDialog({ ...replyDialog, reply: e.target.value })}
							/>
						</>
					)}
				</DialogContent>
				<DialogActions>
					<MuiButton onClick={() => setReplyDialog({ open: false, comment: null, reply: "" })}>
						انصراف
					</MuiButton>
					<MuiButton
						onClick={handleReply}
						variant="contained"
						disabled={!replyDialog.reply.trim()}
					>
						ثبت پاسخ
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
