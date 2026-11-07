import { useEffect, useId, useMemo, useRef, useState } from "react";
import { localCatalogPath } from "@/lib/catalog-links";
import "./product-menu.css";

export type CatalogGroup = {
  name: string;
  url: string;
  products: { name: string; url: string }[];
};

type ProductMenuProps = {
  groups: CatalogGroup[];
  variant: "desktop" | "mobile";
};

const ALL_PRODUCTS_URL = "/products.html";

function Chevron() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className="product-menu__chevron">
      <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className="product-menu__arrow">
      <path d="M4 12 12 4M5 4h7v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ProductMenu({ groups, variant }: ProductMenuProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const id = useId();
  const panelId = `${id}-panel`;
  const searchId = `${id}-search`;
  const categoryId = `${id}-category`;

  // A changed data set must not leave the user stuck on a category that no longer exists.
  const selectedCategory = category !== "" && Number(category) < groups.length ? category : "";
  const search = query.trim().toLocaleLowerCase();
  const results = useMemo(() => {
    return groups.flatMap((group, index) => {
      if (selectedCategory !== "" && index !== Number(selectedCategory)) return [];
      const matchesGroup = !search || group.name.toLocaleLowerCase().includes(search);
      const products = matchesGroup
        ? group.products
        : group.products.filter(product => product.name.toLocaleLowerCase().includes(search));
      if (!products.length && !(group.products.length === 0 && matchesGroup)) return [];
      return [{ group, index, products }];
    });
  }, [groups, search, selectedCategory]);
  const resultCount = results.reduce((count, result) => count + result.products.length, 0);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onFocusIn = (event: FocusEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const focusWasInside = rootRef.current?.contains(document.activeElement);
      setOpen(false);
      if (focusWasInside) {
        event.preventDefault();
        event.stopPropagation();
        toggleRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`product-menu product-menu--${variant}`}>
      <button
        ref={toggleRef}
        className="product-menu__toggle"
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(current => !current)}
      >
        <span>Products</span>
        <Chevron />
      </button>

      <div
        id={panelId}
        className={`product-menu__panel product-menu__panel--${variant}`}
        role="region"
        aria-label="Products catalogue"
        hidden={!open}
      >
        <div className="product-menu__intro">
          <div className="product-menu__heading">
            <span className="product-menu__eyebrow">LJ SPORTS TECH</span>
            <span className="product-menu__title">Explore products</span>
          </div>
          <div className="product-menu__filters">
            <div className="product-menu__field product-menu__field--search">
              <label htmlFor={searchId}>Search products</label>
              <input
                id={searchId}
                type="search"
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="Search"
                autoComplete="off"
              />
            </div>
            <div className="product-menu__field product-menu__field--category">
              <label htmlFor={categoryId}>Category</label>
              <select id={categoryId} value={selectedCategory} onChange={event => setCategory(event.target.value)}>
                <option value="">All categories</option>
                {groups.map((group, index) => (
                  <option key={`${group.url}-${index}`} value={String(index)}>{group.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="product-menu__results" tabIndex={0} aria-label="Product results">
          <div className="product-menu__results-meta">
            <p className="product-menu__result-count" aria-live="polite" aria-atomic="true">
              {resultCount} {resultCount === 1 ? "product" : "products"}
            </p>
            {resultCount > 3 && <span className="product-menu__scroll-hint" aria-hidden="true">Scroll to browse ↓</span>}
          </div>
          {results.length ? results.map(({ group, index, products }) => (
            <section className="product-menu__group" key={`${group.url}-${index}`} aria-labelledby={`${id}-group-${index}`}>
              <h3 id={`${id}-group-${index}`} className="product-menu__group-title">
                <a href={localCatalogPath(group.url)} className="product-menu__category-link">
                  <span>{group.name}</span><Arrow />
                </a>
              </h3>
              {products.length ? (
                <ul className="product-menu__product-list">
                  {products.map((product, productIndex) => (
                    <li key={`${product.url}-${productIndex}`}>
                      <a href={localCatalogPath(product.url)} className="product-menu__product-link">
                        <span>{product.name}</span><Arrow />
                      </a>
                    </li>
                  ))}
                </ul>
              ) : <p className="product-menu__empty-group">No products listed in this category.</p>}
            </section>
          )) : (
            <div className="product-menu__empty">
              <p>No products found. Try another search or category.</p>
              <button type="button" onClick={() => { setQuery(""); setCategory(""); }}>
                Clear filters
              </button>
            </div>
          )}
        </div>

        <div className="product-menu__footer">
          <a className="product-menu__all-link" href={ALL_PRODUCTS_URL}>
            <span>All products</span><Arrow />
          </a>
        </div>
      </div>
    </div>
  );
}
