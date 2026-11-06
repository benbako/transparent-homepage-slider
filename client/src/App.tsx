import NotFound from "@/pages/NotFound";
import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";
import { AboutRoute, ContactRoute, ExperiencesRoute, SolutionsRoute } from "./pages/PageRoutes";

const NewsRoute = lazy(() => import("./pages/NewsRoutes").then(module => ({ default: module.NewsRoute })));
const NewsArticleRoute = lazy(() => import("./pages/NewsRoutes").then(module => ({ default: module.NewsArticleRoute })));
const LegacyNewsArticleRoute = lazy(() => import("./pages/NewsRoutes").then(module => ({ default: module.LegacyNewsArticleRoute })));

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div role="status" style={{ padding: "3rem", color: "#10202c" }}>Loading news…</div>}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/experiences" component={ExperiencesRoute} />
        <Route path="/solutions" component={SolutionsRoute} />
        <Route path="/news" component={NewsRoute} />
        <Route path="/news.html" component={NewsRoute} />
        <Route path="/news/:slug" component={NewsArticleRoute} />
        <Route path="/about" component={AboutRoute} />
        <Route path="/contact" component={ContactRoute} />
        <Route path="/404" component={NotFound} />
        <Route path="/:slug.html" component={LegacyNewsArticleRoute} />
        <Route path="/:slug" component={LegacyNewsArticleRoute} />
        <Route component={NotFound} />
      </Switch>
      </Suspense>
    </ErrorBoundary>
  );
}
