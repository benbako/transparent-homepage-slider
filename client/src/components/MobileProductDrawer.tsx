import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { CatalogGroup } from "./ProductMenu";
import "./mobile-product-drawer.css";

type MobileProductDrawerProps = {
  groups: CatalogGroup[];
  onBack: () => void;
  onClose: () => void;
};

const ALL_PRODUCTS_URL = "https://www.ljsportstech.com/products.html";
const QUICK_LABELS: Record<string, string> = {
  "Sports Simulator": "Sports",
  "Indoor Archery Range": "Archery",
  "Indoor Shooting Range": "Shooting",
  "Arcade Game Machine": "Arcade",
  "Interactive Projector": "Projector",
};

function ArrowUpRight() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none">
      <path d="M4 12 12 4M5 4h7v7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function MobileProductDrawer({ groups, onBack, onClose }: MobileProductDrawerProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const backRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const quickFiltersRef = useRef<HTMLDivElement>(null);
  const previousFilters = useRef({ query: "", category: "" });
  const id = useId();
  const searchId = `${id}-search`;
  const categoryId = `${id}-category`;

  // If the catalog changes, an out-of-range selection should not hide it.
  const selectedCategory = category !== "" && Number(category) < groups.length ? category : "";
  const search = query.trim().toLocaleLowerCase();
  const totalCount = groups.reduce((count, group) => count + group.products.length, 0);
  const results = useMemo(() => groups.flatMap((group, index) => {
    if (selectedCategory !== "" && index !== Number(selectedCategory)) return [];
    const categoryMatches = !search || group.name.toLocaleLowerCase().includes(search);
    const products = categoryMatches
      ? group.products
      : group.products.filter(product => product.name.toLocaleLowerCase().includes(search));
    return products.length ? [{ group, index, products }] : [];
  }), [groups, search, selectedCategory]);
  const resultCount = results.reduce((count, result) => count + result.products.length, 0);
  const hasFilters = query !== "" || selectedCategory !== "";

  useEffect(() => {
    // Focusing the back action makes the new panel discoverable without opening
    // the mobile keyboard. The parent owns focus return when the panel closes.
    backRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (resultsRef.current) resultsRef.current.scrollTop = 0;
    const drawer = drawerRef.current;
    if (window.matchMedia("(max-height: 430px)").matches && drawer) {
      const queryChanged = previousFilters.current.query !== query;
      const categoryChanged = previousFilters.current.category !== selectedCategory;
      if (queryChanged) drawer.scrollTop = 0;
      else if (categoryChanged && drawer.scrollTop > 0 && resultsRef.current) {
        const navigationHeight = drawer.querySelector<HTMLElement>(".mobile-product-drawer__navigation")?.offsetHeight ?? 0;
        const filtersHeight = quickFiltersRef.current?.parentElement?.offsetHeight ?? 0;
        const resultsTop = resultsRef.current.getBoundingClientRect().top - drawer.getBoundingClientRect().top + drawer.scrollTop;
        drawer.scrollTop = Math.max(0, resultsTop - navigationHeight - filtersHeight);
      }
    }
    previousFilters.current = { query, category: selectedCategory };
  }, [query, selectedCategory]);

  useEffect(() => {
    // Keep a category chosen in the select visible in the horizontal chip row.
    const list = quickFiltersRef.current;
    const selected = list?.querySelector<HTMLElement>('button[aria-pressed="true"]');
    if (!list || !selected) return;
    const listBox = list.getBoundingClientRect();
    const selectedBox = selected.getBoundingClientRect();
    if (selectedBox.left < listBox.left) list.scrollLeft -= listBox.left - selectedBox.left;
    else if (selectedBox.right > listBox.right) list.scrollLeft += selectedBox.right - listBox.right;
  }, [selectedCategory]);

  function clearFilters() {
    setQuery("");
    setCategory("");
    resultsRef.current?.focus({ preventScroll: true });
  }

  return (
    <div ref={drawerRef} className="mobile-product-drawer">
      <div className="mobile-product-drawer__navigation">
        <button ref={backRef} className="mobile-product-drawer__nav-button" type="button" onClick={onBack}>
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
            <path d="M16 10H4m0 0 5-5m-5 5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Back to menu</span>
        </button>
        <span className="mobile-product-drawer__short-hint" aria-hidden="true">Scroll for products ↓</span>
        <button className="mobile-product-drawer__nav-button mobile-product-drawer__close" type="button" onClick={onClose}>
          <span>Close</span>
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
            <path d="M5 5l10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="mobile-product-drawer__quick-filters">
        <div className="mobile-product-drawer__quick-heading">
          <span>Quick filters</span>
          <span className="mobile-product-drawer__quick-hint" aria-hidden="true">Swipe for more →</span>
        </div>
        <div ref={quickFiltersRef} className="mobile-product-drawer__quick-list" role="group" aria-label="Quick filter products by category">
          <button type="button" aria-pressed={selectedCategory === ""} onClick={() => setCategory("")}>All</button>
          {groups.slice(0, 5).map((group, index) => (
            <button
              key={group.url}
              type="button"
              aria-label={group.name}
              aria-pressed={selectedCategory === String(index)}
              onClick={() => setCategory(String(index))}
            >
              {QUICK_LABELS[group.name] ?? group.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mobile-product-drawer__controls">
        <p className="mobile-product-drawer__eyebrow">LJ SPORTS TECH / CATALOGUE</p>
        <div className="mobile-product-drawer__heading-row">
          <h2>Explore products</h2>
          <p className="mobile-product-drawer__count" aria-live="polite" aria-atomic="true">
            <strong>{resultCount}</strong> <span>of {totalCount} products</span>
          </p>
        </div>
        <div className="mobile-product-drawer__filters">
          <div className="mobile-product-drawer__field">
            <label htmlFor={searchId}>Search</label>
            <input
              id={searchId}
              type="search"
              aria-label="Search product or category names"
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Search"
              autoComplete="off"
            />
          </div>
          <div className="mobile-product-drawer__field">
            <label htmlFor={categoryId}>Category</label>
            <select id={categoryId} value={selectedCategory} onChange={event => setCategory(event.target.value)}>
              <option value="">All types</option>
              {groups.map((group, index) => (
                <option key={`${group.url}-${index}`} value={String(index)}>{group.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div
        ref={resultsRef}
        className="mobile-product-drawer__results"
        role="region"
        aria-label="Product results"
        tabIndex={0}
      >
        <a className="mobile-product-drawer__link mobile-product-drawer__all-link" href={ALL_PRODUCTS_URL}>
          <span>View full product catalogue</span>
          <ArrowUpRight />
        </a>
        {results.length > 0 ? results.map(({ group, index, products }) => (
          <section className="mobile-product-drawer__group" key={`${group.url}-${index}`} aria-labelledby={`${id}-group-${index}`}>
            <h3 id={`${id}-group-${index}`}>
              <a className="mobile-product-drawer__link mobile-product-drawer__category-link" href={group.url}>
                <span>{group.name}</span>
                <ArrowUpRight />
              </a>
            </h3>
            <ul className="mobile-product-drawer__product-list">
              {products.map((product, productIndex) => (
                <li key={`${product.url}-${productIndex}`}>
                  <a className="mobile-product-drawer__link mobile-product-drawer__product-link" href={product.url}>
                    <span>{product.name}</span>
                    <ArrowUpRight />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )) : (
          <div className="mobile-product-drawer__empty">
            <p>{hasFilters ? "No products found." : "No products are currently listed."}</p>
            {hasFilters && (
              <>
                <p>Try a different search or category, or clear your filters to see everything.</p>
                <button type="button" onClick={clearFilters}>Clear filters</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
