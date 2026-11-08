import { lazy, useEffect, useState } from "react";
import InteriorLayout from "@/components/InteriorLayout";
import { catalogGroups } from "@/data/productCatalog";
import { products, productCategories, type ProductCategory, type ProductDetail, type ProductSummary } from "@/data/products";
import { getInitialProduct } from "@/initial-product";
import { localCatalogPath } from "@/lib/catalog-links";
import ProductCatalogPage from "./ProductCatalogPage";
import ProductDetailPage from "./ProductDetailPage";
import NotFound from "./NotFound";
import "./product-route.css";

const LegacyNewsArticleRoute = lazy(() => import("./NewsRoutes").then(module => ({ default: module.LegacyNewsArticleRoute })));
const rootCategoryPaths = new Set(catalogGroups.map(group => localCatalogPath(group.url)));
const primaryCategories = productCategories.filter(category => rootCategoryPaths.has(category.sourcePath));
const catalogDescription = "Explore LJ Sports Tech's indoor sports simulators and interactive entertainment equipment.";

export function ProductCatalogRoute() {
  return <InteriorLayout active="/products.html" title="Products | LJ Sports Tech" description={catalogDescription}>
    <ProductCatalogPage products={products} categories={primaryCategories} />
  </InteriorLayout>;
}

export function ProductCategoryContent({ category }: { category: ProductCategory }) {
  const ids = new Set(category.productIds);
  const filtered = products.filter(product => ids.has(product.id));
  const description = (category.description || `Explore ${category.name} products from LJ Sports Tech.`).slice(0, 155);
  return <InteriorLayout active="/products.html" title={`${category.name} | LJ Sports Tech`} description={description}>
    <ProductCatalogPage products={filtered} categories={primaryCategories} category={category} />
  </InteriorLayout>;
}

export function ProductDetailContent({ product }: { product: ProductDetail }) {
  const description = (product.summary || `Explore ${product.title} from LJ Sports Tech.`).slice(0, 155);
  const related = products.filter(item => item.id !== product.id && item.groupName === product.groupName).slice(0, 3);
  return <InteriorLayout active="/products.html" title={`${product.title} | LJ Sports Tech`} description={description}>
    <ProductDetailPage product={product} related={related} />
  </InteriorLayout>;
}

function ProductDetailRoute({ product }: { product: ProductSummary }) {
  const initial = typeof window === "undefined" ? null : getInitialProduct(product.id);
  const [body, setBody] = useState<{ id: string; html?: string; gallery?: string[]; error?: boolean } | null>(() =>
    initial ? { id: product.id, html: initial.html, gallery: initial.gallery } : null,
  );
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (initial) {
      setBody({ id: product.id, html: initial.html, gallery: initial.gallery });
      return;
    }
    const controller = new AbortController();
    setBody({ id: product.id });
    fetch(`/product-content/${encodeURIComponent(product.id)}.json`, { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error("Product unavailable");
        return response.json() as Promise<{ html?: unknown; gallery?: unknown }>;
      })
      .then(data => {
        if (typeof data.html !== "string" || !data.html.trim() || !Array.isArray(data.gallery) || !data.gallery.every(item => typeof item === "string")) {
          throw new Error("Product unavailable");
        }
        setBody({ id: product.id, html: data.html, gallery: data.gallery as string[] });
      })
      .catch(() => { if (!controller.signal.aborted) setBody({ id: product.id, error: true }); });
    return () => controller.abort();
  }, [product, attempt, initial]);

  if (body?.id === product.id && typeof body.html === "string") {
    return <ProductDetailContent product={{ ...product, html: body.html, gallery: body.gallery ?? [] }} />;
  }
  const error = body?.id === product.id && body.error;
  return <InteriorLayout active="/products.html" title={`${product.title} | LJ Sports Tech`} description={product.summary || catalogDescription}>
    <main id="top" className="product-loading">
      <a href="/products.html">← Back to products</a>
      <h1>{product.title}</h1>
      <p role="status">{error ? "Product details could not be loaded. Please try again." : "Loading product details…"}</p>
      {error && <button type="button" onClick={() => setAttempt(value => value + 1)}>Try again</button>}
    </main>
  </InteriorLayout>;
}

/** Original product/category URLs and existing news URLs share the root path. */
export function LegacyPageRoute({ params }: { params: { slug: string } }) {
  const match = params.slug.match(/-p([dl])(\d+)$/i);
  if (match?.[1].toLowerCase() === "d") {
    const product = products.find(item => item.id === match[2]);
    return product ? <ProductDetailRoute product={product} /> : <NotFound />;
  }
  if (match?.[1].toLowerCase() === "l") {
    const category = productCategories.find(item => item.id === match[2]);
    return category ? <ProductCategoryContent category={category} /> : <NotFound />;
  }
  return <LegacyNewsArticleRoute params={params} />;
}
