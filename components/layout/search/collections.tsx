"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const CATEGORIES = [
  { label: "Todos", value: "all" },
  { label: "Camisetas", value: "camiseta" },
  { label: "Hoodies", value: "hoodie" },
];

const WORLDS = [
  {
    label: "Mundo dev",
    value: "dev",
    subcategories: ["comunity", "security", "front", "back", "3d", "ia"],
  },
  {
    label: "Mundo Medic",
    value: "medic",
    subcategories: [], // Para crecimiento
  },
  {
    label: "Mundo lawyer",
    value: "lawyer",
    subcategories: [], // Para crecimiento
  },
  {
    label: "Mundo Deport",
    value: "deport",
    subcategories: [], // Para crecimiento
  },
];

export default function Collections() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentCategory = searchParams.get("category") || "all";
  const currentWorld = searchParams.get("world") || "all";
  const currentSub = searchParams.get("sub") || "all";

  const [expandedCategory, setExpandedCategory] = useState<string | null>(
    currentCategory !== "all" ? currentCategory : null
  );
  const [expandedWorld, setExpandedWorld] = useState<string | null>(
    currentWorld !== "all" ? currentWorld : null
  );

  useEffect(() => {
    if (currentCategory !== "all") setExpandedCategory(currentCategory);
    if (currentWorld !== "all") setExpandedWorld(currentWorld);
  }, [currentCategory, currentWorld]);

  const createQueryString = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value && value !== "all") {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      return params.toString();
    },
    [searchParams]
  );

  const handleCategoryClick = (val: string) => {
    if (val === "all") {
      setExpandedCategory(null);
      setExpandedWorld(null);
      router.push(pathname + "?" + createQueryString({ category: "all", world: "all", sub: "all" }));
      return;
    }

    const isExpanding = expandedCategory !== val;
    setExpandedCategory(isExpanding ? val : null);

    setExpandedWorld(null);
    if (isExpanding) {
      router.push(pathname + "?" + createQueryString({ category: val, world: "all", sub: "all" }));
    } else {
      // Si se contrae, vuelve a "all" la categoría en la url
      router.push(pathname + "?" + createQueryString({ category: "all", world: "all", sub: "all" }));
    }
  };

  const handleWorldClick = (val: string) => {
    const isExpanding = expandedWorld !== val;
    setExpandedWorld(isExpanding ? val : null);
    
    if (isExpanding) {
      router.push(pathname + "?" + createQueryString({ world: val, sub: "all" }));
    } else {
      router.push(pathname + "?" + createQueryString({ world: "all", sub: "all" }));
    }
  };

  const handleSubClick = (val: string) => {
    router.push(pathname + "?" + createQueryString({ sub: val }));
  };

  return (
    <div className="w-full">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-400">
        Colecciones
      </h3>

      <div className="flex flex-col gap-2">
        {CATEGORIES.map((cat) => (
          <div key={cat.value} className="flex flex-col">
            <button
              onClick={() => handleCategoryClick(cat.value)}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-left font-medium transition-all ${
                currentCategory === cat.value
                  ? "bg-neutral-800/50 text-[#f2cd4e]"
                  : "text-neutral-300 hover:bg-neutral-800/30 hover:text-white"
              }`}
            >
              <span className="text-sm">{cat.label}</span>
              {cat.value !== "all" && (
                <svg
                  className={`h-4 w-4 transition-transform ${expandedCategory === cat.value ? "rotate-180" : ""}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </button>

            {/* Mundos solo se muestran si la categoría está expandida y no es "all" */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                expandedCategory === cat.value && cat.value !== "all"
                  ? "max-h-[800px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="ml-4 mt-2 flex flex-col gap-1.5 border-l border-neutral-800 pb-2 pl-3">
                {WORLDS.map((world) => (
                  <div key={world.value} className="flex flex-col">
                    <button
                      onClick={() => handleWorldClick(world.value)}
                      className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-left transition-all ${
                        currentWorld === world.value
                          ? "bg-neutral-800/30 text-[#f2cd4e]"
                          : "text-neutral-400 hover:bg-neutral-800/20 hover:text-white"
                      }`}
                    >
                      <span className="text-sm">{world.label}</span>
                      {world.subcategories.length > 0 && (
                        <svg
                          className={`h-3.5 w-3.5 transition-transform ${expandedWorld === world.value ? "rotate-180" : ""}`}
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </button>

                    {world.subcategories.length > 0 && (
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          expandedWorld === world.value
                            ? "max-h-[400px] opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="mb-2 ml-3 mt-1 flex flex-col gap-1 border-l border-neutral-800/50 pl-3">
                          {world.subcategories.map((sub) => (
                            <button
                              key={sub}
                              onClick={() => handleSubClick(sub)}
                              className={`rounded-lg px-3 py-1 text-left transition-all ${
                                currentSub === sub
                                  ? "bg-[#f2cd4e]/10 text-[#f2cd4e] font-medium"
                                  : "text-neutral-500 hover:bg-neutral-800/20 hover:text-white"
                              }`}
                            >
                              <span className="text-xs">{sub.charAt(0).toUpperCase() + sub.slice(1)}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
