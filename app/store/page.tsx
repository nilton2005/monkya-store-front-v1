import Grid from "components/grid";
import Search from "components/layout/navbar/search";
import ProductGridItems from "components/layout/product-grid-items";
import { defaultSort, sorting } from "lib/constants";
import { getProducts } from "lib/local-shopify";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tienda",
  description:
    "Explora toda la tienda de Monkya: camisetas y polos personalizados con disenos unicos.",
  alternates: {
    canonical: "/store",
  },
  openGraph: {
    type: "website",
    title: "Tienda | Monkya",
    description:
      "Catalogo completo de camisetas personalizadas y disenos creados con IA en Monkya.",
  },
};

export default async function StorePage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const { sort, q, category, world, sub } = params as { [key: string]: string };
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  let products = await getProducts({ sortKey, reverse, query: q });

  // Filter dynamically by category, world and sub
  if (category && category !== "all") {
    products = products.filter((p) =>
      p.tags.some((t) => t.toLowerCase().includes(category.toLowerCase()))
    );
  }

  if (world && world !== "all") {
    products = products.filter((p) =>
      p.tags.some((t) => t.toLowerCase().includes(world.toLowerCase()))
    );
  }

  if (sub && sub !== "all") {
    products = products.filter((p) =>
      p.tags.some((t) => t.toLowerCase().includes(sub.toLowerCase()))
    );
  }

  const resultsText = products.length > 1 ? "productos" : "producto";

  return (
    <>
      {/* Hero con buscador */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-200 mb-2 text-center">
          Tienda
        </h1>
        <p className="text-slate-400 text-center mb-6">
          Explora nuestra colección de prendas únicas
        </p>
        
        <Search />

        <p className="mt-6">
          Mostrando{" "}
          <span className="font-bold text-[#f2cd4e]">{products.length}</span>{" "}
          {resultsText}
        </p>
      </div>

      {products.length > 0 ? (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      ) : (
        <p className="text-slate-400">No hay productos disponibles.</p>
      )}
    </>
  );
}
