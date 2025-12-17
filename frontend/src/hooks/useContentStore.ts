import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { userProfiles } from "@/data/mockContent";

export interface WatchlistItem {
	id: string;
	slug: string;
	type: "movie" | "series";
	title: string;
	poster: string;
}

export interface ViewingProgress {
	mediaId: string;
	episodeId?: string;
	progress: number;
	duration: number;
	updatedAt: number;
}

interface ContentState {
	activeProfileId: string;
	profiles: typeof userProfiles;
	watchlist: WatchlistItem[];
	favorites: string[];
	viewingHistory: ViewingProgress[];
	playbackQuality: "1080p" | "720p" | "480p";
	subtitles: "fa" | "en";
}

interface ContentActions {
	setActiveProfile: (profileId: string) => void;
	toggleWatchlist: (item: WatchlistItem) => void;
	updateProgress: (progress: ViewingProgress) => void;
	toggleFavorite: (mediaId: string) => void;
	setPlaybackQuality: (quality: ContentState["playbackQuality"]) => void;
	setSubtitle: (language: ContentState["subtitles"]) => void;
}

export const useContentStore = create<ContentState & ContentActions>()(
	immer((set) => ({
		activeProfileId: userProfiles[0]?.id ?? "",
		profiles: userProfiles,
		watchlist: [],
		favorites: [],
		viewingHistory: [],
		playbackQuality: "1080p",
		subtitles: "fa",
		setActiveProfile: (profileId) =>
			set((state) => {
				state.activeProfileId = profileId;
			}),
		toggleWatchlist: (item) =>
			set((state) => {
				const exists = state.watchlist.find(
					(entry: WatchlistItem) => entry.id === item.id,
				);
				if (exists) {
					state.watchlist = state.watchlist.filter(
						(entry: WatchlistItem) => entry.id !== item.id,
					);
				} else {
					state.watchlist.push(item);
				}
			}),
		updateProgress: (progress) =>
			set((state) => {
				const existing = state.viewingHistory.find(
					(entry: ViewingProgress) =>
						entry.mediaId === progress.mediaId &&
						entry.episodeId === progress.episodeId,
				);
				if (existing) {
					existing.progress = progress.progress;
					existing.duration = progress.duration;
					existing.updatedAt = Date.now();
				} else {
					state.viewingHistory.push({ ...progress, updatedAt: Date.now() });
				}
			}),
		toggleFavorite: (mediaId) =>
			set((state) => {
				if (state.favorites.includes(mediaId)) {
					state.favorites = state.favorites.filter((id) => id !== mediaId);
				} else {
					state.favorites.push(mediaId);
				}
			}),
		setPlaybackQuality: (quality) =>
			set((state) => {
				state.playbackQuality = quality;
			}),
		setSubtitle: (language) =>
			set((state) => {
				state.subtitles = language;
			}),
	})),
);

export const useContinueWatching = () => {
	const history = useContentStore((state) => state.viewingHistory);
	return history.filter((entry) => entry.progress / entry.duration < 0.95);
};
