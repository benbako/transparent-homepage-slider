import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import type { ReactNode } from "react";
import Home from "../client/src/pages/Home";
import { AboutRoute, ContactRoute, ExperiencesRoute, SolutionsRoute } from "../client/src/pages/PageRoutes";
import { NewsArticleContent, NewsRoute } from "../client/src/pages/NewsRoutes";
import { newsArticles as newsIndex } from "../client/src/data/news";
import { pageMeta } from "../client/src/page-meta";

const output = join(process.cwd(), "dist/public");
const shell = readFileSync(join(output, "index.html"), "utf8");
const newsArticles = newsIndex.map(article => {
  const body = JSON.parse(readFileSync(join(process.cwd(), "client/public/news-content", `${article.slug}.json`), "utf8")) as { html: string };
  return { ...article, html: body.html };
});
type StaticPage = { path: string; title: string; description: string; content: ReactNode; type?: "website" | "article" };
const routes: StaticPage[] = [
  { ...pageMeta.home, content: <Home /> },
  { ...pageMeta.experiences, content: <ExperiencesRoute /> },
  { ...pageMeta.solutions, content: <SolutionsRoute /> },
  { ...pageMeta.news, content: <NewsRoute /> },
  { ...pageMeta.news, path: "/news", content: <NewsRoute /> },
  { ...pageMeta.about, content: <AboutRoute /> },
  { ...pageMeta.contact, content: <ContactRoute /> },
  ...newsArticles.flatMap(article => {
    const description = article.excerpt.length > 155 ? `${article.excerpt.slice(0, 152).trimEnd()}…` : article.excerpt;
    const common = { title: `${article.title} | LJ Sports Tech`, description, content: <NewsArticleContent article={article} />, type: "article" as const };
    const originalPath = new URL(article.sourceUrl).pathname;
    if (!/^\/[A-Za-z0-9_-]+(?:\.html)?$/.test(originalPath)) throw new Error(`Unsafe original article path: ${originalPath}`);
    return [
      { ...common, path: `/news/${encodeURIComponent(article.slug)}` },
      { ...common, path: originalPath },
    ];
  }),
];
const escapeHtml = (value: string) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

for (const route of routes) {
  const title = escapeHtml(route.title);
  const description = escapeHtml(route.description);
  const content = renderToStaticMarkup(route.content);
  const social = `<meta property="og:type" content="${route.type ?? "website"}" /><meta property="og:site_name" content="LJ Sports Tech" /><meta property="og:title" content="${title}" /><meta property="og:description" content="${description}" /><meta name="twitter:card" content="summary_large_image" /><meta name="twitter:title" content="${title}" /><meta name="twitter:description" content="${description}" />`;
  const html = shell
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${description}" />`)
    .replace("</head>", `${social}</head>`)
    .replace('<div id="root"></div>', `<div id="root">${content}</div>`);
  const file = route.path === "/" ? join(output, "index.html") : route.path.endsWith(".html") ? join(output, route.path.slice(1)) : join(output, route.path.slice(1), "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}
console.log(`Prerendered ${routes.length} pages, including ${newsArticles.length} news articles and their original URLs.`);
