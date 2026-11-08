import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import type { ReactNode } from "react";
import Home from "../client/src/pages/Home";
import { homeHeroPrimaryImage } from "../client/src/components/HomeHero";
import { AboutRoute, ContactRoute, ExperiencesRoute, SolutionsRoute } from "../client/src/pages/PageRoutes";
import DiscoverRoute from "../client/src/pages/DiscoverRoute";
import { NewsArticleContent, NewsRoute } from "../client/src/pages/NewsRoutes";
import { newsArticles as newsIndex } from "../client/src/data/news";
import { ProductCatalogRoute, ProductCategoryContent, ProductDetailContent } from "../client/src/pages/ProductRoutes";
import { ServicesRoute } from "../client/src/pages/ServicesRoute";
import { products, productCategories, type ProductDetail } from "../client/src/data/products";
import productAliases from "../client/src/data/product-aliases.json";
import { pageMeta } from "../client/src/page-meta";

const output = join(process.cwd(), "dist/public");
const shell = readFileSync(join(output, "index.html"), "utf8");
const newsArticles = newsIndex.map(article => {
  const body = JSON.parse(readFileSync(join(process.cwd(), "client/public/news-content", `${article.slug}.json`), "utf8")) as { html: string };
  return { ...article, html: body.html };
});
const productDetails: ProductDetail[] = products.map(product => {
  const body = JSON.parse(readFileSync(join(process.cwd(), "client/public/product-content", `${product.id}.json`), "utf8")) as { html: string; gallery: string[] };
  return { ...product, html: body.html, gallery: body.gallery };
});
const detailsById = new Map(productDetails.map(product => [product.id, product]));
const categoriesById = new Map(productCategories.map(category => [category.id, category]));
type StaticPage = { path: string; title: string; description: string; content: ReactNode; type?: "website" | "article" };
const routes: StaticPage[] = [
  { ...pageMeta.home, content: <Home /> },
  { ...pageMeta.experiences, content: <ExperiencesRoute /> },
  { ...pageMeta.solutions, content: <SolutionsRoute /> },
  { ...pageMeta.solutions, path: "/solutions.html", content: <SolutionsRoute /> },
  { ...pageMeta.services, content: <ServicesRoute /> },
  { ...pageMeta.discover, content: <DiscoverRoute /> },
  { ...pageMeta.news, content: <NewsRoute /> },
  { path: "/products.html", title: "Products | LJ Sports Tech", description: "Explore LJ Sports Tech's indoor sports simulators and interactive entertainment equipment.", content: <ProductCatalogRoute /> },
  { path: "/products", title: "Products | LJ Sports Tech", description: "Explore LJ Sports Tech's indoor sports simulators and interactive entertainment equipment.", content: <ProductCatalogRoute /> },
  { ...pageMeta.about, content: <AboutRoute /> },
  { ...pageMeta.about, path: "/about-us.html", content: <AboutRoute /> },
  { ...pageMeta.contact, content: <ContactRoute /> },
  { ...pageMeta.contact, path: "/contactus.html", content: <ContactRoute /> },
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
const renderedPaths = new Set(routes.map(route => route.path));
for (const alias of productAliases as { path: string; id: string; kind: "product" | "category" }[]) {
  if (!/^\/[A-Za-z0-9_-]+\.html$/.test(alias.path)) throw new Error(`Unsafe catalog path: ${alias.path}`);
  if (renderedPaths.has(alias.path)) throw new Error(`Duplicate catalog path: ${alias.path}`);
  if (alias.kind === "product") {
    const product = detailsById.get(alias.id);
    if (!product) throw new Error(`Unknown product alias: ${alias.path}`);
    routes.push({ path: alias.path, title: `${product.title} | LJ Sports Tech`, description: (product.summary || `Explore ${product.title} from LJ Sports Tech.`).slice(0, 155), content: <ProductDetailContent product={product} /> });
  } else {
    const category = categoriesById.get(alias.id);
    if (!category) throw new Error(`Unknown category alias: ${alias.path}`);
    routes.push({ path: alias.path, title: `${category.name} | LJ Sports Tech`, description: (category.description || `Explore ${category.name} products from LJ Sports Tech.`).slice(0, 155), content: <ProductCategoryContent category={category} /> });
  }
  renderedPaths.add(alias.path);
}
const escapeHtml = (value: string) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

for (const route of routes) {
  const title = escapeHtml(route.title);
  const description = escapeHtml(route.description);
  const content = renderToStaticMarkup(route.content);
  const social = `<meta property="og:type" content="${route.type ?? "website"}" /><meta property="og:site_name" content="LJ Sports Tech" /><meta property="og:title" content="${title}" /><meta property="og:description" content="${description}" /><meta name="twitter:card" content="summary_large_image" /><meta name="twitter:title" content="${title}" /><meta name="twitter:description" content="${description}" />`;
  const criticalImage = route.path === "/" ? `<link rel="preload" as="image" href="${escapeHtml(homeHeroPrimaryImage)}" fetchpriority="high" />` : "";
  const html = shell
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${description}" />`)
    .replace("</head>", `${criticalImage}${social}</head>`)
    .replace('<div id="root"></div>', `<div id="root">${content}</div>`);
  const file = route.path === "/" ? join(output, "index.html") : route.path.endsWith(".html") ? join(output, route.path.slice(1)) : join(output, route.path.slice(1), "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}
console.log(`Prerendered ${routes.length} pages, including ${newsArticles.length} news articles and ${productDetails.length} product details with original URLs.`);
