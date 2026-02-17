"use client";

import { Edit, Plus, Trash2, Pin as PinIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/admin/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/admin/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/admin/ui/table";
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
	Chip,
} from "@mui/material";
import { pinsApi } from "@/lib/api/admin";

interface PinItem {
	id: string;
	contentId: string;
	content?: { id: string; title: string; posterUrl?: string } | null;
	section: string;
	label: string | null;
	labelFa: string | null;
	isActive: boolean;
	sortOrder: number;
}

const SECTIONS = [
	{ value: "hero", label: "اسلایدر اصلی (Hero)" },
	{ value: "new-movies", label: "فیلم جدید" },
	{ value: "foreign-series", label: "سریال خارجی" },
	{ value: "iranian-series", label: "سریال ایرانی" },
	{ value: "dubbed", label: "دوبله فارسی" },
	{ value: "animation", label: "انیمیشن" },
	{ value: "trending", label: "پرطرفدار" },
	{ value: "widget-grid", label: "ویجت گرید" },
];

const emptyForm = {
	contentId: "",
	section: "hero",
	label: "",
	labelFa: "",
	isActive: true,
	sortOrder: 0,
};

export default function PinsPage() {
	const [pins, setPins] = useState<PinItem[]>([]);
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

	const [formOpen, setFormOpen] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [form, setForm] = useState(emptyForm);
	const [filterSection, setFilterSection] = useState("");

	const fetchPins = async () => {
		setLoading(true);
		try {
			const res = await pinsApi.list(filterSection || undefined);
			setPins(res.data || []);
		} catch {
			showFeedback("error", "خطا در دریافت پین‌ها");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPins();
	}, [filterSection]);

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

	const openCreateForm = () => {
		setEditingId(null);
		setForm(emptyForm);
		setFormOpen(true);
	};

	const openEditForm = (p: PinItem) => {
		setEditingId(p.id);
		setForm({
			contentId: p.contentId,
			section: p.section,
			label: p.label || "",
			labelFa: p.labelFa || "",
			isActive: p.isActive,
			sortOrder: p.sortOrder,
		});
		setFormOpen(true);
	};

	const handleSave = async () => {
		try {
			const payload = {
				...form,
				label: form.label || undefined,
				labelFa: form.labelFa || undefined,
			};
			if (editingId) {
				await pinsApi.update(editingId, payload);
				showFeedback("success", "پین با موفقیت ویرایش شد");
			} else {
				await pinsApi.create(payload);
				showFeedback("success", "پین با موفقیت ایجاد شد");
			}
			setFormOpen(false);
			fetchPins();
		} catch (e: any) {
			showFeedback("error", e?.response?.data?.message || "خطا در ذخیره پین");
		}
	};

	const handleDelete = (p: PinItem) => {
		const title = p.content?.title || p.contentId.slice(0, 8);
		showConfirm("حذف پین", `آیا از حذف پین "${title}" مطمئن هستید؟`, async () => {
			try {
				await pinsApi.delete(p.id);
				showFeedback("success", "پین حذف شد");
				fetchPins();
			} catch {
				showFeedback("error", "خطا در حذف پین");
			}
		});
	};

	const handleToggleActive = async (p: PinItem) => {
		try {
			await pinsApi.update(p.id, { isActive: !p.isActive });
			fetchPins();
		} catch {
			showFeedback("error", "خطا در تغییر وضعیت");
		}
	};

	const getSectionLabel = (val: string) =>
		SECTIONS.find((s) => s.value === val)?.label || val;

	return (
		<div className="space-y-4 sm:space-y-6">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
						<PinIcon className="h-5 w-5 sm:h-6 sm:w-6" />
						مدیریت پین‌ها
					</h1>
					<p className="text-sm text-gray-500 mt-1">
						سنجاق کردن محتوا به بخش‌های مختلف صفحه اصلی
					</p>
				</div>
				<Button onClick={openCreateForm}>
					<Plus className="ml-2 h-4 w-4" />
					افزودن پین
				</Button>
			</div>

			{/* Filter by section */}
			<Card>
				<CardContent className="pt-4">
					<div className="flex items-center gap-4">
						<span className="text-sm font-medium text-gray-700">بخش:</span>
						<div className="flex flex-wrap gap-2">
							<Chip
								label="همه"
								variant={filterSection === "" ? "filled" : "outlined"}
								color={filterSection === "" ? "primary" : "default"}
								onClick={() => setFilterSection("")}
								size="small"
							/>
							{SECTIONS.map((sec) => (
								<Chip
									key={sec.value}
									label={sec.label}
									variant={filterSection === sec.value ? "filled" : "outlined"}
									color={filterSection === sec.value ? "primary" : "default"}
									onClick={() => setFilterSection(sec.value)}
									size="small"
								/>
							))}
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>پین‌ها ({pins.length})</CardTitle>
				</CardHeader>
				<CardContent>
					{loading ? (
						<p className="text-center py-8 text-gray-500">در حال بارگذاری...</p>
					) : pins.length === 0 ? (
						<p className="text-center py-8 text-gray-500">پینی یافت نشد</p>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>ترتیب</TableHead>
									<TableHead>تصویر</TableHead>
									<TableHead>محتوا</TableHead>
									<TableHead>بخش</TableHead>
									<TableHead>برچسب</TableHead>
									<TableHead>وضعیت</TableHead>
									<TableHead>عملیات</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{pins.map((p) => (
									<TableRow key={p.id}>
										<TableCell>{p.sortOrder}</TableCell>
										<TableCell>
											{p.content?.posterUrl ? (
												<img
													src={p.content.posterUrl}
													alt={p.content.title}
													className="w-10 h-14 object-cover rounded"
												/>
											) : (
												<div className="w-10 h-14 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">
													—
												</div>
											)}
										</TableCell>
										<TableCell>
											<p className="font-medium text-sm">
												{p.content?.title || p.contentId.slice(0, 12) + "..."}
											</p>
											<p className="text-xs text-gray-400 font-mono">
												{p.contentId.slice(0, 8)}
											</p>
										</TableCell>
										<TableCell>
											<Chip label={getSectionLabel(p.section)} size="small" />
										</TableCell>
										<TableCell className="text-sm">
											{p.labelFa || p.label || "—"}
										</TableCell>
										<TableCell>
											<Switch
												size="small"
												checked={p.isActive}
												onChange={() => handleToggleActive(p)}
											/>
										</TableCell>
										<TableCell>
											<div className="flex gap-1">
												<Button variant="ghost" size="sm" onClick={() => openEditForm(p)}>
													<Edit className="h-4 w-4" />
												</Button>
												<Button variant="ghost" size="sm" onClick={() => handleDelete(p)}>
													<Trash2 className="h-4 w-4 text-red-500" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>

			{/* Create/Edit Dialog */}
			<Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
				<DialogTitle>{editingId ? "ویرایش پین" : "افزودن پین جدید"}</DialogTitle>
				<DialogContent>
					<div className="grid grid-cols-2 gap-4 mt-2">
						<div className="col-span-2">
							<TextField
								label="شناسه محتوا (Content ID)"
								value={form.contentId}
								onChange={(e) => setForm({ ...form, contentId: e.target.value })}
								fullWidth
								size="small"
								placeholder="UUID محتوا"
								required
							/>
						</div>
						<FormControl fullWidth size="small">
							<InputLabel>بخش صفحه اصلی</InputLabel>
							<Select
								value={form.section}
								label="بخش صفحه اصلی"
								onChange={(e) => setForm({ ...form, section: e.target.value })}
							>
								{SECTIONS.map((sec) => (
									<MenuItem key={sec.value} value={sec.value}>
										{sec.label}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<TextField
							label="ترتیب نمایش"
							type="number"
							value={form.sortOrder}
							onChange={(e) =>
								setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })
							}
							fullWidth
							size="small"
						/>
						<TextField
							label="برچسب (انگلیسی)"
							value={form.label}
							onChange={(e) => setForm({ ...form, label: e.target.value })}
							fullWidth
							size="small"
							placeholder="Featured"
						/>
						<TextField
							label="برچسب فارسی"
							value={form.labelFa}
							onChange={(e) => setForm({ ...form, labelFa: e.target.value })}
							fullWidth
							size="small"
							placeholder="ویژه"
						/>
						<FormControlLabel
							control={
								<Switch
									checked={form.isActive}
									onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
								/>
							}
							label="فعال"
						/>
					</div>
				</DialogContent>
				<DialogActions>
					<MuiButton onClick={() => setFormOpen(false)}>انصراف</MuiButton>
					<MuiButton
						variant="contained"
						onClick={handleSave}
						disabled={!form.contentId || !form.section}
					>
						{editingId ? "ذخیره تغییرات" : "ایجاد"}
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
