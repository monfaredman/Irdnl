/**
 * useCollections Hook
 * 
 * Custom hook for fetching TMDB collections with caching and error handling
 * Supports multiple predefined collections and search functionality
 */

import { useEffect, useState, useCallback } from "react";
import { useLanguage } from "@/providers/language-provider";
import { tmdbClient, mapTMDBCollection, type MappedCollection } from "@/lib/tmdb-service";

// Predefined popular collection IDs
export const FEATURED_COLLECTION_IDS = {
  marvel: 131292,        // Marvel Cinematic Universe
  starWars: 10,          // Star Wars
  harryPotter: 1241,     // Harry Potter
  lotr: 119,             // Lord of the Rings
  dc: 210576,            // DC Extended Universe
  fastFurious: 9485,     // Fast & Furious
  jurassicPark: 328,     // Jurassic Park
  matrix: 2344,          // The Matrix
  piratesCaribbean: 295, // Pirates of the Caribbean
  batman: 120794,        // Batman Films
  spiderMan: 531241,     // Spider-Man
  xMen: 748,             // X-Men
  avengers: 86311,       // The Avengers
  transformers: 8650,    // Transformers
  toyStory: 10194,       // Toy Story
  shrek: 2150,           // Shrek
  madagascar: 14740,     // Madagascar
  iceAge: 8354,          // Ice Age
  kungFuPanda: 77816,    // Kung Fu Panda
  howToTrain: 89137,     // How to Train Your Dragon
  minions: 86066,        // Minions/Despicable Me
  findingNemo: 137697,   // Finding Nemo
  monstersInc: 137696,   // Monsters Inc
  incredibles: 468222,   // The Incredibles
};

// Collection theme colors
export const COLLECTION_COLORS: Record<string, string> = {
  marvel: "#E23636",
  starWars: "#FFE81F",
  harryPotter: "#946B2D",
  lotr: "#8B7355",
  dc: "#0476F2",
  fastFurious: "#FF6B00",
  jurassicPark: "#228B22",
  matrix: "#00FF41",
  piratesCaribbean: "#8B4513",
  batman: "#1A1A1A",
  spiderMan: "#E23636",
  xMen: "#FFD700",
  avengers: "#4169E1",
  transformers: "#808080",
  toyStory: "#1E90FF",
  shrek: "#32CD32",
  madagascar: "#FF6347",
  iceAge: "#87CEEB",
  kungFuPanda: "#FF4500",
  howToTrain: "#2F4F4F",
  minions: "#FFD700",
  findingNemo: "#FF8C00",
  monstersInc: "#00CED1",
  incredibles: "#FF0000",
};

interface UseCollectionResult {
  collection: MappedCollection | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

interface UseCollectionsResult {
  collections: MappedCollection[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// Fetch a single collection
export function useCollection(collectionId: number): UseCollectionResult {
  const { language } = useLanguage();
  const [collection, setCollection] = useState<MappedCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCollection = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await tmdbClient.getCollection(collectionId, language);
      setCollection(mapTMDBCollection(data));
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch collection"));
      setCollection(null);
    } finally {
      setLoading(false);
    }
  }, [collectionId, language]);

  useEffect(() => {
    fetchCollection();
  }, [fetchCollection]);

  return { collection, loading, error, refetch: fetchCollection };
}

// Fetch multiple collections by IDs
export function useCollections(collectionIds: number[]): UseCollectionsResult {
  const { language } = useLanguage();
  const [collections, setCollections] = useState<MappedCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCollections = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const results = await Promise.allSettled(
        collectionIds.map((id) => tmdbClient.getCollection(id, language))
      );
      
      const mappedCollections: MappedCollection[] = [];
      
      for (const result of results) {
        if (result.status === "fulfilled") {
          mappedCollections.push(mapTMDBCollection(result.value));
        }
      }
      
      setCollections(mappedCollections);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch collections"));
      setCollections([]);
    } finally {
      setLoading(false);
    }
  }, [collectionIds.join(","), language]);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  return { collections, loading, error, refetch: fetchCollections };
}

// Fetch featured collections
export function useFeaturedCollections(): UseCollectionsResult {
  const featuredIds = [
    FEATURED_COLLECTION_IDS.marvel,
    FEATURED_COLLECTION_IDS.starWars,
    FEATURED_COLLECTION_IDS.harryPotter,
    FEATURED_COLLECTION_IDS.dc,
    FEATURED_COLLECTION_IDS.lotr,
  ];
  
  return useCollections(featuredIds);
}

// Fetch all available collections
export function useAllCollections(): UseCollectionsResult {
  const allIds = Object.values(FEATURED_COLLECTION_IDS);
  return useCollections(allIds);
}

// Search collections
export function useCollectionSearch(query: string): UseCollectionsResult {
  const { language } = useLanguage();
  const [collections, setCollections] = useState<MappedCollection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const searchCollections = useCallback(async () => {
    if (!query.trim()) {
      setCollections([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const searchResult = await tmdbClient.searchCollections(query, language);
      
      // Fetch full collection details for top results
      const detailedCollections = await Promise.allSettled(
        searchResult.results.slice(0, 10).map((c) => tmdbClient.getCollection(c.id, language))
      );
      
      const mappedCollections: MappedCollection[] = [];
      
      for (const result of detailedCollections) {
        if (result.status === "fulfilled") {
          mappedCollections.push(mapTMDBCollection(result.value));
        }
      }
      
      setCollections(mappedCollections);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to search collections"));
      setCollections([]);
    } finally {
      setLoading(false);
    }
  }, [query, language]);

  useEffect(() => {
    const debounce = setTimeout(searchCollections, 300);
    return () => clearTimeout(debounce);
  }, [searchCollections]);

  return { collections, loading, error, refetch: searchCollections };
}

// Get collection color
export function getCollectionColor(collectionId: number): string {
  const entries = Object.entries(FEATURED_COLLECTION_IDS);
  const entry = entries.find(([, id]) => id === collectionId);
  
  if (entry) {
    return COLLECTION_COLORS[entry[0]] || "#F59E0B";
  }
  
  // Generate a consistent color based on collection ID
  const hue = (collectionId * 137) % 360;
  return `hsl(${hue}, 70%, 50%)`;
}

export default useCollections;
