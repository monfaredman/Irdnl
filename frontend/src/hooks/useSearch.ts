"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
	searchApi,
	type SearchParams,
	type SearchResponse,
	type SuggestResponse,
} from "@/lib/api/search";
import type { Movie, Series } from "@/types/media";

// ─── useSearch ───────────────────────────────────────────────────────────

interface UseSearchOptions {
	/** Debounce delay in ms (default: 400) */
	debounce?: number;
	/** Minimum query length (default: 2) */
	minLength?: number;
	/** Auto-search on query change */
	autoSearch?: boolean;
}

interface UseSearchReturn {
	results: SearchResponse | null;
	isLoading: boolean;
	error: string | null;
	search: (params: SearchParams) => Promise<void>;
	clearResults: () => void;
}

export function useSearch(options: UseSearchOptions = {}): UseSearchReturn {
	const { debounce = 400, minLength = 2, autoSearch = false } = options;
	const [results, setResults] = useState<SearchResponse | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const abortRef = useRef<AbortController | null>(null);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const search = useCallback(
		async (params: SearchParams) => {
			const query = params.q?.trim();
			if (!query || query.length < minLength) {
				setResults(null);
				return;
			}

			// Cancel previous request
			if (abortRef.current) {
				abortRef.current.abort();
			}
			abortRef.current = new AbortController();

			setIsLoading(true);
			setError(null);

			try {
				const response = await searchApi.search(params);
				setResults(response);
			} catch (err: any) {
				if (err?.name !== "AbortError") {
					setError(err?.message || "Search failed");
					setResults(null);
				}
			} finally {
				setIsLoading(false);
			}
		},
		[minLength],
	);

	const clearResults = useCallback(() => {
		setResults(null);
		setError(null);
	}, []);

	// Cleanup
	useEffect(() => {
		return () => {
			if (abortRef.current) abortRef.current.abort();
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, []);

	return { results, isLoading, error, search, clearResults };
}

// ─── useSuggest ──────────────────────────────────────────────────────────

interface UseSuggestOptions {
	/** Debounce delay in ms (default: 300) */
	debounce?: number;
	/** Minimum query length to trigger (default: 1) */
	minLength?: number;
	/** Max suggestions to return (default: 8) */
	limit?: number;
}

interface UseSuggestReturn {
	suggestions: SuggestResponse | null;
	isLoading: boolean;
	query: string;
	setQuery: (q: string) => void;
	clearSuggestions: () => void;
}

export function useSuggest(
	options: UseSuggestOptions = {},
): UseSuggestReturn {
	const { debounce = 300, minLength = 1, limit = 8 } = options;
	const [query, setQuery] = useState("");
	const [suggestions, setSuggestions] = useState<SuggestResponse | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const latestQueryRef = useRef("");

	useEffect(() => {
		latestQueryRef.current = query;
		const trimmed = query.trim();

		if (!trimmed || trimmed.length < minLength) {
			setSuggestions(null);
			setIsLoading(false);
			return;
		}

		setIsLoading(true);

		// Clear previous timer
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		timeoutRef.current = setTimeout(async () => {
			try {
				const response = await searchApi.suggest({ q: trimmed, limit });
				// Only update if query hasn't changed since request started
				if (latestQueryRef.current.trim() === trimmed) {
					setSuggestions(response);
				}
			} catch {
				// Silently fail for suggestions
			} finally {
				if (latestQueryRef.current.trim() === trimmed) {
					setIsLoading(false);
				}
			}
		}, debounce);

		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, [query, debounce, minLength, limit]);

	const clearSuggestions = useCallback(() => {
		setSuggestions(null);
		setQuery("");
	}, []);

	return { suggestions, isLoading, query, setQuery, clearSuggestions };
}

// ─── useKeyboardShortcut ─────────────────────────────────────────────────

/**
 * Hook to listen for Cmd+K / Ctrl+K keyboard shortcut
 */
export function useSearchShortcut(callback: () => void) {
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				callback();
			}
		};

		document.addEventListener("keydown", handler);
		return () => document.removeEventListener("keydown", handler);
	}, [callback]);
}
