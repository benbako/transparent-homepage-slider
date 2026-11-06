import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { NewsArticle } from "../data/news";
import { NewsCard, NewsMedia, NewsMetadata } from "./NewsPage";
import "./news-pages.css";

export default function NewsArticlePage({ article, articles }: { article: NewsArticle; articles: NewsArticle[] }) {
  const otherArticles = articles.filter((item) => item.slug !== article.slug);
  const category = article.category?.trim().toLowerCase();
  const sameCategory = category
    ? otherArticles.filter((item) => item.category?.trim().toLowerCase() === category)
    : [];
  const sameCategorySlugs = new Set(sameCategory.map((item) => item.slug));
  const related = [
    ...sameCategory,
    ...otherArticles.filter((item) => !sameCategorySlugs.has(item.slug)),
  ].slice(0, 3);

  return (
    <main id="top" className="newsPage newsArticlePage">
      <header className="newsArticle-hero newsPage-gutter">
        <div className="newsPage-heroGrid" aria-hidden="true" />
        <div className="newsArticle-heroInner">
          <a className="newsArticle-back" href="/news.html"><ArrowLeft size={18} aria-hidden="true" /> BACK TO NEWS</a>
          <p className="newsPage-kicker"><span /> LJ SPORTS TECH / NEWS</p>
          <h1>{article.title}</h1>
          <NewsMetadata article={article} light />
          {article.excerpt && <p className="newsArticle-deck">{article.excerpt}</p>}
          <p className="newsArticle-sourceNote">Originally published by LJ Sports Tech.</p>
        </div>
      </header>

      <article className="newsArticle-reading newsPage-gutter" aria-label={article.title}>
        {article.image?.trim() && (
          <div className="newsArticle-cover"><NewsMedia article={article} priority /></div>
        )}
        <div className="newsArticle-readingGrid">
          <div className="newsArticle-readingLabel"><span /> THE FULL STORY</div>
          <div className="newsArticle-copy">
            {/* The archive extractor supplies allowlist-sanitized HTML. */}
            <div className="newsArticle-body" dangerouslySetInnerHTML={{ __html: article.html }} />
            <div className="newsArticle-end">
              <a href="/news.html"><ArrowLeft size={17} aria-hidden="true" /> BACK TO ALL STORIES</a>
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="newsArticle-related newsPage-gutter" aria-labelledby="newsArticle-relatedTitle">
          <div className="newsArticle-relatedTop">
            <div>
              <div className="newsPage-sectionLabel"><span /> KEEP READING</div>
              <h2 id="newsArticle-relatedTitle">MORE <span>STORIES.</span></h2>
            </div>
            <a href="/news.html">VIEW ALL NEWS <ArrowUpRight size={18} aria-hidden="true" /></a>
          </div>
          <div className="newsPage-cardGrid">
            {related.map((item) => <NewsCard key={item.slug} article={item} />)}
          </div>
        </section>
      )}
    </main>
  );
}
