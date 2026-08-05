"use client";

import { useState } from "react";

export function VideoEmbed({
  videoId,
  title,
}: {
  videoId: string;
  title: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (isPlaying) {
    return (
      <iframe
        className="blog-card__img blog-card__video"
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      className="blog-card__img blog-card__video blog-card__video-thumb"
      onClick={() => setIsPlaying(true)}
      aria-label={`Reproducir video: ${title}`}
      style={{
        backgroundImage: `url(https://img.youtube.com/vi/${videoId}/hqdefault.jpg)`,
      }}
    >
      <span className="blog-card__play" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    </button>
  );
}
