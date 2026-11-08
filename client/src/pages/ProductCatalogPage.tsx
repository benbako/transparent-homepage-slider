import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Search } from "lucide-react";
import type { ProductCategory, ProductSummary } from "../data/products";
import { productImageVariant } from "../lib/product-images";
import "./product-pages.css";

const PAGE_SIZE = 12;

export interface ProductCatalogPageProps {
  products: ProductSummary[];
  categories: ProductCategory[];
  category?: ProductCategory;
}

/** A neutral fallback keeps missing or failed product photos from showing a broken-image icon. */
export function ProductCardImage({ product }: { product: ProductSummary }) {
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const [failedPreview, setFailedPreview] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const image = product.image?.trim();
  const hasImage = Boolean(image) && failedImage !== image;
  const variant = image ? productImageVariant(image) : undefined;
  const preview = variant && failedPreview !== image ? variant.card : image;
  const srcSet = image && preview && preview !== image && variant
    ? `${preview} ${variant.cardWidth}w, ${image} ${variant.originalWidth}w`
    : undefined;

  useEffect(() => {
    const node = imageRef.current;
    if (!image || !node?.complete || node.naturalWidth !== 0) return;
    if (preview && preview !== image) setFailedPreview(image);
    else setFailedImage(image);
  }, [image, preview]);

  return (
    <div className="productPage-cardImage">
      {hasImage ? (
        <img ref={imageRef} src={preview} srcSet={srcSet} sizes="(max-width: 520px) calc(100vw - 98px), (max-width: 1000px) calc(50vw - 72px), (max-width: 1500px) calc(33vw - 72px), 420px" alt="" loading="lazy" decoding="async" onError={() => {
          if (image && preview !== image) setFailedPreview(image);
          else setFailedImage(image ?? null);
        }} />
      ) : (
        <div className="productPage-imageFallback" aria-hidden="true">
          <span>LJ SPORTS TECH</span>
          <strong>Photo unavailable</strong>
        </div>
      )}
    </div>
  );
}

export function ProductCard({ product }: { product: ProductSummary }) {
  return (
    <article className="productPage-card">
      <a className="productPage-cardLink" href={product.sourcePath}>
        <ProductCardImage product={product} />
        <div className="productPage-cardBody">
          {product.groupName && <p className="productPage-cardCategory">{product.groupName}</p>}
          <h3>{product.title}</h3>
          {product.model?.trim() && <p className="productPage-cardModel">Model: {product.model}</p>}
          <span className="productPage-cardAction">VIEW PRODUCT <ArrowUpRight size={17} aria-hidden="true" /></span>
        </div>
      </a>
    </article>
  );
}

export default function ProductCatalogPage({ products, categories, category }: ProductCatalogPageProps) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const searchInput = useRef<HTMLInputElement>(null);
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  const searchTerm = query.trim().toLocaleLowerCase();

  // Support both an all-product index and an already-scoped category product list.
  const categoryProducts = useMemo(() => {
    if (!category) return products;
    const ids = new Set(category.productIds);
    return products.filter((product) =>
      ids.has(product.id) ||
      product.categoryPaths?.includes(category.sourcePath) ||
      product.groupPath === category.sourcePath,
    );
  }, [products, category]);

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return categoryProducts;
    return categoryProducts.filter((product) =>
      [product.title, product.summary, product.model, product.groupName]
        .some((value) => value?.toLocaleLowerCase().includes(searchTerm)),
    );
  }, [categoryProducts, searchTerm]);

  const resultCount = filteredProducts.length;
  const pageCount = Math.max(1, Math.ceil(resultCount / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const firstIndex = (currentPage - 1) * PAGE_SIZE;
  const visibleProducts = filteredProducts.slice(firstIndex, firstIndex + PAGE_SIZE);

  function updateSearch(value: string) {
    setQuery(value);
    setPage(1);
  }

  function clearSearch() {
    updateSearch("");
    searchInput.current?.focus();
  }

  function changePage(nextPage: number) {
    setPage(nextPage);
    requestAnimationFrame(() => resultsHeading.current?.focus());
  }

  return (
    <main id="top" className="productPage productCatalog">
      <header className="productPage-hero productPage-gutter">
        <div className="productPage-heroGrid" aria-hidden="true" />
        <div className="productPage-heroInner">
          <p className="productPage-kicker"><span /> LJ SPORTS TECH / PRODUCTS</p>
          <h1>{category ? category.name : <>EXPLORE THE<br /><span>PRODUCTS.</span></>}</h1>
          {category?.description?.trim() ? (
            <p className="productPage-heroIntro">{category.description}</p>
          ) : (
            <p className="productPage-heroIntro">Explore the LJ Sports Tech product collection.</p>
          )}
        </div>
      </header>

      <section className="productPage-collection productPage-gutter" aria-labelledby="productPage-collectionTitle">
        <div className="productPage-sectionTop">
          <div>
            <p className="productPage-sectionLabel"><span /> THE COLLECTION</p>
            <h2 id="productPage-collectionTitle" ref={resultsHeading} tabIndex={-1}>
              {category ? category.name : <>ALL <span>PRODUCTS.</span></>}
            </h2>
          </div>
        </div>

        <nav className="productPage-categories" aria-label="Product categories">
          <a href="/products.html" aria-current={!category ? "page" : undefined}>All products</a>
          {categories.map((item) => (
            <a
              key={item.id}
              href={item.sourcePath}
              aria-current={category?.sourcePath === item.sourcePath ? "page" : undefined}
            >
              {item.name}
            </a>
          ))}
        </nav>

        <div className="productPage-tools">
          <form className="productPage-search" role="search" onSubmit={(event) => event.preventDefault()}>
            <label htmlFor="productPage-searchInput">Search products</label>
            <div className="productPage-searchField">
              <Search size={20} aria-hidden="true" />
              <input
                id="productPage-searchInput"
                type="search"
                ref={searchInput}
                value={query}
                placeholder="Search by product or model"
                onChange={(event) => updateSearch(event.target.value)}
              />
              {query && <button type="button" onClick={clearSearch}>Clear</button>}
            </div>
          </form>
          <p className="productPage-resultsCount" aria-live="polite" aria-atomic="true">
            {resultCount === 0
              ? "0 products"
              : `Showing ${firstIndex + 1}–${Math.min(firstIndex + PAGE_SIZE, resultCount)} of ${resultCount} ${resultCount === 1 ? "product" : "products"}`}
          </p>
        </div>

        {resultCount > 0 ? (
          <>
            <div className="productPage-cardGrid">
              {visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
            {pageCount > 1 && (
              <nav className="productPage-pagination" aria-label="Product pages">
                <button type="button" disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>
                  <ArrowLeft size={17} aria-hidden="true" /> PREVIOUS
                </button>
                <span aria-live="polite" aria-atomic="true">Page {currentPage} of {pageCount}</span>
                <button type="button" disabled={currentPage === pageCount} onClick={() => changePage(currentPage + 1)}>
                  NEXT <ArrowRight size={17} aria-hidden="true" />
                </button>
              </nav>
            )}
          </>
        ) : (
          <div className="productPage-empty">
            <h3>{searchTerm ? "No products found." : "No products available."}</h3>
            <p>{searchTerm ? "Try another keyword or clear your search." : "Browse another category to explore more products."}</p>
            {searchTerm && <button type="button" onClick={clearSearch}>CLEAR SEARCH <ArrowRight size={17} aria-hidden="true" /></button>}
          </div>
        )}
      </section>
    </main>
  );
}

export { ProductCatalogPage };
