"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
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
import { contentApi, episodesApi, seasonsApi } from "@/lib/api/admin";

export default function ContentDetailPage() {
	const params = useParams();
	const router = useRouter();
	const id = params.id as string;
	const [content, setContent] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [seasons, setSeasons] = useState<any[]>([]);
	const [episodes, setEpisodes] = useState<any[]>([]);
	const [showSeasonForm, setShowSeasonForm] = useState(false);
	const [showEpisodeForm, setShowEpisodeForm] = useState(false);
	const [seasonForm, setSeasonForm] = useState({ number: "", title: "" });
	const [episodeForm, setEpisodeForm] = useState({
		title: "",
		number: "",
		description: "",
		seasonId: "",
	});

	useEffect(() => {
		const fetchContent = async () => {
			try {
				const data = await contentApi.get(id);
				setContent(data);
				if (data.series?.seasons) {
					setSeasons(data.series.seasons);
					const allEpisodes: any[] = [];
					data.series.seasons.forEach((season: any) => {
						if (season.episodes) {
							allEpisodes.push(...season.episodes);
						}
					});
					setEpisodes(allEpisodes);
				}
			} catch (error) {
				console.error("Failed to fetch content:", error);
			} finally {
				setLoading(false);
			}
		};
		if (id) fetchContent();
	}, [id]);

	const handleCreateSeason = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!content?.series?.id) {
			alert("This content is not a series");
			return;
		}
		try {
			await seasonsApi.create({
				seriesId: content.series.id,
				number: parseInt(seasonForm.number),
				title: seasonForm.title || undefined,
			});
			setSeasonForm({ number: "", title: "" });
			setShowSeasonForm(false);
			// Refresh content
			const data = await contentApi.get(id);
			setContent(data);
			if (data.series?.seasons) {
				setSeasons(data.series.seasons);
			}
		} catch (error) {
			console.error("Failed to create season:", error);
			alert("Failed to create season");
		}
	};

	const handleCreateEpisode = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await episodesApi.create({
				seasonId: episodeForm.seasonId,
				title: episodeForm.title,
				number: parseInt(episodeForm.number),
				description: episodeForm.description || undefined,
			});
			setEpisodeForm({ title: "", number: "", description: "", seasonId: "" });
			setShowEpisodeForm(false);
			// Refresh content
			const data = await contentApi.get(id);
			setContent(data);
			if (data.series?.seasons) {
				setSeasons(data.series.seasons);
				const allEpisodes: any[] = [];
				data.series.seasons.forEach((season: any) => {
					if (season.episodes) {
						allEpisodes.push(...season.episodes);
					}
				});
				setEpisodes(allEpisodes);
			}
		} catch (error) {
			console.error("Failed to create episode:", error);
			alert("Failed to create episode");
		}
	};

	if (loading) {
		return <div className="p-6">Loading...</div>;
	}

	if (!content) {
		return <div className="p-6">Content not found</div>;
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">{content.title}</h1>
					<p className="text-gray-600">Content Details</p>
				</div>
				<Button variant="outline" onClick={() => router.push("/admin/content")}>
					Back to List
				</Button>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Content Information</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2">
						<div>
							<span className="font-medium">Type:</span> {content.type}
						</div>
						<div>
							<span className="font-medium">Status:</span>{" "}
							<span
								className={`rounded-full px-2 py-1 text-xs ${
									content.status === "published"
										? "bg-green-100 text-green-800"
										: "bg-gray-100 text-gray-800"
								}`}
							>
								{content.status}
							</span>
						</div>
						{content.year && (
							<div>
								<span className="font-medium">Year:</span> {content.year}
							</div>
						)}
						{content.description && (
							<div>
								<span className="font-medium">Description:</span>
								<p className="mt-1 text-sm text-gray-600">
									{content.description}
								</p>
							</div>
						)}
					</CardContent>
				</Card>

				{content.type === "series" && (
					<Card>
						<CardHeader className="flex flex-row items-center justify-between">
							<CardTitle>Seasons</CardTitle>
							<Button
								size="sm"
								onClick={() => setShowSeasonForm(!showSeasonForm)}
							>
								<Plus className="mr-2 h-4 w-4" />
								Add Season
							</Button>
						</CardHeader>
						<CardContent>
							{showSeasonForm && (
								<form onSubmit={handleCreateSeason} className="mb-4 space-y-2">
									<Input
										placeholder="Season Number"
										type="number"
										value={seasonForm.number}
										onChange={(e) =>
											setSeasonForm({ ...seasonForm, number: e.target.value })
										}
										required
									/>
									<Input
										placeholder="Season Title (optional)"
										value={seasonForm.title}
										onChange={(e) =>
											setSeasonForm({ ...seasonForm, title: e.target.value })
										}
									/>
									<div className="flex gap-2">
										<Button type="submit" size="sm">
											Create
										</Button>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() => setShowSeasonForm(false)}
										>
											Cancel
										</Button>
									</div>
								</form>
							)}
							{seasons.length === 0 ? (
								<p className="text-sm text-gray-500">No seasons yet</p>
							) : (
								<div className="space-y-2">
									{seasons.map((season) => (
										<div
											key={season.id}
											className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
										>
											<div>
												<p className="font-medium">
													Season {season.number}
													{season.title && `: ${season.title}`}
												</p>
												<p className="text-xs text-gray-500">
													{season.episodes?.length || 0} episodes
												</p>
											</div>
											<Button
												variant="outline"
												size="sm"
												onClick={() => {
													setEpisodeForm({
														...episodeForm,
														seasonId: season.id,
													});
													setShowEpisodeForm(true);
												}}
											>
												Add Episode
											</Button>
										</div>
									))}
								</div>
							)}
						</CardContent>
					</Card>
				)}
			</div>

			{content.type === "series" && showEpisodeForm && (
				<Card>
					<CardHeader>
						<CardTitle>Add Episode</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleCreateEpisode} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="episode-title">Title *</Label>
								<Input
									id="episode-title"
									value={episodeForm.title}
									onChange={(e) =>
										setEpisodeForm({ ...episodeForm, title: e.target.value })
									}
									required
								/>
							</div>
							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="episode-number">Episode Number *</Label>
									<Input
										id="episode-number"
										type="number"
										value={episodeForm.number}
										onChange={(e) =>
											setEpisodeForm({ ...episodeForm, number: e.target.value })
										}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="episode-season">Season *</Label>
									<select
										id="episode-season"
										value={episodeForm.seasonId}
										onChange={(e) =>
											setEpisodeForm({
												...episodeForm,
												seasonId: e.target.value,
											})
										}
										className="w-full rounded-md border border-gray-300 px-3 py-2"
										required
									>
										<option value="">Select season</option>
										{seasons.map((season) => (
											<option key={season.id} value={season.id}>
												Season {season.number}
											</option>
										))}
									</select>
								</div>
							</div>
							<div className="space-y-2">
								<Label htmlFor="episode-description">Description</Label>
								<textarea
									id="episode-description"
									value={episodeForm.description}
									onChange={(e) =>
										setEpisodeForm({
											...episodeForm,
											description: e.target.value,
										})
									}
									className="w-full rounded-md border border-gray-300 px-3 py-2"
									rows={3}
								/>
							</div>
							<div className="flex gap-2">
								<Button type="submit">Create Episode</Button>
								<Button
									type="button"
									variant="outline"
									onClick={() => setShowEpisodeForm(false)}
								>
									Cancel
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
