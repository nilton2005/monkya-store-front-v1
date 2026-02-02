"use client";

import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  MessageCircle,
  Twitch,
} from "lucide-react";
import { cn } from "utils/cn";
import type { SocialLinkItem } from "types";

interface SocialLinkProps {
  item: SocialLinkItem;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  linkedin: Linkedin,
  messenger: MessageCircle,
  tiktok: Twitch,
};

export function SocialLink({ item }: SocialLinkProps) {
  const Icon = iconMap[item.icon.toLowerCase()];

  if (!Icon) {
    console.warn(`Icon "${item.icon}" not found in iconMap`);
    return null;
  }

  return (
    <a
      href={item.href || "#"}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Social link: ${item.icon}`}
      className={cn(
        "flex items-center justify-center text-slate-200",
        "w-4 h-4 xl:w-6 xl:h-6 lg:w-5 lg:h-5 md:w-4 md:h-4",
        "transition-all duration-200 hover:scale-110 hover:text-white"
      )}
    >
      <Icon strokeWidth={2.5} className="w-full h-full" />
    </a>
  );
}
