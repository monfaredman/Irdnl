"use client";

import { FormEvent, useState } from "react";

const seedComments = [
  { id: "c1", author: "Sara", message: "Loved the cinematography!", timestamp: "2h ago" },
  { id: "c2", author: "Reza", message: "Waiting for episode 7!", timestamp: "6h ago" },
];

interface CommentsPanelProps {
  mediaId: string;
}

export const CommentsPanel = ({ mediaId }: CommentsPanelProps) => {
  const [comments, setComments] = useState(seedComments);
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!message.trim()) return;
    setComments((prev) => [{ id: crypto.randomUUID(), author: "You", message, timestamp: "now" }, ...prev]);
    setMessage("");
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <h3 className="text-lg font-semibold text-white">Comments</h3>
      <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Share your thoughts"
          className="flex-1 rounded-2xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-white"
        />
        <button className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-black" type="submit">
          Post
        </button>
      </form>
      <div className="mt-4 space-y-3 text-sm text-white/80">
        {comments.map((comment) => (
          <article key={comment.id} className="rounded-2xl bg-black/30 px-4 py-3">
            <div className="flex items-center justify-between text-xs text-white/50">
              <span>{comment.author}</span>
              <span>{comment.timestamp}</span>
            </div>
            <p className="mt-2 text-white">{comment.message}</p>
          </article>
        ))}
      </div>
    </section>
  );
};
