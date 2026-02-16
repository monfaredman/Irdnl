"use client";

import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import ErrorIcon from "@mui/icons-material/Error";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Button,
	Chip,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Snackbar,
	TextField,
	Typography,
} from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/providers/language-provider";
import {
	glassBlur,
	glassBorderRadius,
	glassColors,
} from "@/theme/glass-design-system";
import { userApi, type TicketData, type CreateTicketInput } from "@/lib/api/user";
import { useIsAuthenticated } from "@/store/auth";

const translations = {
	en: {
		tickets: "Support Tickets",
		noTickets: "You have no support tickets",
		createFirst: "Create your first ticket to get help",
		newTicket: "New Ticket",
		subject: "Subject",
		message: "Message",
		priority: "Priority",
		category: "Category",
		send: "Send Ticket",
		cancel: "Cancel",
		adminReply: "Admin Reply",
		status: "Status",
		createdAt: "Created",
		noReply: "Waiting for response...",
		low: "Low",
		medium: "Medium",
		high: "High",
		general: "General",
		technical: "Technical",
		billing: "Billing",
		content: "Content",
		account: "Account",
		other: "Other",
		open: "Open",
		in_progress: "In Progress",
		answered: "Answered",
		closed: "Closed",
		success: "Ticket submitted successfully",
		error: "Failed to submit ticket",
	},
	fa: {
		tickets: "تیکت‌های پشتیبانی",
		noTickets: "تیکتی ثبت نشده است",
		createFirst: "اولین تیکت خود را ثبت کنید تا کمک بگیرید",
		newTicket: "تیکت جدید",
		subject: "موضوع",
		message: "پیام",
		priority: "اولویت",
		category: "دسته‌بندی",
		send: "ارسال تیکت",
		cancel: "انصراف",
		adminReply: "پاسخ پشتیبانی",
		status: "وضعیت",
		createdAt: "تاریخ ایجاد",
		noReply: "در انتظار پاسخ...",
		low: "کم",
		medium: "متوسط",
		high: "زیاد",
		general: "عمومی",
		technical: "فنی",
		billing: "مالی",
		content: "محتوا",
		account: "حساب کاربری",
		other: "سایر",
		open: "باز",
		in_progress: "در حال بررسی",
		answered: "پاسخ داده شده",
		closed: "بسته شده",
		success: "تیکت با موفقیت ثبت شد",
		error: "خطا در ثبت تیکت",
	},
};

const statusColors: Record<string, string> = {
	open: "#3B82F6",
	in_progress: "#F59E0B",
	answered: "#22C55E",
	closed: "#6B7280",
};

export default function TicketsPage() {
	const { language } = useLanguage();
	const isRTL = language === "fa";
	const t = translations[language] || translations.en;
	const isAuthenticated = useIsAuthenticated();

	const [tickets, setTickets] = useState<TicketData[]>([]);
	const [loading, setLoading] = useState(true);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [snackbar, setSnackbar] = useState<string | null>(null);
	const [form, setForm] = useState<CreateTicketInput>({
		subject: "",
		message: "",
		priority: "medium",
		category: "general",
	});

	const fetchTickets = useCallback(async () => {
		if (!isAuthenticated) return;
		try {
			setLoading(true);
			const data = await userApi.getMyTickets();
			setTickets(Array.isArray(data) ? data : []);
		} catch {
			setTickets([]);
		} finally {
			setLoading(false);
		}
	}, [isAuthenticated]);

	useEffect(() => {
		fetchTickets();
	}, [fetchTickets]);

	const handleSubmit = async () => {
		if (!form.subject.trim() || !form.message.trim()) return;
		setSubmitting(true);
		try {
			await userApi.createTicket(form);
			setSnackbar(t.success);
			setDialogOpen(false);
			setForm({ subject: "", message: "", priority: "medium", category: "general" });
			fetchTickets();
		} catch {
			setSnackbar(t.error);
		} finally {
			setSubmitting(false);
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "answered":
				return <CheckCircleIcon sx={{ fontSize: 18, color: "#22C55E" }} />;
			case "in_progress":
				return <HourglassEmptyIcon sx={{ fontSize: 18, color: "#F59E0B" }} />;
			case "closed":
				return <ErrorIcon sx={{ fontSize: 18, color: "#6B7280" }} />;
			default:
				return <ConfirmationNumberIcon sx={{ fontSize: 18, color: "#3B82F6" }} />;
		}
	};

	const formatDate = (dateStr: string) =>
		new Date(dateStr).toLocaleDateString(isRTL ? "fa-IR" : "en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});

	const glassInputSx = {
		"& .MuiOutlinedInput-root": {
			background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
			backdropFilter: `blur(${glassBlur.medium})`,
			borderRadius: glassBorderRadius.lg,
			color: glassColors.text.primary,
			"& fieldset": { borderColor: glassColors.glass.border },
			"&:hover fieldset": { borderColor: `${glassColors.persianGold}60` },
			"&.Mui-focused fieldset": { borderColor: glassColors.persianGold },
		},
		"& .MuiInputLabel-root": {
			color: glassColors.text.tertiary,
			"&.Mui-focused": { color: glassColors.persianGold },
		},
	};

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
				<CircularProgress sx={{ color: glassColors.persianGold }} />
			</Box>
		);
	}

	return (
		<Box sx={{ maxWidth: 900, mx: "auto" }} dir={isRTL ? "rtl" : "ltr"}>
			{/* Header */}
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					mb: 3,
				}}
			>
				<Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
					<ConfirmationNumberIcon sx={{ color: glassColors.persianGold, fontSize: 28 }} />
					<Typography variant="h5" sx={{ color: glassColors.text.primary, fontWeight: 700 }}>
						{t.tickets}
					</Typography>
				</Box>
				<Button
					variant="contained"
					startIcon={<AddIcon />}
					onClick={() => setDialogOpen(true)}
					sx={{
						borderRadius: glassBorderRadius.lg,
						background: `linear-gradient(135deg, ${glassColors.persianGold}, #D97706)`,
						color: glassColors.black,
						fontWeight: 600,
						textTransform: "none",
						"&:hover": {
							background: `linear-gradient(135deg, #FBBF24, ${glassColors.persianGold})`,
						},
					}}
				>
					{t.newTicket}
				</Button>
			</Box>

			{/* Tickets List */}
			{tickets.length === 0 ? (
				<Box
					sx={{
						background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
						backdropFilter: `blur(${glassBlur.medium})`,
						border: `1px solid ${glassColors.glass.border}`,
						borderRadius: glassBorderRadius.xl,
						p: 6,
						textAlign: "center",
					}}
				>
					<ConfirmationNumberIcon sx={{ fontSize: 48, color: glassColors.text.tertiary, mb: 2 }} />
					<Typography sx={{ color: glassColors.text.secondary, mb: 1 }}>{t.noTickets}</Typography>
					<Typography sx={{ color: glassColors.text.tertiary, fontSize: "0.875rem" }}>
						{t.createFirst}
					</Typography>
				</Box>
			) : (
				<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
					{tickets.map((ticket) => (
						<Accordion
							key={ticket.id}
							sx={{
								background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
								backdropFilter: `blur(${glassBlur.medium})`,
								border: `1px solid ${glassColors.glass.border}`,
								borderRadius: `${glassBorderRadius.lg} !important`,
								"&:before": { display: "none" },
								"&.Mui-expanded": { margin: 0 },
							}}
						>
							<AccordionSummary
								expandIcon={<ExpandMoreIcon sx={{ color: glassColors.text.secondary }} />}
							>
								<Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flex: 1, flexWrap: "wrap" }}>
									{getStatusIcon(ticket.status)}
									<Typography sx={{ color: glassColors.text.primary, fontWeight: 600, flex: 1 }}>
										{ticket.subject}
									</Typography>
									<Chip
										label={t[ticket.status as keyof typeof t] || ticket.status}
										size="small"
										sx={{
											background: `${statusColors[ticket.status]}20`,
											color: statusColors[ticket.status],
											border: `1px solid ${statusColors[ticket.status]}40`,
											fontSize: "0.75rem",
										}}
									/>
									<Chip
										label={t[ticket.priority as keyof typeof t] || ticket.priority}
										size="small"
										variant="outlined"
										sx={{
											borderColor: glassColors.glass.border,
											color: glassColors.text.tertiary,
											fontSize: "0.75rem",
										}}
									/>
									<Typography sx={{ color: glassColors.text.tertiary, fontSize: "0.75rem" }}>
										{formatDate(ticket.createdAt)}
									</Typography>
								</Box>
							</AccordionSummary>
							<AccordionDetails>
								<Box
									sx={{
										background: glassColors.glass.base,
										borderRadius: glassBorderRadius.md,
										p: 2,
										mb: ticket.adminReply ? 2 : 0,
									}}
								>
									<Typography sx={{ color: glassColors.text.secondary, whiteSpace: "pre-wrap" }}>
										{ticket.message}
									</Typography>
								</Box>
								{ticket.adminReply ? (
									<Box
										sx={{
											background: `${glassColors.persianGold}10`,
											border: `1px solid ${glassColors.persianGold}30`,
											borderRadius: glassBorderRadius.md,
											p: 2,
										}}
									>
										<Typography
											sx={{ color: glassColors.persianGold, fontWeight: 600, fontSize: "0.875rem", mb: 1 }}
										>
											{t.adminReply}
										</Typography>
										<Typography sx={{ color: glassColors.text.secondary, whiteSpace: "pre-wrap" }}>
											{ticket.adminReply}
										</Typography>
										{ticket.adminReplyAt && (
											<Typography sx={{ color: glassColors.text.tertiary, fontSize: "0.75rem", mt: 1 }}>
												{formatDate(ticket.adminReplyAt)}
											</Typography>
										)}
									</Box>
								) : (
									<Typography sx={{ color: glassColors.text.tertiary, fontStyle: "italic", fontSize: "0.875rem" }}>
										{t.noReply}
									</Typography>
								)}
							</AccordionDetails>
						</Accordion>
					))}
				</Box>
			)}

			{/* Create Ticket Dialog */}
			<Dialog
				open={dialogOpen}
				onClose={() => setDialogOpen(false)}
				maxWidth="sm"
				fullWidth
				PaperProps={{
					sx: {
						background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
						backdropFilter: `blur(${glassBlur.strong})`,
						border: `1px solid ${glassColors.glass.border}`,
						borderRadius: glassBorderRadius.xl,
						color: glassColors.text.primary,
					},
				}}
			>
				<DialogTitle sx={{ color: glassColors.text.primary }}>{t.newTicket}</DialogTitle>
				<DialogContent>
					<Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, mt: 1 }}>
						<TextField
							fullWidth
							label={t.subject}
							value={form.subject}
							onChange={(e) => setForm({ ...form, subject: e.target.value })}
							sx={glassInputSx}
						/>
						<TextField
							fullWidth
							label={t.message}
							value={form.message}
							onChange={(e) => setForm({ ...form, message: e.target.value })}
							multiline
							rows={4}
							sx={glassInputSx}
						/>
						<Box sx={{ display: "flex", gap: 2 }}>
							<FormControl fullWidth sx={glassInputSx}>
								<InputLabel>{t.priority}</InputLabel>
								<Select
									value={form.priority || "medium"}
									label={t.priority}
									onChange={(e) => setForm({ ...form, priority: e.target.value as any })}
								>
									<MenuItem value="low">{t.low}</MenuItem>
									<MenuItem value="medium">{t.medium}</MenuItem>
									<MenuItem value="high">{t.high}</MenuItem>
								</Select>
							</FormControl>
							<FormControl fullWidth sx={glassInputSx}>
								<InputLabel>{t.category}</InputLabel>
								<Select
									value={form.category || "general"}
									label={t.category}
									onChange={(e) => setForm({ ...form, category: e.target.value as any })}
								>
									<MenuItem value="general">{t.general}</MenuItem>
									<MenuItem value="technical">{t.technical}</MenuItem>
									<MenuItem value="billing">{t.billing}</MenuItem>
									<MenuItem value="content">{t.content}</MenuItem>
									<MenuItem value="account">{t.account}</MenuItem>
									<MenuItem value="other">{t.other}</MenuItem>
								</Select>
							</FormControl>
						</Box>
					</Box>
				</DialogContent>
				<DialogActions sx={{ px: 3, pb: 2 }}>
					<Button
						onClick={() => setDialogOpen(false)}
						sx={{ color: glassColors.text.secondary, textTransform: "none" }}
					>
						{t.cancel}
					</Button>
					<Button
						variant="contained"
						onClick={handleSubmit}
						disabled={submitting || !form.subject.trim() || !form.message.trim()}
						sx={{
							borderRadius: glassBorderRadius.lg,
							background: `linear-gradient(135deg, ${glassColors.persianGold}, #D97706)`,
							color: glassColors.black,
							fontWeight: 600,
							textTransform: "none",
							"&:hover": {
								background: `linear-gradient(135deg, #FBBF24, ${glassColors.persianGold})`,
							},
						}}
					>
						{submitting ? <CircularProgress size={20} /> : t.send}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Snackbar */}
			<Snackbar
				open={!!snackbar}
				autoHideDuration={3000}
				onClose={() => setSnackbar(null)}
				message={snackbar}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
				sx={{
					"& .MuiSnackbarContent-root": {
						background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
						backdropFilter: "blur(20px)",
						border: `1px solid ${glassColors.glass.border}`,
						borderRadius: glassBorderRadius.md,
						color: glassColors.text.primary,
					},
				}}
			/>
		</Box>
	);
}
