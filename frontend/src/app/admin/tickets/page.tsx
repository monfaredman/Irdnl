"use client";

import { Edit, Trash2, MessageSquare, Eye } from "lucide-react";
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
	Snackbar,
	Alert,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button as MuiButton,
	TextField,
	Select,
	MenuItem,
	InputLabel,
	FormControl,
	Chip,
} from "@mui/material";
import { ticketsApi } from "@/lib/api/admin";

interface TicketItem {
	id: string;
	subject: string;
	message: string;
	status: string;
	priority: string;
	category: string;
	adminReply: string | null;
	adminReplyAt: string | null;
	userId: string;
	user?: { id: string; name: string; email: string } | null;
	createdAt: string;
	updatedAt: string;
}

interface TicketStats {
	total: number;
	open: number;
	inProgress: number;
	answered: number;
	closed: number;
}

const STATUS_OPTIONS = [
	{ value: "open", label: "باز", color: "#3B82F6" },
	{ value: "in_progress", label: "در حال بررسی", color: "#F59E0B" },
	{ value: "answered", label: "پاسخ داده شده", color: "#22C55E" },
	{ value: "closed", label: "بسته شده", color: "#6B7280" },
];

const PRIORITY_OPTIONS = [
	{ value: "low", label: "کم", color: "#6B7280" },
	{ value: "medium", label: "متوسط", color: "#F59E0B" },
	{ value: "high", label: "زیاد", color: "#EF4444" },
];

const CATEGORY_OPTIONS = [
	{ value: "general", label: "عمومی" },
	{ value: "technical", label: "فنی" },
	{ value: "billing", label: "مالی" },
	{ value: "content", label: "محتوا" },
	{ value: "account", label: "حساب کاربری" },
	{ value: "other", label: "سایر" },
];

export default function AdminTicketsPage() {
	const [tickets, setTickets] = useState<TicketItem[]>([]);
	const [stats, setStats] = useState<TicketStats | null>(null);
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

	const [replyOpen, setReplyOpen] = useState(false);
	const [viewOpen, setViewOpen] = useState(false);
	const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(null);
	const [replyText, setReplyText] = useState("");
	const [replyStatus, setReplyStatus] = useState("answered");
	const [filterStatus, setFilterStatus] = useState("");

	const fetchTickets = async () => {
		setLoading(true);
		try {
			const res = await ticketsApi.list(filterStatus || undefined);
			setTickets(res.tickets || []);
		} catch {
			showFeedback("error", "خطا در دریافت تیکت‌ها");
		} finally {
			setLoading(false);
		}
	};

	const fetchStats = async () => {
		try {
			const res = await ticketsApi.getStats();
			setStats(res);
		} catch {
			/* silent */
		}
	};

	useEffect(() => {
		fetchStats();
	}, []);

	useEffect(() => {
		fetchTickets();
	}, [filterStatus]);

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

	const openReply = (ticket: TicketItem) => {
		setSelectedTicket(ticket);
		setReplyText(ticket.adminReply || "");
		setReplyStatus("answered");
		setReplyOpen(true);
	};

	const openView = (ticket: TicketItem) => {
		setSelectedTicket(ticket);
		setViewOpen(true);
	};

	const handleReply = async () => {
		if (!selectedTicket || !replyText.trim()) return;
		try {
			await ticketsApi.reply(selectedTicket.id, {
				adminReply: replyText,
				status: replyStatus,
			});
			showFeedback("success", "پاسخ ارسال شد");
			setReplyOpen(false);
			fetchTickets();
			fetchStats();
		} catch {
			showFeedback("error", "خطا در ارسال پاسخ");
		}
	};

	const handleDelete = (ticket: TicketItem) => {
		showConfirm("حذف تیکت", `آیا از حذف تیکت "${ticket.subject}" مطمئن هستید؟`, async () => {
			try {
				await ticketsApi.delete(ticket.id);
				showFeedback("success", "تیکت حذف شد");
				fetchTickets();
				fetchStats();
			} catch {
				showFeedback("error", "خطا در حذف تیکت");
			}
		});
	};

	const handleStatusChange = async (ticket: TicketItem, newStatus: string) => {
		try {
			await ticketsApi.updateStatus(ticket.id, newStatus);
			fetchTickets();
			fetchStats();
		} catch {
			showFeedback("error", "خطا در تغییر وضعیت");
		}
	};

	const getStatusLabel = (val: string) =>
		STATUS_OPTIONS.find((s) => s.value === val)?.label || val;
	const getStatusColor = (val: string) =>
		STATUS_OPTIONS.find((s) => s.value === val)?.color || "#6B7280";
	const getPriorityLabel = (val: string) =>
		PRIORITY_OPTIONS.find((p) => p.value === val)?.label || val;
	const getPriorityColor = (val: string) =>
		PRIORITY_OPTIONS.find((p) => p.value === val)?.color || "#6B7280";
	const getCategoryLabel = (val: string) =>
		CATEGORY_OPTIONS.find((c) => c.value === val)?.label || val;

	const columnDefs: ColDef[] = [
		{
			field: "subject",
			headerName: "موضوع",
			flex: 1,
			sortable: true,
			filter: true,
			cellRenderer: (params: any) => (
				<span className="font-medium">{params.value}</span>
			),
		},
		{
			field: "user",
			headerName: "کاربر",
			width: 180,
			sortable: false,
			filter: false,
			cellRenderer: (params: any) => {
				const user = params.value;
				return (
					<div>
						<p className="text-sm font-medium">{user?.name || "—"}</p>
						<p className="text-xs text-gray-400">{user?.email || ""}</p>
					</div>
				);
			},
		},
		{
			field: "status",
			headerName: "وضعیت",
			width: 150,
			sortable: true,
			filter: true,
			cellRenderer: (params: any) => {
				const color = getStatusColor(params.value);
				return (
					<Chip
						label={getStatusLabel(params.value)}
						size="small"
						sx={{
							background: `${color}20`,
							color: color,
							border: `1px solid ${color}40`,
						}}
					/>
				);
			},
		},
		{
			field: "priority",
			headerName: "اولویت",
			width: 120,
			sortable: true,
			filter: true,
			cellRenderer: (params: any) => {
				const color = getPriorityColor(params.value);
				return (
					<Chip
						label={getPriorityLabel(params.value)}
						size="small"
						variant="outlined"
						sx={{ borderColor: color, color: color }}
					/>
				);
			},
		},
		{
			field: "category",
			headerName: "دسته",
			width: 120,
			sortable: true,
			filter: true,
			cellRenderer: (params: any) => (
				<span className="text-xs">{getCategoryLabel(params.value)}</span>
			),
		},
		{
			field: "createdAt",
			headerName: "تاریخ",
			width: 150,
			sortable: true,
			cellRenderer: (params: any) =>
				new Date(params.value).toLocaleDateString("fa-IR", {
					year: "numeric",
					month: "short",
					day: "numeric",
				}),
		},
		{
			field: "actions",
			headerName: "عملیات",
			width: 150,
			sortable: false,
			filter: false,
			cellRenderer: (params: any) => {
				const ticket = params.data;
				return (
					<div className="flex gap-1">
						<Button variant="ghost" size="sm" onClick={() => openView(ticket)}>
							<Eye className="h-4 w-4" />
						</Button>
						<Button variant="ghost" size="sm" onClick={() => openReply(ticket)}>
							<MessageSquare className="h-4 w-4 text-blue-500" />
						</Button>
						<Button variant="ghost" size="sm" onClick={() => handleDelete(ticket)}>
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
						<MessageSquare className="h-6 w-6" />
						مدیریت تیکت‌ها
					</h1>
					<p className="text-gray-500 mt-1">
						پشتیبانی و پاسخ‌گویی به تیکت‌های کاربران
					</p>
				</div>
			</div>

			{/* Stats */}
			{stats && (
				<div className="grid grid-cols-5 gap-4">
					{[
						{ label: "کل", value: stats.total, color: "#6366F1" },
						{ label: "باز", value: stats.open, color: "#3B82F6" },
						{ label: "در حال بررسی", value: stats.inProgress, color: "#F59E0B" },
						{ label: "پاسخ داده شده", value: stats.answered, color: "#22C55E" },
						{ label: "بسته شده", value: stats.closed, color: "#6B7280" },
					].map((s) => (
						<Card key={s.label}>
							<CardContent className="pt-4 text-center">
								<p className="text-3xl font-bold" style={{ color: s.color }}>
									{s.value}
								</p>
								<p className="text-xs text-gray-500 mt-1">{s.label}</p>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			{/* Filter by status */}
			<Card>
				<CardContent className="pt-4">
					<div className="flex items-center gap-4">
						<span className="text-sm font-medium text-gray-700">وضعیت:</span>
						<div className="flex flex-wrap gap-2">
							<Chip
								label="همه"
								variant={filterStatus === "" ? "filled" : "outlined"}
								color={filterStatus === "" ? "primary" : "default"}
								onClick={() => setFilterStatus("")}
								size="small"
							/>
							{STATUS_OPTIONS.map((st) => (
								<Chip
									key={st.value}
									label={st.label}
									variant={filterStatus === st.value ? "filled" : "outlined"}
									color={filterStatus === st.value ? "primary" : "default"}
									onClick={() => setFilterStatus(st.value)}
									size="small"
								/>
							))}
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>تیکت‌ها ({tickets.length})</CardTitle>
				</CardHeader>
				<CardContent>
					{loading ? (
						<p className="text-center py-8 text-gray-500">در حال بارگذاری...</p>
					) : tickets.length === 0 ? (
						<p className="text-center py-8 text-gray-500">تیکتی یافت نشد</p>
					) : (
						<div className="ag-theme-alpine" style={{ height: 600, width: "100%" }} dir="rtl">
							<AgGridReact
								rowData={tickets}
								columnDefs={columnDefs}
								pagination={true}
								paginationPageSize={20}
								paginationPageSizeSelector={[10, 20, 50, 100]}
								domLayout="normal"
								enableRtl={true}
								suppressMovableColumns={false}
								animateRows={true}
								rowHeight={60}
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

			{/* View Ticket Dialog */}
			<Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="md" fullWidth>
				<DialogTitle>
					مشاهده تیکت: {selectedTicket?.subject}
				</DialogTitle>
				<DialogContent>
					{selectedTicket && (
						<div className="space-y-4 mt-2">
							<div className="flex gap-2 flex-wrap">
								<Chip
									label={getStatusLabel(selectedTicket.status)}
									size="small"
									sx={{
										background: `${getStatusColor(selectedTicket.status)}20`,
										color: getStatusColor(selectedTicket.status),
									}}
								/>
								<Chip
									label={getPriorityLabel(selectedTicket.priority)}
									size="small"
									variant="outlined"
									sx={{
										borderColor: getPriorityColor(selectedTicket.priority),
										color: getPriorityColor(selectedTicket.priority),
									}}
								/>
								<Chip label={getCategoryLabel(selectedTicket.category)} size="small" variant="outlined" />
							</div>
							<div>
								<p className="text-sm text-gray-500 mb-1">کاربر:</p>
								<p className="font-medium">
									{selectedTicket.user?.name || "—"} ({selectedTicket.user?.email || selectedTicket.userId})
								</p>
							</div>
							<div>
								<p className="text-sm text-gray-500 mb-1">پیام:</p>
								<div className="bg-gray-50 rounded-lg p-3 whitespace-pre-wrap">
									{selectedTicket.message}
								</div>
							</div>
							{selectedTicket.adminReply && (
								<div>
									<p className="text-sm text-gray-500 mb-1">پاسخ مدیر:</p>
									<div className="bg-blue-50 rounded-lg p-3 whitespace-pre-wrap border border-blue-200">
										{selectedTicket.adminReply}
									</div>
									{selectedTicket.adminReplyAt && (
										<p className="text-xs text-gray-400 mt-1">
											{new Date(selectedTicket.adminReplyAt).toLocaleDateString("fa-IR")}
										</p>
									)}
								</div>
							)}
							<div className="flex items-center gap-4 pt-2">
								<FormControl size="small" sx={{ minWidth: 150 }}>
									<InputLabel>تغییر وضعیت</InputLabel>
									<Select
										value={selectedTicket.status}
										label="تغییر وضعیت"
										onChange={(e) => {
											handleStatusChange(selectedTicket, e.target.value);
											setSelectedTicket({ ...selectedTicket, status: e.target.value });
										}}
									>
										{STATUS_OPTIONS.map((st) => (
											<MenuItem key={st.value} value={st.value}>
												{st.label}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</div>
						</div>
					)}
				</DialogContent>
				<DialogActions>
					<MuiButton onClick={() => setViewOpen(false)}>بستن</MuiButton>
					<MuiButton
						variant="contained"
						onClick={() => {
							setViewOpen(false);
							if (selectedTicket) openReply(selectedTicket);
						}}
					>
						پاسخ دادن
					</MuiButton>
				</DialogActions>
			</Dialog>

			{/* Reply Dialog */}
			<Dialog open={replyOpen} onClose={() => setReplyOpen(false)} maxWidth="md" fullWidth>
				<DialogTitle>
					پاسخ به تیکت: {selectedTicket?.subject}
				</DialogTitle>
				<DialogContent>
					<div className="space-y-4 mt-2">
						<div className="bg-gray-50 rounded-lg p-3">
							<p className="text-sm text-gray-500 mb-1">پیام کاربر:</p>
							<p className="whitespace-pre-wrap">{selectedTicket?.message}</p>
						</div>
						<TextField
							label="پاسخ شما"
							value={replyText}
							onChange={(e) => setReplyText(e.target.value)}
							fullWidth
							multiline
							rows={4}
						/>
						<FormControl fullWidth size="small">
							<InputLabel>وضعیت پس از پاسخ</InputLabel>
							<Select
								value={replyStatus}
								label="وضعیت پس از پاسخ"
								onChange={(e) => setReplyStatus(e.target.value)}
							>
								{STATUS_OPTIONS.map((st) => (
									<MenuItem key={st.value} value={st.value}>
										{st.label}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</div>
				</DialogContent>
				<DialogActions>
					<MuiButton onClick={() => setReplyOpen(false)}>انصراف</MuiButton>
					<MuiButton
						variant="contained"
						onClick={handleReply}
						disabled={!replyText.trim()}
					>
						ارسال پاسخ
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
