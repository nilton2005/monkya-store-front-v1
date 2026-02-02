"use client";

import { Play } from "lucide-react";
import { cn } from "utils/cn";
import type { VideoClip } from "types";

interface ClipsProps {
  clip: VideoClip;
}

export function Clips({ clip }: ClipsProps) {
  return (
    <div
      className={cn(
        "relative group cursor-pointer transition-all duration-300",
        "h-12 w-10 xl:h-16 xl:w-20 lg:h-14 lg:w-16 md:h-12 md:w-14",
        "rounded-lg overflow-hidden"
      )}
    >
      {/* Thumbnail image */}
      <img
        src={clip.imgsrc}
        alt="video thumbnail"
        className={cn(
          "absolute inset-0 w-full h-full object-cover",
          "rounded-lg opacity-100 z-10",
          "transition-opacity duration-500",
          "group-hover:opacity-0"
        )}
      />

      {/* Play button overlay */}
      <div
        className={cn(
          "absolute bg-white/75 backdrop-blur-sm",
          "flex items-center justify-center rounded-full",
          "w-5 h-5 xl:w-8 xl:h-8 lg:w-6 lg:h-6 md:w-5 md:h-5",
          "top-4 left-4 xl:top-6 xl:left-6 lg:top-5 lg:left-5 md:top-4 md:left-4",
          "z-[100] opacity-100 group-hover:opacity-0",
          "transition-opacity duration-300"
        )}
      >
        <Play className="text-slate-900 w-full h-full p-0.5" fill="currentColor" />
      </div>

      {/* Video element */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className={cn(
          "absolute inset-0 w-full h-full object-cover",
          "rounded-lg opacity-0 z-0",
          "transition-opacity duration-300",
          "group-hover:opacity-100 group-hover:z-50"
        )}
      >
        <source type="video/mp4" src={clip.clip} />
      </video>
    </div>
  );
}
