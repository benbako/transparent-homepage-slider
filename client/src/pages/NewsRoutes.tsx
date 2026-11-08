import InteriorLayout from "@/components/InteriorLayout";
import { newsArticles, type NewsArticle } from "@/data/news";
import { pageMeta } from "@/page-meta";
import { initialArticleBody } from "@/initial-news";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import NewsPage from "./NewsPage";
import NewsArticlePage from "./NewsArticlePage";
import NotFound from "./NotFound";

export function NewsRoute() {
  return <InteriorLayout active={pageMeta.news.path} title={pageMeta.news.title} description={pageMeta.news.description}><NewsPage articles={newsArticles} /></InteriorLayout>;
}

export function NewsArticleContent({ article }: { article: NewsArticle }) {
  const description = article.excerpt.length > 155 ? `${article.excerpt.slice(0, 152).trimEnd()}…` : article.excerpt;
  return <InteriorLayout active={pageMeta.news.path} title={`${article.title} | LJ Sports Tech`} description={description}><NewsArticlePage article={article} articles={newsArticles} /></InteriorLayout>;
}

export function NewsArticleRoute({ params }: { params: { slug: string } }) {
  let slug = params.slug;
  try { slug = decodeURIComponent(slug); } catch { /* Invalid encoding remains an unknown article. */ }
  const article = newsArticles.find(item => item.slug === slug);
  const initialHtml = typeof window === "undefined" ? null : initialArticleBody();
  const [body, setBody] = useState<{ slug: string; html?: string; error?: boolean } | null>(() =>
    article && initialHtml ? { slug: article.slug, html: initialHtml } : null,
  );
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!article) return;
    if (initialHtml) {
      setBody({ slug: article.slug, html: initialHtml });
      return;
    }
    const controller = new AbortController();
    setBody({ slug: article.slug });
    fetch(`/news-content/${encodeURIComponent(article.slug)}.json`, { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error("Article unavailable");
        return response.json() as Promise<{ html?: unknown }>;
      })
      .then(data => {
        if (typeof data.html !== "string" || !data.html.trim()) throw new Error("Article unavailable");
        setBody({ slug: article.slug, html: data.html });
      })
      .catch(() => { if (!controller.signal.aborted) setBody({ slug: article.slug, error: true }); });
    return () => controller.abort();
  }, [article, attempt, initialHtml]);

  if (!article) return <NotFound />;
  if (body?.slug === article.slug && body.html) return <NewsArticleContent article={{ ...article, html: body.html }} />;
  const error = body?.slug === article.slug && body.error;
  return (
    <InteriorLayout active={pageMeta.news.path} title={`${article.title} | LJ Sports Tech`} description={article.excerpt}>
      <main id="top" className="newsArticle-loading">
        <a href="/news">← Back to news</a>
        <h1>{article.title}</h1>
        <p role="status">{error ? "This article could not be loaded. Please try again." : "Loading the full story…"}</p>
        {error && <button type="button" onClick={() => setAttempt(value => value + 1)}>Try again</button>}
      </main>
    </InteriorLayout>
  );
}

export function LegacyNewsArticleRoute({ params }: { params: { slug: string } }) {
  const [path] = useLocation();
  const article = newsArticles.find(item => item.slug === params.slug);
  // Static hosts may redirect an extensionless prerendered path to a slash.
  const normalizedPath = path.length > 1 ? path.replace(/\/$/, "") : path;
  if (!article || new URL(article.sourceUrl).pathname !== normalizedPath) return <NotFound />;
  return <NewsArticleRoute params={params} />;
}
