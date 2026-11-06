import { useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Search } from "lucide-react";
import type { NewsArticle } from "../data/news";
import "./news-pages.css";

const PAGE_SIZE = 6;

export function newsArticleHref(article: NewsArticle) {
  return `/news/${encodeURIComponent(article.slug)}`;
}

/** Article art is always supplied by the archive; the fallback is deliberately neutral. */
export function NewsMedia({ article, priority = false }: { article: NewsArticle; priority?: boolean }) {
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const hasImage = Boolean(article.image?.trim()) && failedImage !== article.image;

  return (
    <div className={`newsPage-media${hasImage ? "" : " newsPage-mediaFallback"}`}>
      {hasImage ? (
        <img
          src={article.image}
          alt=""
          loading={priority ? "eager" : "lazy"}
          onError={() => setFailedImage(article.image)}
        />
      ) : (
        <div className="newsPage-placeholder" aria-hidden="true">
          <span>LJ SPORTS TECH</span>
          <strong>NEWS</strong>
          <span>SPORT / TECHNOLOGY</span>
        </div>
      )}
    </div>
  );
}

export function NewsMetadata({ article, light = false }: { article: NewsArticle; light?: boolean }) {
  const category = article.category?.trim();
  const date = article.date?.trim();
  if (!category && !date) return null;

  return (
    <div className={`newsPage-meta${light ? " newsPage-metaLight" : ""}`}>
      {category && <span>{category}</span>}
      {category && date && <span className="newsPage-metaDot" aria-hidden="true" />}
      {date && <span>{date}</span>}
    </div>
  );
}

export function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <article className="newsPage-card">
      <a className="newsPage-cardImageLink" href={newsArticleHref(article)} tabIndex={-1} aria-hidden="true">
        <NewsMedia article={article} />
      </a>
      <div className="newsPage-cardContent">
        <NewsMetadata article={article} />
        <h3><a href={newsArticleHref(article)}>{article.title}</a></h3>
        {article.excerpt && <p>{article.excerpt}</p>}
        <a className="newsPage-cardLink" href={newsArticleHref(article)} aria-label={`Read ${article.title}`}>
          READ STORY <ArrowUpRight size={17} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

export default function NewsPage({ articles }: { articles: NewsArticle[] }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const searchInput = useRef<HTMLInputElement>(null);
  const storiesHeading = useRef<HTMLHeadingElement>(null);
  const searchTerm = query.trim().toLowerCase();
  const filteredArticles = useMemo(() => {
    if (!searchTerm) return articles;
    return articles.filter((article) =>
      [article.title, article.excerpt, article.category, article.date]
        .some((value) => value?.toLowerCase().includes(searchTerm)),
    );
  }, [articles, searchTerm]);
  const pageCount = Math.max(1, Math.ceil(filteredArticles.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const firstIndex = (currentPage - 1) * PAGE_SIZE;
  const visibleArticles = filteredArticles.slice(firstIndex, firstIndex + PAGE_SIZE);
  const featured = articles[0];
  const resultCount = filteredArticles.length;

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
    requestAnimationFrame(() => storiesHeading.current?.focus());
  }

  return (
    <main id="top" className="newsPage">
      <section className="newsPage-hero newsPage-gutter" aria-labelledby="newsPage-title">
        <div className="newsPage-heroGrid" aria-hidden="true" />
        <div className="newsPage-heroContent">
          <div>
            <p className="newsPage-kicker"><span /> THE LJ SPORTS TECH NEWSROOM</p>
            <h1 id="newsPage-title">NEWS FOR<br /><span>WHAT'S NEXT</span><br />IN SPORT.</h1>
          </div>
          <div className="newsPage-heroAside">
            <span className="newsPage-asideNumber">01 / THE NEWSROOM</span>
            <p>Ideas, updates and stories at the intersection of sport and technology.</p>
            <a href="#newsPage-stories">EXPLORE THE STORIES <ArrowDown size={18} aria-hidden="true" /></a>
          </div>
        </div>
        <div className="newsPage-heroFoot">
          <span>SPORT <i>×</i> TECHNOLOGY <i>×</i> IDEAS</span>
          <span>LJ SPORTS TECH / NEWS</span>
        </div>
      </section>

      {featured && (
        <section className="newsPage-feature newsPage-gutter" aria-labelledby="newsPage-featureTitle">
          <div className="newsPage-sectionLabel"><span /> FEATURED STORY</div>
          <div className="newsPage-featureGrid">
            <a className="newsPage-featureImageLink" href={newsArticleHref(featured)} tabIndex={-1} aria-hidden="true">
              <NewsMedia article={featured} priority />
            </a>
            <div className="newsPage-featureContent">
              <NewsMetadata article={featured} />
              <h2 id="newsPage-featureTitle"><a href={newsArticleHref(featured)}>{featured.title}</a></h2>
              {featured.excerpt && <p>{featured.excerpt}</p>}
              <a className="newsPage-darkButton" href={newsArticleHref(featured)}>
                READ THE STORY <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
      )}

      <section className="newsPage-stories newsPage-gutter" id="newsPage-stories" aria-labelledby="newsPage-storiesTitle">
        <div className="newsPage-storiesTop">
          <div>
            <div className="newsPage-sectionLabel"><span /> EXPLORE THE NEWSROOM</div>
            <h2 id="newsPage-storiesTitle" ref={storiesHeading} tabIndex={-1}>EXPLORE <span>STORIES.</span></h2>
          </div>
          <p>Browse a selection of LJ Sports Tech stories and updates, collected in November 2026.</p>
        </div>

        <div className="newsPage-tools">
          <form className="newsPage-search" role="search" onSubmit={(event) => event.preventDefault()}>
            <label htmlFor="newsPage-searchInput">Search stories</label>
            <div className="newsPage-searchField">
              <Search size={20} aria-hidden="true" />
              <input
                id="newsPage-searchInput"
                type="search"
                ref={searchInput}
                value={query}
                placeholder="Search by keyword"
                onChange={(event) => updateSearch(event.target.value)}
              />
              {query && <button type="button" onClick={clearSearch}>Clear</button>}
            </div>
          </form>
          <p className="newsPage-resultsCount" aria-live="polite" aria-atomic="true">
            {resultCount === 0
              ? "0 stories"
              : `Showing ${firstIndex + 1}–${Math.min(firstIndex + PAGE_SIZE, resultCount)} of ${resultCount} ${resultCount === 1 ? "story" : "stories"}`}
          </p>
        </div>

        {resultCount > 0 ? (
          <>
            <div className="newsPage-cardGrid">
              {visibleArticles.map((article) => <NewsCard key={article.slug} article={article} />)}
            </div>
            {pageCount > 1 && (
              <nav className="newsPage-pagination" aria-label="News pages">
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
          <div className="newsPage-empty">
            <h3>{searchTerm ? "No stories found." : "No stories available yet."}</h3>
            <p>{searchTerm ? "Try another keyword or clear your search to see all stories." : "Please check back for news and updates."}</p>
            {searchTerm && <button type="button" onClick={clearSearch}>CLEAR SEARCH <ArrowRight size={17} aria-hidden="true" /></button>}
          </div>
        )}
      </section>
    </main>
  );
}
