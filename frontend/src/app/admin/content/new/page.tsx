"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/admin/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/admin/ui/card";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { contentApi, imagesApi } from "@/lib/api/admin";

export default function NewContentPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		title: "",
		type: "movie" as "movie" | "series",
		year: "",
		description: "",
		posterUrl: "",
		bannerUrl: "",
		externalPlayerUrl: "",
		status: "draft" as "draft" | "published",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			await contentApi.create({
				...formData,
				year: formData.year ? parseInt(formData.year) : undefined,
				externalPlayerUrl: formData.externalPlayerUrl || undefined,
			});
			router.push("/admin/content");
		} catch (error) {
			console.error("Failed to create content:", error);
			alert("Failed to create content");
		} finally {
			setLoading(false);
		}
	};

	const handleImageUpload = async (file: File, type: "poster" | "banner") => {
		try {
			const response = await imagesApi.upload(file, type);
			setFormData({ ...formData, [`${type}Url`]: response.url });
		} catch (error) {
			console.error("Failed to upload image:", error);
			alert("Failed to upload image");
		}
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold text-gray-900">Create Content</h1>
				<p className="text-gray-600">Add new movie or series</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Content Details</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="title">Title *</Label>
								<Input
									id="title"
									value={formData.title}
									onChange={(e) =>
										setFormData({ ...formData, title: e.target.value })
									}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="type">Type *</Label>
								<select
									id="type"
									value={formData.type}
									onChange={(e) =>
										setFormData({
											...formData,
											type: e.target.value as "movie" | "series",
										})
									}
									className="w-full rounded-md border border-gray-300 px-3 py-2"
									required
								>
									<option value="movie">Movie</option>
									<option value="series">Series</option>
								</select>
							</div>
						</div>

						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="year">Year</Label>
								<Input
									id="year"
									type="number"
									value={formData.year}
									onChange={(e) =>
										setFormData({ ...formData, year: e.target.value })
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="status">Status</Label>
								<select
									id="status"
									value={formData.status}
									onChange={(e) =>
										setFormData({
											...formData,
											status: e.target.value as "draft" | "published",
										})
									}
									className="w-full rounded-md border border-gray-300 px-3 py-2"
								>
									<option value="draft">Draft</option>
									<option value="published">Published</option>
								</select>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="description">Description</Label>
							<textarea
								id="description"
								value={formData.description}
								onChange={(e) =>
									setFormData({ ...formData, description: e.target.value })
								}
								className="w-full rounded-md border border-gray-300 px-3 py-2"
								rows={4}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="externalPlayerUrl">External Player URL</Label>
							<Input
								id="externalPlayerUrl"
								type="url"
								placeholder="https://player.example.com/watch/..."
								value={formData.externalPlayerUrl}
								onChange={(e) =>
									setFormData({ ...formData, externalPlayerUrl: e.target.value })
								}
							/>
							<p className="text-xs text-gray-500">
								URL to redirect users to the third-party player for watching this content
							</p>
						</div>

						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-2">
								<Label>Poster Image</Label>
								<input
									type="file"
									accept="image/*"
									onChange={(e) => {
										const file = e.target.files?.[0];
										if (file) handleImageUpload(file, "poster");
									}}
									className="w-full rounded-md border border-gray-300 px-3 py-2"
								/>
								{formData.posterUrl && (
									<img
										src={formData.posterUrl}
										alt="Poster"
										className="mt-2 h-32 w-32 object-cover rounded"
									/>
								)}
							</div>
							<div className="space-y-2">
								<Label>Banner Image</Label>
								<input
									type="file"
									accept="image/*"
									onChange={(e) => {
										const file = e.target.files?.[0];
										if (file) handleImageUpload(file, "banner");
									}}
									className="w-full rounded-md border border-gray-300 px-3 py-2"
								/>
								{formData.bannerUrl && (
									<img
										src={formData.bannerUrl}
										alt="Banner"
										className="mt-2 h-32 w-full object-cover rounded"
									/>
								)}
							</div>
						</div>

						<div className="flex gap-4">
							<Button type="submit" disabled={loading}>
								{loading ? "Creating..." : "Create Content"}
							</Button>
							<Button
								type="button"
								variant="outline"
								onClick={() => router.back()}
							>
								Cancel
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
