"use client";

import { Ban, CheckCircle, Edit, Eye, Trash2, Plus } from "lucide-react";
import Link from "next/link";
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
	Select,
	MenuItem,
	InputLabel,
	FormControl,
	Switch,
	FormControlLabel,
} from "@mui/material";
import { usersApi } from "@/lib/api/admin";
import { useTranslation } from "@/i18n";

export default function UsersManagementPage() {
	const { t } = useTranslation();
	const [users, setUsers] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [total, setTotal] = useState(0);
	const [search, setSearch] = useState("");
	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const [newUser, setNewUser] = useState({
		email: "",
		password: "",
		name: "",
		role: "user" as string,
		isActive: true,
	});
	const [feedback, setFeedback] = useState<{
		type: "success" | "error";
		message: string;
	} | null>(null);
	const [confirmDialog, setConfirmDialog] = useState<{
		open: boolean;
		title: string;
		message: string;
		onConfirm: () => void;
	}>({
		open: false,
		title: "",
		message: "",
		onConfirm: () => {},
	});

	const fetchUsers = async () => {
		setLoading(true);
		try {
			const response = await usersApi.list({ page, limit: 20, search });
			setUsers(response.data || []);
			setTotal(response.total || 0);
		} catch (error) {
			console.error("Failed to fetch users:", error);
			showFeedback("error", t("admin.users.fetchFailed"));
		} finally {
			setLoading(false);
		}
	};

	const showFeedback = (type: "success" | "error", message: string) => {
		setFeedback({ type, message });
	};

	const showConfirm = (
		title: string,
		message: string,
		onConfirm: () => void,
	) => {
		setConfirmDialog({
			open: true,
			title,
			message,
			onConfirm,
		});
	};

	const handleConfirmClose = (confirmed: boolean) => {
		if (confirmed) {
			confirmDialog.onConfirm();
		}
		setConfirmDialog({
			open: false,
			title: "",
			message: "",
			onConfirm: () => {},
		});
	};

	useEffect(() => {
		fetchUsers();
	}, [page, search]);

	const handleCreateUser = async () => {
		// Validation
		if (!newUser.email || !newUser.password || !newUser.name) {
			showFeedback("error", "لطفا تمام فیلدهای الزامی را پر کنید");
			return;
		}
		if (newUser.password.length < 6) {
			showFeedback("error", "رمز عبور باید حداقل 6 کاراکتر باشد");
			return;
		}

		try {
			await usersApi.create(newUser);
			showFeedback("success", "کاربر با موفقیت ایجاد شد");
			setCreateDialogOpen(false);
			setNewUser({
				email: "",
				password: "",
				name: "",
				role: "user",
				isActive: true,
			});
			fetchUsers();
		} catch (error: any) {
			console.error("Failed to create user:", error);
			const message = error.response?.data?.message || "خطا در ایجاد کاربر";
			showFeedback("error", message);
		}
	};

	const handleToggleActive = async (id: string, isActive: boolean) => {
		try {
			await usersApi.update(id, { isActive: !isActive });
			showFeedback("success", t("admin.users.updateSuccess"));
			fetchUsers();
		} catch (error) {
			console.error("Failed to update user:", error);
			showFeedback("error", t("admin.users.updateFailed"));
		}
	};

	const handleDelete = async (id: string) => {
		showConfirm(
			t("admin.users.title"),
			t("admin.users.confirmDelete"),
			async () => {
				try {
					await usersApi.delete(id);
					showFeedback("success", t("admin.users.deleteSuccess"));
					fetchUsers();
				} catch (error) {
					console.error("Failed to delete user:", error);
					showFeedback("error", t("admin.users.deleteFailed"));
				}
			},
		);
	};

	return (
		<div className="space-y-4 sm:space-y-6">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-xl sm:text-3xl font-bold text-gray-900">{t("admin.users.title")}</h1>
					<p className="text-sm text-gray-600">{t("admin.users.description")}</p>
				</div>
				<Button onClick={() => setCreateDialogOpen(true)}>
					<Plus className="h-4 w-4 mr-2" />
					ایجاد کاربر
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>{t("admin.users.usersList")}</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="mb-4">
						<input
							type="text"
							placeholder={t("admin.users.searchPlaceholder")}
							value={search}
							onChange={(e) => {
								setSearch(e.target.value);
								setPage(1);
							}}
							className="w-full rounded-md border border-gray-300 px-3 py-2"
						/>
					</div>
					{loading ? (
						<div className="p-6 text-center">{t("admin.messages.loading")}</div>
					) : (
						<>
							<div className="overflow-x-auto -mx-4 sm:mx-0">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>{t("admin.users.name")}</TableHead>
										<TableHead>{t("admin.users.email")}</TableHead>
										<TableHead>{t("admin.users.role")}</TableHead>
										<TableHead>{t("admin.users.status")}</TableHead>
										<TableHead>{t("admin.users.actions")}</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{users.map((user) => (
										<TableRow key={user.id}>
											<TableCell className="font-medium">{user.name}</TableCell>
											<TableCell>{user.email}</TableCell>
											<TableCell>{user.role}</TableCell>
											<TableCell>
												<span
													className={`rounded-full px-2 py-1 text-xs ${
														user.isActive
															? "bg-green-100 text-green-800"
															: "bg-red-100 text-red-800"
													}`}
												>
													{user.isActive ? t("admin.users.active") : t("admin.users.blocked")}
												</span>
											</TableCell>
											<TableCell>
												<div className="flex gap-2">
													<Link href={`/admin/users/${user.id}`}>
														<Button variant="outline" size="sm" title={t("admin.users.viewDetail")}>
															<Eye className="h-4 w-4" />
														</Button>
													</Link>
													<Button
														variant="outline"
														size="sm"
														onClick={() =>
															handleToggleActive(user.id, user.isActive)
														}
													>
														{user.isActive ? (
															<Ban className="h-4 w-4" />
														) : (
															<CheckCircle className="h-4 w-4" />
														)}
													</Button>
													<Button
														variant="destructive"
														size="sm"
														onClick={() => handleDelete(user.id)}
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
							</div>
							<div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
								<div className="text-sm text-gray-600">
									{t("admin.users.showing")} {(page - 1) * 20 + 1} {t("admin.users.to")}{" "}
									{Math.min(page * 20, total)} {t("admin.users.of")} {total}
								</div>
								<div className="flex gap-2">
									<Button
										variant="outline"
										onClick={() => setPage((p) => Math.max(1, p - 1))}
										disabled={page === 1}
									>
										{t("admin.users.previous")}
									</Button>
									<Button
										variant="outline"
										onClick={() => setPage((p) => p + 1)}
										disabled={page * 20 >= total}
									>
										{t("admin.users.next")}
									</Button>
								</div>
							</div>
						</>
					)}
				</CardContent>
			</Card>

			{/* Create User Dialog */}
			<Dialog
				open={createDialogOpen}
				onClose={() => setCreateDialogOpen(false)}
				dir="rtl"
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle>ایجاد کاربر جدید</DialogTitle>
				<DialogContent>
					<div className="space-y-4 pt-4">
						<TextField
							fullWidth
							label="نام کاربر"
							value={newUser.name}
							onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
							required
						/>
						<TextField
							fullWidth
							label="ایمیل"
							type="email"
							value={newUser.email}
							onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
							required
						/>
						<TextField
							fullWidth
							label="رمز عبور"
							type="password"
							value={newUser.password}
							onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
							required
							helperText="حداقل 6 کاراکتر"
						/>
						<FormControl fullWidth>
							<InputLabel>نقش کاربر</InputLabel>
							<Select
								value={newUser.role}
								onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
								label="نقش کاربر"
							>
								<MenuItem value="user">
									<div>
										<div className="font-medium">کاربر عادی - User</div>
										<div className="text-xs text-gray-500">دسترسی عادی به سایت</div>
									</div>
								</MenuItem>
								<MenuItem value="viewer">
									<div>
										<div className="font-medium">بازدیدکننده پنل - Viewer</div>
										<div className="text-xs text-gray-500">فقط مشاهده اطلاعات پنل</div>
									</div>
								</MenuItem>
								<MenuItem value="content_manager">
									<div>
										<div className="font-medium">مدیر محتوا - Content Manager</div>
										<div className="text-xs text-gray-500">مدیریت ویدیوها و محتوا</div>
									</div>
								</MenuItem>
								<MenuItem value="finance">
									<div>
										<div className="font-medium">مدیر مالی - Finance</div>
										<div className="text-xs text-gray-500">دسترسی به بخش مالی</div>
									</div>
								</MenuItem>
								<MenuItem value="admin">
									<div>
										<div className="font-medium">ادمین - Admin</div>
										<div className="text-xs text-gray-500">دسترسی کامل به پنل و سایت</div>
									</div>
								</MenuItem>
							</Select>
						</FormControl>
						<FormControlLabel
							control={
								<Switch
									checked={newUser.isActive}
									onChange={(e) => setNewUser({ ...newUser, isActive: e.target.checked })}
								/>
							}
							label="فعال"
						/>
					</div>
				</DialogContent>
				<DialogActions>
					<MuiButton onClick={() => setCreateDialogOpen(false)} color="inherit">
						انصراف
					</MuiButton>
					<MuiButton
						onClick={handleCreateUser}
						color="primary"
						variant="contained"
						disabled={!newUser.email || !newUser.password || newUser.password.length < 6 || !newUser.name}
					>
						ذخیره
					</MuiButton>
				</DialogActions>
			</Dialog>

			{/* Confirmation Dialog */}
			<Dialog
				open={confirmDialog.open}
				onClose={() => handleConfirmClose(false)}
				dir="rtl"
			>
				<DialogTitle>{confirmDialog.title}</DialogTitle>
				<DialogContent>
					<DialogContentText>{confirmDialog.message}</DialogContentText>
				</DialogContent>
				<DialogActions>
					<MuiButton onClick={() => handleConfirmClose(false)} color="inherit">
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

			{/* Toast Notification */}
			<Snackbar
				open={!!feedback}
				autoHideDuration={3000}
				onClose={() => setFeedback(null)}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			>
				<Alert
					onClose={() => setFeedback(null)}
					severity={feedback?.type === "success" ? "success" : "error"}
					variant="filled"
					sx={{ width: "100%" }}
				>
					{feedback?.message}
				</Alert>
			</Snackbar>
		</div>
	);
}
