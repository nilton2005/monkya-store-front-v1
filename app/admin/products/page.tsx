"use client";

import {
  DESIGN_SUBCATEGORY_CONFIG,
  DesignCategory,
  SimpleProduct,
} from "lib/local-data/simple-products";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type CatalogResponse = {
  products: SimpleProduct[];
  canWrite: boolean;
  storageMode: "local-file" | "read-only";
};

const DRAFT_KEY = "admin-products-draft-v1";

type ProductCategory = SimpleProduct["category"];
const designCategories = Object.keys(DESIGN_SUBCATEGORY_CONFIG) as DesignCategory[];

const categories: ProductCategory[] = [
  "camiseta",
  "hoodie",
  "pantalon",
  "zapatos",
  "accesorios",
];

function createEmptyProduct(): SimpleProduct {
  const defaultDesignCategory: DesignCategory = "dev";
  const defaultDesignSubcategory =
    DESIGN_SUBCATEGORY_CONFIG[defaultDesignCategory][0] ?? "por definir";

  return {
    title: "",
    description: "",
    basePrice: 0,
    category: "camiseta",
    designCategory: defaultDesignCategory,
    designSubcategory: defaultDesignSubcategory,
    colors: [{ name: "Negro", code: "#000000" }],
    sizes: ["S", "M", "L"],
    tags: [],
    available: true,
  };
}

function parseTags(value: string): string[] {
  return value
    .split(/[\n,]/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function tagsToString(tags?: string[]): string {
  return (tags ?? []).join(",\n");
}

function parseList(value: string): string[] {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function listToMultiline(value?: string[]): string {
  return (value ?? []).join(",\n");
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminProductsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [products, setProducts] = useState<SimpleProduct[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [draftProduct, setDraftProduct] = useState<SimpleProduct>(createEmptyProduct());
  const [basePriceInput, setBasePriceInput] = useState("0");
  const [originalPriceInput, setOriginalPriceInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<ProductCategory | "all">("all");
  const [filterDesignCategory, setFilterDesignCategory] = useState<DesignCategory | "all">("all");
  const [filterDesignSubcategory, setFilterDesignSubcategory] = useState<string>("all");
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [canWrite, setCanWrite] = useState(false);
  const [storageMode, setStorageMode] = useState<CatalogResponse["storageMode"]>("read-only");

  useEffect(() => {
    void loadCatalog();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draftProduct));
  }, [draftProduct]);

  useEffect(() => {
    setBasePriceInput(String(draftProduct.basePrice));
  }, [draftProduct.basePrice]);

  useEffect(() => {
    setOriginalPriceInput(
      typeof draftProduct.originalPrice === "number" ? String(draftProduct.originalPrice) : "",
    );
  }, [draftProduct.originalPrice]);

  async function loadCatalog() {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/catalog", { cache: "no-store" });
      const data = (await res.json()) as CatalogResponse | { error: string };

      if (!res.ok || "error" in data) {
        throw new Error("error" in data ? data.error : "No se pudo cargar el catalogo");
      }

      setProducts(data.products);
      setCanWrite(data.canWrite);
      setStorageMode(data.storageMode);

      const savedDraft = localStorage.getItem(DRAFT_KEY);
      if (savedDraft) {
        try {
          setDraftProduct(JSON.parse(savedDraft) as SimpleProduct);
        } catch {
          setDraftProduct(createEmptyProduct());
        }
      } else if (data.products.length > 0) {
        setSelectedIndex(0);
        const firstProduct = data.products[0];
        if (firstProduct) {
          setDraftProduct(firstProduct);
        }
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Error cargando catalogo");
    } finally {
      setIsLoading(false);
    }
  }

  function selectProduct(index: number) {
    const selected = products[index];
    if (!selected) return;

    setSelectedIndex(index);
    setDraftProduct(selected);
    setBasePriceInput(String(selected.basePrice));
    setOriginalPriceInput(
      typeof selected.originalPrice === "number" ? String(selected.originalPrice) : "",
    );
    setError(null);
    setSuccess(null);
  }

  function applyDraftToList() {
    if (selectedIndex < 0) {
      setProducts((prev) => [...prev, draftProduct]);
      setSelectedIndex(products.length);
      setSuccess("Producto agregado al listado local. Guarda para persistir en JSON.");
      return;
    }

    setProducts((prev) =>
      prev.map((product, index) => (index === selectedIndex ? draftProduct : product)),
    );
    setSuccess("Cambios aplicados al listado local. Guarda para persistir en JSON.");
  }

  function removeProduct(index: number) {
    setProducts((prev) => prev.filter((_, idx) => idx !== index));

    if (selectedIndex === index) {
      setSelectedIndex(-1);
      setDraftProduct(createEmptyProduct());
    } else if (selectedIndex > index) {
      setSelectedIndex((prev) => prev - 1);
    }

    setSuccess("Producto removido del listado local. Guarda para persistir en JSON.");
  }

  function createNewProduct() {
    setSelectedIndex(-1);
    setDraftProduct(createEmptyProduct());
    setBasePriceInput("0");
    setOriginalPriceInput("");
    setSuccess(null);
    setError(null);
  }

  function syncBasePriceFromInput(rawValue: string) {
    const normalized = rawValue.trim().replace(",", ".");

    if (normalized === "") {
      setDraftProduct((prev) => ({ ...prev, basePrice: 0 }));
      setBasePriceInput("0");
      return;
    }

    const parsed = Number(normalized);
    if (Number.isNaN(parsed)) {
      setBasePriceInput(String(draftProduct.basePrice));
      return;
    }

    const safePrice = Math.max(0, parsed);
    setDraftProduct((prev) => ({ ...prev, basePrice: safePrice }));
    setBasePriceInput(String(safePrice));
  }

  function syncOriginalPriceFromInput(rawValue: string) {
    const normalized = rawValue.trim().replace(",", ".");

    if (normalized === "") {
      setDraftProduct((prev) => ({ ...prev, originalPrice: undefined }));
      setOriginalPriceInput("");
      return;
    }

    const parsed = Number(normalized);
    if (Number.isNaN(parsed)) {
      setOriginalPriceInput(
        typeof draftProduct.originalPrice === "number" ? String(draftProduct.originalPrice) : "",
      );
      return;
    }

    const safePrice = Math.max(0, parsed);
    setDraftProduct((prev) => ({ ...prev, originalPrice: safePrice }));
    setOriginalPriceInput(String(safePrice));
  }

  async function uploadImageForColor(
    colorIndex: number,
    imageField: "front" | "back" | "detail" | "lifestyle",
    file: File,
  ) {
    const color = draftProduct.colors[colorIndex];
    if (!color) return;

    const key = `${colorIndex}-${imageField}`;
    setUploadingKey(key);
    setError(null);
    setSuccess(null);

    try {
      const productSlug = slugify(draftProduct.title || "producto");
      const colorSlug = slugify(color.name || "color");
      const customName = `${productSlug}-${colorSlug}-${imageField}`;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "catalog-products");
      formData.append("customName", customName);

      const response = await fetch("/api/cloudinary/upload", {
        method: "POST",
        body: formData,
      });

      const result = (await response.json()) as {
        success?: boolean;
        url?: string;
        error?: string;
      };

      if (!response.ok || !result.success || !result.url) {
        throw new Error(result.error || "No se pudo subir la imagen");
      }

      setDraftProduct((prev) => {
        const nextColors = [...prev.colors];
        const currentColor = nextColors[colorIndex];
        if (!currentColor) return prev;

        const currentImages = currentColor.images ?? { front: "" };
        nextColors[colorIndex] = {
          ...currentColor,
          images: {
            ...currentImages,
            [imageField]: result.url,
          },
        };

        return { ...prev, colors: nextColors };
      });

      setSuccess(`Imagen ${imageField} subida y asignada automaticamente.`);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Error subiendo imagen");
    } finally {
      setUploadingKey(null);
    }
  }

  async function saveCatalog() {
    setError(null);
    setSuccess(null);

    if (!canWrite) {
      setError("Guardado deshabilitado en este entorno. Usa local y luego commit/push.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/catalog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products }),
      });

      const data = (await res.json()) as { success?: boolean; productsCount?: number; error?: string };

      if (!res.ok || !data.success) {
        throw new Error(data.error || "No se pudo guardar el catalogo");
      }

      setSuccess(`Catalogo guardado correctamente (${data.productsCount ?? 0} productos).`);
      localStorage.removeItem(DRAFT_KEY);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Error guardando catalogo");
    } finally {
      setIsSaving(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  const summary = useMemo(() => {
    const active = products.filter((product) => product.available !== false).length;
    const inactive = products.length - active;
    return { total: products.length, active, inactive };
  }, [products]);

  const availableSubcategories = useMemo(() => {
    if (filterDesignCategory === "all") {
      return Array.from(
        new Set(
          products
            .map((product) => product.designSubcategory)
            .filter((value): value is string => Boolean(value)),
        ),
      ).sort();
    }

    return DESIGN_SUBCATEGORY_CONFIG[filterDesignCategory] ?? [];
  }, [filterDesignCategory, products]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return products
      .map((product, index) => ({ product, index }))
      .filter(({ product }) => {
        if (filterCategory !== "all" && product.category !== filterCategory) {
          return false;
        }

        if (
          filterDesignCategory !== "all" &&
          (product.designCategory ?? "") !== filterDesignCategory
        ) {
          return false;
        }

        if (
          filterDesignSubcategory !== "all" &&
          (product.designSubcategory ?? "") !== filterDesignSubcategory
        ) {
          return false;
        }

        if (!normalizedSearch) {
          return true;
        }

        const text = [
          product.title,
          product.description,
          product.category,
          product.designCategory,
          product.designSubcategory,
          ...(product.tags ?? []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return text.includes(normalizedSearch);
      });
  }, [
    products,
    filterCategory,
    filterDesignCategory,
    filterDesignSubcategory,
    searchTerm,
  ]);

  if (isLoading) {
    return <div className="mx-auto max-w-6xl p-6">Cargando panel de productos...</div>;
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-6 p-6 md:grid-cols-[320px_1fr]">
      <aside className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
        <h1 className="text-xl font-semibold">Portal de Productos</h1>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
          Modo: {storageMode === "local-file" ? "Local con escritura a JSON" : "Solo lectura"}
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
          <div className="rounded-lg bg-neutral-100 p-2 text-center dark:bg-neutral-800">Total: {summary.total}</div>
          <div className="rounded-lg bg-green-100 p-2 text-center text-green-900 dark:bg-green-900/40 dark:text-green-100">Activos: {summary.active}</div>
          <div className="rounded-lg bg-amber-100 p-2 text-center text-amber-900 dark:bg-amber-900/40 dark:text-amber-100">Inactivos: {summary.inactive}</div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={createNewProduct}
            className="rounded-md bg-black px-3 py-2 text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
          >
            Nuevo
          </button>
          <button
            type="button"
            onClick={saveCatalog}
            disabled={!canWrite || isSaving}
            className="rounded-md bg-teal-600 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-neutral-400"
          >
            {isSaving ? "Guardando..." : "Guardar JSON"}
          </button>
          <button
            type="button"
            onClick={logout}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium dark:border-neutral-700"
          >
            Salir
          </button>
        </div>

        <div className="mt-4 space-y-2">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por titulo, tag o categoria"
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-950"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as ProductCategory | "all")}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-950"
          >
            <option value="all">Todas las categorias</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            value={filterDesignCategory}
            onChange={(e) => {
              const nextCategory = e.target.value as DesignCategory | "all";
              setFilterDesignCategory(nextCategory);
              setFilterDesignSubcategory("all");
            }}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-950"
          >
            <option value="all">Todas las categorias de diseño</option>
            {designCategories.map((designCategory) => (
              <option key={designCategory} value={designCategory}>
                {designCategory}
              </option>
            ))}
          </select>
          <select
            value={filterDesignSubcategory}
            onChange={(e) => setFilterDesignSubcategory(e.target.value)}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-950"
          >
            <option value="all">Todas las subcategorias</option>
            {availableSubcategories.map((subcategory) => (
              <option key={subcategory} value={subcategory}>
                {subcategory}
              </option>
            ))}
          </select>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Mostrando {filteredProducts.length} de {products.length} productos
          </p>
        </div>

        <ul className="mt-4 space-y-2">
          {filteredProducts.map(({ product, index }) => (
            <li
              key={`${product.title}-${index}`}
              className={`rounded-lg border p-3 ${
                selectedIndex === index
                  ? "border-teal-500 bg-teal-50 dark:bg-teal-900/30"
                  : "border-neutral-200 dark:border-neutral-700"
              }`}
            >
              <button
                type="button"
                onClick={() => selectProduct(index)}
                className="w-full text-left"
              >
                <p className="font-medium">{product.title}</p>
                <p className="text-xs text-neutral-600 dark:text-neutral-300">{product.category}</p>
                {product.designCategory && (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {product.designCategory}
                    {product.designSubcategory ? ` / ${product.designSubcategory}` : ""}
                  </p>
                )}
              </button>
              <button
                type="button"
                onClick={() => removeProduct(index)}
                className="mt-2 text-xs text-red-600"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <section className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-900">
        <h2 className="text-lg font-semibold">
          {selectedIndex >= 0 ? `Editando producto #${selectedIndex + 1}` : "Nuevo producto"}
        </h2>

        {error && <p className="mt-3 rounded-md bg-red-100 p-3 text-sm text-red-700 dark:bg-red-900/40 dark:text-red-100">{error}</p>}
        {success && <p className="mt-3 rounded-md bg-green-100 p-3 text-sm text-green-700 dark:bg-green-900/40 dark:text-green-100">{success}</p>}

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="grid gap-1 text-sm">
            Titulo
            <input
              value={draftProduct.title}
              onChange={(e) => setDraftProduct({ ...draftProduct, title: e.target.value })}
              className="rounded-md border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950"
            />
          </label>

          <label className="grid gap-1 text-sm">
            Categoria
            <select
              value={draftProduct.category}
              onChange={(e) =>
                setDraftProduct({
                  ...draftProduct,
                  category: e.target.value as ProductCategory,
                })
              }
              className="rounded-md border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1 text-sm">
            Categoria de diseño
            <select
              value={draftProduct.designCategory ?? "dev"}
              onChange={(e) =>
                setDraftProduct({
                  ...draftProduct,
                  designCategory: e.target.value as DesignCategory,
                  designSubcategory:
                    DESIGN_SUBCATEGORY_CONFIG[e.target.value as DesignCategory]?.[0] ??
                    "por definir",
                })
              }
              className="rounded-md border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950"
            >
              {designCategories.map((designCategory) => (
                <option key={designCategory} value={designCategory}>
                  {designCategory}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1 text-sm">
            Subcategoria de diseño
            <select
              value={
                draftProduct.designSubcategory ??
                DESIGN_SUBCATEGORY_CONFIG[draftProduct.designCategory ?? "dev"]?.[0] ??
                "por definir"
              }
              onChange={(e) =>
                setDraftProduct({
                  ...draftProduct,
                  designSubcategory: e.target.value,
                })
              }
              className="rounded-md border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950"
            >
              {(DESIGN_SUBCATEGORY_CONFIG[draftProduct.designCategory ?? "dev"] ?? [
                "por definir",
              ]).map((subcategory) => (
                <option key={subcategory} value={subcategory}>
                  {subcategory}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1 text-sm md:col-span-2">
            Descripcion
            <textarea
              value={draftProduct.description}
              onChange={(e) =>
                setDraftProduct({ ...draftProduct, description: e.target.value })
              }
              className="min-h-24 rounded-md border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950"
            />
          </label>

          <label className="grid gap-1 text-sm">
            Precio base
            <input
              type="text"
              inputMode="decimal"
              value={basePriceInput}
              onChange={(e) => setBasePriceInput(e.target.value)}
              onBlur={(e) => syncBasePriceFromInput(e.target.value)}
              placeholder="0"
              className="rounded-md border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950"
            />
          </label>

          <label className="grid gap-1 text-sm">
            Precio original (visual)
            <input
              type="text"
              inputMode="decimal"
              value={originalPriceInput}
              onChange={(e) => setOriginalPriceInput(e.target.value)}
              onBlur={(e) => syncOriginalPriceFromInput(e.target.value)}
              placeholder="Opcional"
              className="rounded-md border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950"
            />
          </label>

          <label className="grid gap-1 text-sm">
            Tallas (coma)
            <textarea
              value={listToMultiline(draftProduct.sizes)}
              onChange={(e) =>
                setDraftProduct({
                  ...draftProduct,
                  sizes: parseList(e.target.value),
                })
              }
              placeholder={"S,\nM,\nL"}
              className="min-h-24 rounded-md border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950"
            />
          </label>

          <label className="grid gap-1 text-sm md:col-span-2">
            Tags (coma)
            <textarea
              value={tagsToString(draftProduct.tags)}
              onChange={(e) =>
                setDraftProduct({
                  ...draftProduct,
                  tags: parseTags(e.target.value),
                })
              }
              placeholder={"tech,\ndiseno,\npremium"}
              className="min-h-24 rounded-md border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950"
            />
          </label>

          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={draftProduct.available !== false}
              onChange={(e) =>
                setDraftProduct({
                  ...draftProduct,
                  available: e.target.checked,
                })
              }
            />
            Disponible para venta
          </label>
        </div>

        <div className="mt-6 rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
          <h3 className="font-medium">Colores</h3>
          <div className="mt-3 space-y-3">
            {draftProduct.colors.map((color, index) => (
              <div
                key={`${color.name}-${index}`}
                className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-700"
              >
                <div className="grid gap-3 md:grid-cols-[1fr_180px_auto]">
                <input
                  value={color.name}
                  onChange={(e) => {
                    const nextColors = [...draftProduct.colors];
                    const currentColor = nextColors[index];
                    if (!currentColor) return;
                    nextColors[index] = { ...currentColor, name: e.target.value };
                    setDraftProduct({ ...draftProduct, colors: nextColors });
                  }}
                  placeholder="Nombre color"
                  className="rounded-md border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950"
                />
                <input
                  value={color.code}
                  onChange={(e) => {
                    const nextColors = [...draftProduct.colors];
                    const currentColor = nextColors[index];
                    if (!currentColor) return;
                    nextColors[index] = { ...currentColor, code: e.target.value };
                    setDraftProduct({ ...draftProduct, colors: nextColors });
                  }}
                  placeholder="#000000"
                  className="rounded-md border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950"
                />
                <button
                  type="button"
                  onClick={() => {
                    const nextColors = draftProduct.colors.filter((_, idx) => idx !== index);
                    setDraftProduct({
                      ...draftProduct,
                      colors: nextColors.length > 0 ? nextColors : [{ name: "Negro", code: "#000000" }],
                    });
                  }}
                  className="rounded-md border border-red-200 px-3 py-2 text-sm text-red-700"
                >
                  Quitar
                </button>
                </div>

                <div className="mt-3">
                  {color.images ? (
                    <div className="grid gap-3 md:grid-cols-2">
                      <label className="grid gap-1 text-sm">
                        Imagen frontal
                        <div className="rounded-md border border-neutral-300 px-3 py-2 text-xs text-neutral-600 dark:border-neutral-700 dark:text-neutral-300">
                          {color.images.front || "Sin imagen"}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            void uploadImageForColor(index, "front", file);
                            e.currentTarget.value = "";
                          }}
                          className="text-xs"
                        />
                        {uploadingKey === `${index}-front` && (
                          <p className="text-xs text-teal-700 dark:text-teal-300">Subiendo frontal...</p>
                        )}
                      </label>

                      <label className="grid gap-1 text-sm">
                        Imagen trasera
                        <div className="rounded-md border border-neutral-300 px-3 py-2 text-xs text-neutral-600 dark:border-neutral-700 dark:text-neutral-300">
                          {color.images.back || "Sin imagen"}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            void uploadImageForColor(index, "back", file);
                            e.currentTarget.value = "";
                          }}
                          className="text-xs"
                        />
                        {uploadingKey === `${index}-back` && (
                          <p className="text-xs text-teal-700 dark:text-teal-300">Subiendo trasera...</p>
                        )}
                      </label>

                      <label className="grid gap-1 text-sm">
                        Imagen detalle
                        <div className="rounded-md border border-neutral-300 px-3 py-2 text-xs text-neutral-600 dark:border-neutral-700 dark:text-neutral-300">
                          {color.images.detail || "Sin imagen"}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            void uploadImageForColor(index, "detail", file);
                            e.currentTarget.value = "";
                          }}
                          className="text-xs"
                        />
                        {uploadingKey === `${index}-detail` && (
                          <p className="text-xs text-teal-700 dark:text-teal-300">Subiendo detalle...</p>
                        )}
                      </label>

                      <label className="grid gap-1 text-sm">
                        Imagen lifestyle
                        <div className="rounded-md border border-neutral-300 px-3 py-2 text-xs text-neutral-600 dark:border-neutral-700 dark:text-neutral-300">
                          {color.images.lifestyle || "Sin imagen"}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            void uploadImageForColor(index, "lifestyle", file);
                            e.currentTarget.value = "";
                          }}
                          className="text-xs"
                        />
                        {uploadingKey === `${index}-lifestyle` && (
                          <p className="text-xs text-teal-700 dark:text-teal-300">Subiendo lifestyle...</p>
                        )}
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          const nextColors = [...draftProduct.colors];
                          const currentColor = nextColors[index];
                          if (!currentColor) return;
                          nextColors[index] = { ...currentColor, images: undefined };
                          setDraftProduct({ ...draftProduct, colors: nextColors });
                        }}
                        className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700"
                      >
                        Quitar imagenes
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        const nextColors = [...draftProduct.colors];
                        const currentColor = nextColors[index];
                        if (!currentColor) return;
                        nextColors[index] = {
                          ...currentColor,
                          images: {
                            front: "",
                          },
                        };
                        setDraftProduct({ ...draftProduct, colors: nextColors });
                      }}
                      className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700"
                    >
                      Agregar imagenes
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              setDraftProduct({
                ...draftProduct,
                colors: [...draftProduct.colors, { name: "Nuevo color", code: "#111111" }],
              })
            }
            className="mt-3 rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700"
          >
            Agregar color
          </button>
        </div>

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={applyDraftToList}
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
          >
            {selectedIndex >= 0 ? "Aplicar cambios" : "Agregar al listado"}
          </button>
          <button
            type="button"
            onClick={loadCatalog}
            className="rounded-md border border-neutral-300 px-4 py-2 text-sm dark:border-neutral-700"
          >
            Recargar catalogo
          </button>
        </div>

        {!canWrite && (
          <p className="mt-4 rounded-md bg-amber-100 p-3 text-sm text-amber-800">
            Este entorno esta en modo solo lectura. Para escribir JSON usa entorno local de desarrollo.
          </p>
        )}
      </section>
    </div>
  );
}
