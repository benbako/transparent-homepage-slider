import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import Home from "../client/src/pages/Home";
import { AboutRoute, ContactRoute, ExperiencesRoute, SolutionsRoute } from "../client/src/pages/PageRoutes";
import { pageMeta } from "../client/src/page-meta";

const output = join(process.cwd(), "dist/public");
const shell = readFileSync(join(output, "index.html"), "utf8");
const routes = [
  { ...pageMeta.home, component: Home },
  { ...pageMeta.experiences, component: ExperiencesRoute },
  { ...pageMeta.solutions, component: SolutionsRoute },
  { ...pageMeta.about, component: AboutRoute },
  { ...pageMeta.contact, component: ContactRoute },
];
const escapeHtml = (value: string) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

for (const route of routes) {
  const title = escapeHtml(route.title);
  const description = escapeHtml(route.description);
  const Component = route.component;
  const content = renderToStaticMarkup(<Component />);
  const social = `<meta property="og:type" content="website" /><meta property="og:site_name" content="LJ Sports Tech" /><meta property="og:title" content="${title}" /><meta property="og:description" content="${description}" /><meta name="twitter:card" content="summary_large_image" /><meta name="twitter:title" content="${title}" /><meta name="twitter:description" content="${description}" />`;
  const html = shell
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${description}" />`)
    .replace("</head>", `${social}</head>`)
    .replace('<div id="root"></div>', `<div id="root">${content}</div>`);
  const directory = route.path === "/" ? output : join(output, route.path.slice(1));
  mkdirSync(directory, { recursive: true });
  writeFileSync(join(directory, "index.html"), html);
  console.log(`Prerendered ${route.path}`);
}
