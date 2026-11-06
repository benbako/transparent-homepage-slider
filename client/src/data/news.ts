import index from "./news-index.json";

export type NewsArticle = {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  image: string;
  sourceUrl: string;
  html: string;
};

// Article bodies load only when opened; the listing needs summaries alone.
export const newsArticles: NewsArticle[] = index.map(article => ({ ...article, html: "" }));
