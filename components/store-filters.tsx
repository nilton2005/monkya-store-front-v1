"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

const CATEGORIES = ["all", "camiseta", "hoodie", "pantalon", "zapatos", "accesorios"];
const DESIGN_CATEGORIES = ["all", "anime", "gaming", "aesthetic", "dev", "tech"];

export function StoreFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentCategory = searchParams.get("category") || "all";
  const currentDesign = searchParams.get("design") || "all";
  const currentSearch = searchParams.get("q") || "";

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-neutral-900/50 p-4 rounded-xl border border-neutral-800">
      <div className="flex flex-col gap-2 w-full sm:w-1/3">
        <label className="text-xs text-neutral-400 font-semibold uppercase">Tipo de Prenda</label>
        <select
          value={currentCategory}
          onChange={(e) => {
            startTransition(() => {
              router.push(pathname + "?" + createQueryString("category", e.target.value));
            });
          }}
          className="w-full bg-neutral-800 text-sm text-white border border-neutral-700 rounded-lg p-2 focus:ring-1 focus:ring-primary"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c === "all" ? "Todas las prendas" : c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2 w-full sm:w-1/3">
        <label className="text-xs text-neutral-400 font-semibold uppercase">Diseño</label>
        <select
          value={currentDesign}
          onChange={(e) => {
            startTransition(() => {
              router.push(pathname + "?" + createQueryString("design", e.target.value));
            });
          }}
          className="w-full bg-neutral-800 text-sm text-white border border-neutral-700 rounded-lg p-2 focus:ring-1 focus:ring-primary"
        >
          {DESIGN_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c === "all" ? "Todos los diseños" : c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}