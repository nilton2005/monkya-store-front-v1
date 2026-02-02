import { StoryItem } from "types";
import { Heart, Clock, Hash } from "lucide-react";
import Link from "next/link";

interface StoryCardProps {
  story: StoryItem;
}

export function StoryCard({ story }: StoryCardProps) {
  return (
    <div className="splide__slide">
      <div className="group relative h-full overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={story.img}
            alt={story.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60" />
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Stats */}
          <div className="mb-3 flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1.5 text-rose-500">
              <Heart className="h-4 w-4 fill-current" />
              <span className="font-medium">{story.like}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{story.time}</span>
            </div>
          </div>

          {/* Author */}
          <div className="mb-2 flex items-center gap-1.5 text-sm text-gray-400">
            <Hash className="h-3.5 w-3.5" />
            <span>por {story.by}</span>
          </div>

          {/* Title */}
          <h3 className="mb-2 line-clamp-2 text-lg font-bold text-gray-900">
            {story.title}
          </h3>

          {/* Description */}
          <p className="mb-4 line-clamp-2 text-sm text-gray-600">{story.text}</p>

          {/* Button */}
          <Link
            href={story.url}
            className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[var(--color-monkya-yellow)] to-yellow-400 px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
          >
            {story.btn}
          </Link>
        </div>
      </div>
    </div>
  );
}
