import { isAdminSessionValid, ADMIN_COOKIE_NAME } from "lib/admin-auth";
import { SimpleProduct } from "lib/local-data/simple-products";
import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

type CatalogPayload = {
  products: SimpleProduct[];
};

const catalogFilePath = path.join(process.cwd(), "lib", "local-data", "catalog.json");

function isWriteAllowed() {
  return process.env.NODE_ENV === "development";
}

function validateCatalogPayload(input: unknown): input is CatalogPayload {
  if (!input || typeof input !== "object") return false;
  const payload = input as CatalogPayload;
  if (!Array.isArray(payload.products)) return false;

  return payload.products.every((product) => {
    if (!product || typeof product !== "object") return false;
    if (!product.title || typeof product.title !== "string") return false;
    if (!product.description || typeof product.description !== "string") return false;
    if (typeof product.basePrice !== "number" || Number.isNaN(product.basePrice)) {
      return false;
    }
    if (
      product.originalPrice !== undefined &&
      (typeof product.originalPrice !== "number" || Number.isNaN(product.originalPrice))
    ) {
      return false;
    }
    if (!product.category || typeof product.category !== "string") return false;
    if (!Array.isArray(product.colors) || product.colors.length === 0) return false;

    return product.colors.every(
      (color) =>
        color &&
        typeof color.name === "string" &&
        color.name.length > 0 &&
        typeof color.code === "string" &&
        color.code.length > 0,
    );
  });
}

async function readCatalog(): Promise<CatalogPayload> {
  const fileContents = await readFile(catalogFilePath, "utf8");
  return JSON.parse(fileContents) as CatalogPayload;
}

function isAuthorized(req: NextRequest): boolean {
  const sessionToken = req.cookies.get(ADMIN_COOKIE_NAME)?.value;

  return isAdminSessionValid(sessionToken);
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const catalog = await readCatalog();

    return NextResponse.json({
      ...catalog,
      canWrite: isWriteAllowed(),
      storageMode: isWriteAllowed() ? "local-file" : "read-only",
    });
  } catch (error) {
    console.error("Error reading catalog:", error);
    return NextResponse.json({ error: "No se pudo leer el catalogo" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isWriteAllowed()) {
    return NextResponse.json(
      {
        error:
          "Edicion deshabilitada en este entorno. Usa el portal en local y publica con commit + push.",
      },
      { status: 403 },
    );
  }

  try {
    const body = (await req.json()) as unknown;

    if (!validateCatalogPayload(body)) {
      return NextResponse.json({ error: "Payload de catalogo invalido" }, { status: 400 });
    }

    const payload = body as CatalogPayload;
    await writeFile(catalogFilePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

    return NextResponse.json({ success: true, productsCount: payload.products.length });
  } catch (error) {
    console.error("Error writing catalog:", error);
    return NextResponse.json({ error: "No se pudo guardar el catalogo" }, { status: 500 });
  }
}
