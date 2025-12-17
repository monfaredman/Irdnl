"use client";

import { CheckCircle, Upload, XCircle } from "lucide-react";
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
import { videosApi } from "@/lib/api/admin";

export default function VideosManagementPage() {
	const [videos, setVideos] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [uploading, setUploading] = useState(false);

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
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchVideos();
	}, []);

	const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const contentId = prompt("Enter Content ID:");
		const quality =
			prompt("Enter quality (1080p, 720p, 480p, 240p):") || "1080p";

		if (!contentId) return;

		setUploading(true);
		try {
			await videosApi.upload(file, contentId, quality);
			fetchVideos();
			alert("Video uploaded successfully!");
		} catch (error) {
			console.error("Failed to upload video:", error);
			alert("Failed to upload video");
		} finally {
			setUploading(false);
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Video Management</h1>
					<p className="text-gray-600">Manage video assets and transcoding</p>
				</div>
				<div>
					<input
						type="file"
						accept="video/*"
						onChange={handleFileUpload}
						className="hidden"
						id="video-upload"
						disabled={uploading}
					/>
					<label htmlFor="video-upload">
						<Button disabled={uploading} onClick={triggerFilePicker}>
							<Upload className="mr-2 h-4 w-4" />
							{uploading ? "Uploading..." : "Upload Video"}
						</Button>
					</label>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Video Assets</CardTitle>
				</CardHeader>
				<CardContent>
					{loading ? (
						<div className="p-6 text-center">Loading...</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Content ID</TableHead>
									<TableHead>Quality</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>File Size</TableHead>
									<TableHead>Duration</TableHead>
									<TableHead>Created</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{videos.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={6}
											className="text-center text-gray-500"
										>
											No videos found
										</TableCell>
									</TableRow>
								) : (
									videos.map((video) => (
										<TableRow key={video.id}>
											<TableCell>{video.contentId}</TableCell>
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
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
