// Static article pages already contain the full story. Capture it before
// createRoot replaces the static markup so a transient fetch failure cannot
// hide content the visitor has already received.
let initialArticle: { path: string; html: string } | null = null;

export function captureInitialArticle() {
  const body = document.querySelector<HTMLElement>("#root .newsArticle-body");
  if (body?.innerHTML.trim()) initialArticle = { path: window.location.pathname, html: body.innerHTML };
}

export function initialArticleBody() {
  return initialArticle?.path === window.location.pathname ? initialArticle.html : null;
}
