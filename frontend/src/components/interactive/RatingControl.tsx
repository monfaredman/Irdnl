"use client";

import { useState } from "react";

interface RatingControlProps {
  mediaId: string;
}

export const RatingControl = ({ mediaId }: RatingControlProps) => {
  const [rating, setRating] = useState<number | null>(null);

  return (
    <div className="flex items-center gap-2 text-sm text-white">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          aria-label={`Rate ${star}`}
          onClick={() => setRating(star)}
          className={`text-2xl ${rating && star <= rating ? "text-amber-300" : "text-white/30"}`}
        >
          ★
        </button>
      ))}
      <p className="text-xs text-white/60">{rating ? `You rated ${rating}/5` : "Tap to rate"}</p>
    </div>
  );
};
