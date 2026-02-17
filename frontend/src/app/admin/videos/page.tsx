"use client";

import { CheckCircle, Upload, XCircle, Trash2, PlayCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/admin/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/admin/ui/card";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
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
} from "@mui/material";
import { videosApi } from "@/lib/api/admin";
import { useTranslation } from "@/i18n";

export default function VideosManagementPage() {
	const { t } = useTranslation();
	const [videos, setVideos] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [uploading, setUploading] = useState(false);
	const [showUploadForm, setShowUploadForm] = useState(false);
	const [actionLoading, setActionLoading] = useState<string | null>(null);
	const [uploadForm, setUploadForm] = useState({
		contentId: "",
		quality: "1080p",
		file: null as File | null,
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

	const triggerFilePicker = () => {
		const el = document.getElementById(
			"video-upload",
		) as HTMLInputElement | null;
		el?.click();
	};

	const fetchVideos = async () => {
		setLoading(true);
		try {
			const response = await videosApi.list();
			setVideos(response.data || []);
		} catch (error) {
			console.error("Failed to fetch videos:", error);
			showFeedback("error", t("admin.videos.fetchFailed"));
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
		fetchVideos();
	}, []);

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setUploadForm({ ...uploadForm, file });
			setShowUploadForm(true);
		}
	};

	const handleUpload = async () => {
		if (!uploadForm.file || !uploadForm.contentId) {
			showFeedback("error", t("admin.videos.enterContentId"));
			return;
		}

		setUploading(true);
		try {
			await videosApi.upload(uploadForm.file, uploadForm.contentId, uploadForm.quality);
			fetchVideos();
			showFeedback("success", t("admin.videos.uploadSuccess"));
			setShowUploadForm(false);
			setUploadForm({ contentId: "", quality: "1080p", file: null });
		} catch (error) {
			console.error("Failed to upload video:", error);
			showFeedback("error", t("admin.videos.uploadFailed"));
		} finally {
			setUploading(false);
		}
	};

	const handleMarkReady = async (video: any) => {
		setActionLoading(video.id);
		try {
			await videosApi.markTranscoded(video.id, {
				hlsUrl: video.hlsUrl || `/storage/${video.contentId}/${video.quality}/video.mp4`,
				duration: video.duration || 0,
				status: "ready",
			});
			showFeedback("success", t("admin.videos.markReadySuccess"));
			fetchVideos();
		} catch (error) {
			console.error("Failed to mark ready:", error);
			showFeedback("error", t("admin.videos.markReadyFailed"));
		} finally {
			setActionLoading(null);
		}
	};

	const handleDelete = async (id: string) => {
		showConfirm(
			t("admin.videos.title"),
			t("admin.videos.deleteConfirm"),
			async () => {
				setActionLoading(id);
				try {
					await videosApi.delete(id);
					showFeedback("success", t("admin.videos.deleteSuccess"));
					fetchVideos();
				} catch (error) {
					console.error("Failed to delete video:", error);
					showFeedback("error", t("admin.videos.deleteFailed"));
				} finally {
					setActionLoading(null);
				}
			},
		);
	};

	return (
		<div className="space-y-4 sm:space-y-6">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-xl sm:text-3xl font-bold text-gray-900">{t("admin.videos.title")}</h1>
					<p className="text-sm text-gray-600">{t("admin.videos.description")}</p>
				</div>
				<div>
					<input
						type="file"
						accept="video/*"
						onChange={handleFileSelect}
						className="hidden"
						id="video-upload"
						disabled={uploading}
					/>
					<Button disabled={uploading} onClick={triggerFilePicker}>
						<Upload className="mr-2 h-4 w-4" />
						{t("admin.videos.uploadVideo")}
					</Button>
				</div>
			</div>

			{/* Upload Form */}
			{showUploadForm && (
				<Card className="border-2 border-blue-200 bg-blue-50">
					<CardHeader>
						<CardTitle className="text-blue-900">
							{t("admin.videos.uploadVideo")}: {uploadForm.file?.name}
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-sm text-blue-800">
							{t("admin.videos.uploadInstructions")}
						</p>
						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="contentId">{t("admin.videos.enterContentId")} *</Label>
								<Input
									id="contentId"
									placeholder={t("admin.videos.contentIdPlaceholder")}
									value={uploadForm.contentId}
									onChange={(e) => setUploadForm({ ...uploadForm, contentId: e.target.value })}
									className="bg-white"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="quality">{t("admin.videos.enterQuality")}</Label>
								<select
									id="quality"
									value={uploadForm.quality}
									onChange={(e) => setUploadForm({ ...uploadForm, quality: e.target.value })}
									className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white"
								>
									<option value="240p">240p (SD)</option>
									<option value="480p">480p (SD)</option>
									<option value="720p">720p (HD)</option>
									<option value="1080p">1080p (Full HD)</option>
									<option value="1440p">1440p (2K)</option>
									<option value="2160p">2160p (4K)</option>
								</select>
							</div>
						</div>
						<div className="flex gap-2">
							<Button onClick={handleUpload} disabled={uploading} className="flex-1">
								{uploading ? t("admin.videos.uploading") : t("admin.videos.uploadVideo")}
							</Button>
							<Button 
								variant="outline" 
								onClick={() => {
									setShowUploadForm(false);
									setUploadForm({ contentId: "", quality: "1080p", file: null });
								}}
								disabled={uploading}
							>
								{t("admin.form.cancel")}
							</Button>
						</div>
					</CardContent>
				</Card>
			)}

			<Card>
				<CardHeader>
					<CardTitle>{t("admin.videos.videoAssets")}</CardTitle>
				</CardHeader>
				<CardContent>
					{loading ? (
						<div className="p-6 text-center">{t("admin.messages.loading")}</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>{t("admin.videos.contentId")}</TableHead>
									<TableHead>{t("admin.videos.quality")}</TableHead>
									<TableHead>{t("admin.videos.status")}</TableHead>
									<TableHead>{t("admin.videos.fileSize")}</TableHead>
									<TableHead>{t("admin.videos.duration")}</TableHead>
									<TableHead>{t("admin.videos.created")}</TableHead>
									<TableHead>{t("admin.videos.actions")}</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{videos.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={7}
											className="text-center text-gray-500"
										>
											{t("admin.videos.noVideos")}
										</TableCell>
									</TableRow>
								) : (
									videos.map((video) => (
										<TableRow key={video.id}>
											<TableCell className="font-mono text-xs max-w-[200px] truncate" title={video.contentId}>
												{video.contentId}
											</TableCell>
											<TableCell>{video.quality}</TableCell>
											<TableCell>
												<div className="flex items-center gap-2">
													{video.status === "ready" ? (
														<CheckCircle className="h-4 w-4 text-green-600" />
													) : (
														<XCircle className="h-4 w-4 text-yellow-600" />
													)}
													<span className="capitalize">{video.status}</span>
												</div>
											</TableCell>
											<TableCell>
												{video.filesize
													? `${(video.filesize / (1024 * 1024)).toFixed(2)} MB`
													: "-"}
											</TableCell>
											<TableCell>
												{video.duration
													? `${Math.floor(video.duration / 60)}m`
													: "-"}
											</TableCell>
											<TableCell>
												{new Date(video.createdAt).toLocaleDateString()}
											</TableCell>
											<TableCell>
												<div className="flex gap-2">
													{video.status !== "ready" && (
														<Button
															variant="outline"
															size="sm"
															onClick={() => handleMarkReady(video)}
															disabled={actionLoading === video.id}
															title={t("admin.videos.markReady")}
														>
															<PlayCircle className="h-4 w-4 text-green-600" />
														</Button>
													)}
													<Button
														variant="destructive"
														size="sm"
														onClick={() => handleDelete(video.id)}
														disabled={actionLoading === video.id}
														title={t("admin.videos.deleteVideo")}
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>

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
