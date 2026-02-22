"use client";

import { CalendarClock, Edit, Plus, Trash2, Search, Eye } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
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
	Chip,
	Select,
	MenuItem,
	InputLabel,
	FormControl,
	Avatar,
	AvatarGroup,
	Box,
} from "@mui/material";
import { PersianDatePicker } from "@/components/admin/ui/persian-date-picker";
import { playTablesApi, contentApi } from "@/lib/api/admin";

interface PlayTableItem {
	id: string;
	title: string;
	titleFa: string | null;
	description: string | null;
	descriptionFa: string | null;
	contentIds: string[];
	startTime: string;
	endTime: string;
	status: string;
	imageUrl: string | null;
	isActive: boolean;
	sortOrder: number;
	contents?: Array<{
		id: string;
		title: string;
		posterUrl?: string;
	}>;
}

interface ContentSearchItem {
	id: string;
	title: string;
	posterUrl?: string;
	year?: number;
	type?: string;
}

const emptyForm = {
	title: "",
	titleFa: "",
	description: "",
	descriptionFa: "",
	contentIds: [] as string[],
	startTime: "",
	endTime: "",
	status: "draft",
	imageUrl: "",
	isActive: true,
	sortOrder: 0,
};

const statusColors: Record<string, "default" | "warning" | "success" | "info"> = {
	draft: "default",
	scheduled: "info",
	active: "success",
	archived: "warning",
};

const statusLabels: Record<string, string> = {
	draft: "پیش‌نویس",
	scheduled: "زمان‌بندی شده",
	active: "فعال",
	archived: "آرشیو",
};

export default function PlayTablesPage() {
	const [items, setItems] = useState<PlayTableItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

	// Form state
	const [showForm, setShowForm] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [form, setForm] = useState(emptyForm);

	// Content search
	const [contentSearch, setContentSearch] = useState("");
	const [contentResults, setContentResults] = useState<ContentSearchItem[]>([]);
	const [selectedContents, setSelectedContents] = useState<ContentSearchItem[]>([]);
	const [searchLoading, setSearchLoading] = useState(false);

	// Delete dialog
	const [deleteId, setDeleteId] = useState<string | null>(null);

	const fetchData = async () => {
		try {
			setLoading(true);
			const res = await playTablesApi.list();
			setItems(res.data || []);
		} catch (err: any) {
			setFeedback({ type: "error", message: err.message || "خطا در دریافت جدول پخش" });
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => { fetchData(); }, []);

	// Search content when user types
	useEffect(() => {
		if (!contentSearch.trim()) {
			setContentResults([]);
			return;
		}
		const timer = setTimeout(async () => {
			try {
				setSearchLoading(true);
				const res = await contentApi.list({ search: contentSearch, limit: 10 });
				const list = res.items || res.data || [];
				setContentResults(list);
			} catch {
				setContentResults([]);
			} finally {
				setSearchLoading(false);
			}
		}, 400);
		return () => clearTimeout(timer);
	}, [contentSearch]);

	const openCreateForm = () => {
		setForm(emptyForm);
		setSelectedContents([]);
		setEditingId(null);
		setShowForm(true);
	};

	const openEditForm = (item: PlayTableItem) => {
		setForm({
			title: item.title,
			titleFa: item.titleFa || "",
			description: item.description || "",
			descriptionFa: item.descriptionFa || "",
			contentIds: item.contentIds || [],
			startTime: item.startTime ? new Date(item.startTime).toISOString().slice(0, 16) : "",
			endTime: item.endTime ? new Date(item.endTime).toISOString().slice(0, 16) : "",
			status: item.status || "draft",
			imageUrl: item.imageUrl || "",
			isActive: item.isActive ?? true,
			sortOrder: item.sortOrder ?? 0,
		});
		setSelectedContents(item.contents || []);
		setEditingId(item.id);
		setShowForm(true);
	};

	const handleSave = async () => {
		try {
			const payload = {
				...form,
				contentIds: selectedContents.map((c) => c.id),
				startTime: form.startTime ? new Date(form.startTime).toISOString() : new Date().toISOString(),
				endTime: form.endTime ? new Date(form.endTime).toISOString() : new Date().toISOString(),
			};

			if (editingId) {
				await playTablesApi.update(editingId, payload);
				setFeedback({ type: "success", message: "جدول پخش بروزرسانی شد" });
			} else {
				await playTablesApi.create(payload);
				setFeedback({ type: "success", message: "جدول پخش ایجاد شد" });
			}
			setShowForm(false);
			fetchData();
		} catch (err: any) {
			setFeedback({ type: "error", message: err?.response?.data?.message || err.message || "خطا" });
		}
	};

	const handleDelete = async () => {
		if (!deleteId) return;
		try {
			await playTablesApi.delete(deleteId);
			setFeedback({ type: "success", message: "جدول پخش حذف شد" });
			setDeleteId(null);
			fetchData();
		} catch (err: any) {
			setFeedback({ type: "error", message: err.message || "خطا در حذف" });
		}
	};

	const addContentToSelection = (content: ContentSearchItem) => {
		if (selectedContents.some((c) => c.id === content.id)) return;
		setSelectedContents((prev) => [...prev, content]);
		setContentSearch("");
		setContentResults([]);
	};

	const removeContentFromSelection = (id: string) => {
		setSelectedContents((prev) => prev.filter((c) => c.id !== id));
	};

	const formatDate = (d: string) => {
		if (!d) return "—";
		try {
			return new Intl.DateTimeFormat("fa-IR", {
				year: "numeric",
				month: "short",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit",
			}).format(new Date(d));
		} catch {
			return d;
		}
	};

	return (
		<div className="space-y-6 p-6" dir="rtl">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle className="flex items-center gap-2">
						<CalendarClock className="h-5 w-5" />
						جدول پخش
					</CardTitle>
					<Button onClick={openCreateForm}>
						<Plus className="h-4 w-4 ml-1" /> جدول جدید
					</Button>
				</CardHeader>

				<CardContent>
					{loading ? (
						<p className="text-center text-gray-400 py-8">در حال بارگذاری...</p>
					) : items.length === 0 ? (
						<p className="text-center text-gray-400 py-8">هنوز جدول پخشی ایجاد نشده</p>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>عنوان</TableHead>
									<TableHead>وضعیت</TableHead>
									<TableHead>زمان شروع</TableHead>
									<TableHead>زمان پایان</TableHead>
									<TableHead>محتواها</TableHead>
									<TableHead>ترتیب</TableHead>
									<TableHead>عملیات</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{items.map((item) => (
									<TableRow key={item.id}>
										<TableCell>
											<div className="font-medium">{item.titleFa || item.title}</div>
											{item.titleFa && (
												<div className="text-xs text-gray-400">{item.title}</div>
											)}
										</TableCell>
										<TableCell>
											<Chip
												label={statusLabels[item.status] || item.status}
												color={statusColors[item.status] || "default"}
												size="small"
												variant="outlined"
											/>
											{!item.isActive && (
												<Chip label="غیرفعال" size="small" color="error" variant="outlined" sx={{ ml: 0.5 }} />
											)}
										</TableCell>
										<TableCell className="text-xs">{formatDate(item.startTime)}</TableCell>
										<TableCell className="text-xs">{formatDate(item.endTime)}</TableCell>
										<TableCell>
											{item.contents && item.contents.length > 0 ? (
												<AvatarGroup max={4} sx={{ justifyContent: "flex-end" }}>
													{item.contents.map((c: any) => (
														<Avatar
															key={c.id}
															src={c.posterUrl}
															alt={c.title}
															sx={{ width: 32, height: 32 }}
														/>
													))}
												</AvatarGroup>
											) : (
												<span className="text-gray-400 text-xs">{item.contentIds.length} محتوا</span>
											)}
										</TableCell>
										<TableCell>{item.sortOrder}</TableCell>
										<TableCell>
											<div className="flex gap-1">
												<Button variant="ghost" size="sm" onClick={() => openEditForm(item)}>
													<Edit className="h-4 w-4" />
												</Button>
												<Button variant="ghost" size="sm" onClick={() => setDeleteId(item.id)}>
													<Trash2 className="h-4 w-4 text-red-400" />
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
			<Dialog
				open={showForm}
				onClose={() => setShowForm(false)}
				maxWidth="md"
				fullWidth
				PaperProps={{
					sx: {
						bgcolor: "#1a1a2e",
						color: "#e2e8f0",
						borderRadius: 3,
						border: "1px solid rgba(255,255,255,0.1)",
					},
				}}
			>
				<DialogTitle>{editingId ? "ویرایش جدول پخش" : "ایجاد جدول پخش جدید"}</DialogTitle>
				<DialogContent>
					<div className="space-y-4 mt-2">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label>عنوان (انگلیسی)</Label>
								<Input
									value={form.title}
									onChange={(e) => setForm({ ...form, title: e.target.value })}
									placeholder="Friday Night Movies"
								/>
							</div>
							<div className="space-y-2">
								<Label>عنوان (فارسی)</Label>
								<Input
									value={form.titleFa}
									onChange={(e) => setForm({ ...form, titleFa: e.target.value })}
									placeholder="فیلم‌های جمعه شب"
								/>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label>توضیحات</Label>
								<Input
									value={form.description}
									onChange={(e) => setForm({ ...form, description: e.target.value })}
								/>
							</div>
							<div className="space-y-2">
								<Label>توضیحات (فارسی)</Label>
								<Input
									value={form.descriptionFa}
									onChange={(e) => setForm({ ...form, descriptionFa: e.target.value })}
								/>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label>زمان شروع</Label>
								<Input
									type="datetime-local"
									value={form.startTime}
									onChange={(e) => setForm({ ...form, startTime: e.target.value })}
								/>
							</div>
							<div className="space-y-2">
								<Label>زمان پایان</Label>
								<Input
									type="datetime-local"
									value={form.endTime}
									onChange={(e) => setForm({ ...form, endTime: e.target.value })}
								/>
							</div>
						</div>

						<div className="grid grid-cols-3 gap-4">
							<div className="space-y-2">
								<Label>وضعیت</Label>
								<select
									value={form.status}
									onChange={(e) => setForm({ ...form, status: e.target.value })}
									className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-gray-100"
								>
									<option value="draft">پیش‌نویس</option>
									<option value="scheduled">زمان‌بندی شده</option>
									<option value="active">فعال</option>
									<option value="archived">آرشیو</option>
								</select>
							</div>
							<div className="space-y-2">
								<Label>ترتیب نمایش</Label>
								<Input
									type="number"
									value={form.sortOrder}
									onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
								/>
							</div>
							<div className="flex items-end pb-1">
								<FormControlLabel
									control={
										<Switch
											checked={form.isActive}
											onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
											size="small"
										/>
									}
									label="فعال"
									sx={{ color: "#e2e8f0" }}
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label>تصویر کاور</Label>
							<Input
								value={form.imageUrl}
								onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
								placeholder="https://..."
							/>
							{form.imageUrl && (
								<img
									src={form.imageUrl}
									alt="cover"
									className="h-20 rounded-lg object-cover mt-1"
								/>
							)}
						</div>

						{/* Content selection */}
						<div className="space-y-2 rounded-lg border border-gray-700 p-4">
							<Label className="text-base font-semibold">📺 محتواها</Label>

							{/* Selected contents */}
							{selectedContents.length > 0 && (
								<div className="flex flex-wrap gap-2 mb-3">
									{selectedContents.map((c) => (
										<Chip
											key={c.id}
											avatar={<Avatar src={c.posterUrl} alt={c.title} />}
											label={c.title}
											onDelete={() => removeContentFromSelection(c.id)}
											variant="outlined"
											sx={{ color: "#e2e8f0", borderColor: "rgba(255,255,255,0.2)" }}
										/>
									))}
								</div>
							)}

							{/* Search */}
							<div className="relative">
								<div className="flex gap-2">
									<Input
										value={contentSearch}
										onChange={(e) => setContentSearch(e.target.value)}
										placeholder="جستجوی محتوا..."
										className="flex-1"
									/>
									<Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
								</div>
								{contentResults.length > 0 && (
									<div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-600 bg-gray-800 shadow-xl max-h-60 overflow-y-auto">
										{contentResults.map((c) => (
											<button
												key={c.id}
												type="button"
												onClick={() => addContentToSelection(c)}
												className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-700 text-right text-sm text-gray-100 transition"
											>
												<Avatar src={c.posterUrl} sx={{ width: 28, height: 28 }} />
												<span>{c.title}</span>
												{c.year && <span className="text-gray-400 text-xs mr-auto">{c.year}</span>}
												{c.type && (
													<Chip
														label={c.type === "series" ? "سریال" : "فیلم"}
														size="small"
														variant="outlined"
														sx={{ fontSize: "0.65rem", height: 20, color: "#94a3b8" }}
													/>
												)}
											</button>
										))}
									</div>
								)}
							</div>
						</div>
					</div>
				</DialogContent>
				<DialogActions>
					<MuiButton onClick={() => setShowForm(false)} sx={{ color: "#94a3b8" }}>
						لغو
					</MuiButton>
					<MuiButton
						onClick={handleSave}
						variant="contained"
						disabled={!form.title.trim()}
						sx={{
							bgcolor: "#6366f1",
							"&:hover": { bgcolor: "#4f46e5" },
						}}
					>
						{editingId ? "بروزرسانی" : "ایجاد"}
					</MuiButton>
				</DialogActions>
			</Dialog>

			{/* Delete confirmation */}
			<Dialog
				open={!!deleteId}
				onClose={() => setDeleteId(null)}
				PaperProps={{
					sx: {
						bgcolor: "#1a1a2e",
						color: "#e2e8f0",
						borderRadius: 3,
						border: "1px solid rgba(255,255,255,0.1)",
					},
				}}
			>
				<DialogTitle>حذف جدول پخش</DialogTitle>
				<DialogContent>
					<DialogContentText sx={{ color: "#94a3b8" }}>
						آیا از حذف این جدول پخش مطمئن هستید؟ این عمل قابل بازگشت نیست.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<MuiButton onClick={() => setDeleteId(null)} sx={{ color: "#94a3b8" }}>
						لغو
					</MuiButton>
					<MuiButton onClick={handleDelete} color="error" variant="contained">
						حذف
					</MuiButton>
				</DialogActions>
			</Dialog>

			{/* Feedback */}
			<Snackbar
				open={!!feedback}
				autoHideDuration={4000}
				onClose={() => setFeedback(null)}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			>
				<Alert
					severity={feedback?.type}
					onClose={() => setFeedback(null)}
					variant="filled"
				>
					{feedback?.message}
				</Alert>
			</Snackbar>
		</div>
	);
}
