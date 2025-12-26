/**
 * Media Components Index
 * 
 * Export all media-related components
 */

// Collection Components
export {
  CollectionCard,
  CollectionCarousel,
  CollectionGrid,
  type CollectionCardProps,
  type CollectionCarouselProps,
  type CollectionGridProps,
} from "./CollectionCard";

// Kids Components
export {
  FloatingElements,
  AgeSelector,
  KidsCategoryCard,
  CharacterCard,
  KidsContentCard,
  ParentalControlsPanel,
  KidsHero,
  type AgeSelectorProps,
  type KidsCategoryCardProps,
  type CharacterCardProps,
  type KidsContentCardProps,
  type ParentalControlsPanelProps,
  type KidsHeroProps,
} from "./KidsComponents";

// Re-export existing components
export * from "./MediaCard";
export * from "./CinematicHero";
export * from "./SeasonsEpisodes";
export * from "./SimilarContent";
export * from "./SynopsisAbout";
export * from "./Comments";
export * from "./ItemHeader";
export * from "./CastDetailSkeleton";
export * from "./CastGallery";
export * from "./VideoPlayer";
export * from "./VisualContentGrid";
export * from "./VisualDetailsStrip";
export * from "./VisualRatingsDisplay";
export * from "./VisualSynopsisCard";

