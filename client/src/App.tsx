import NotFound from "@/pages/NotFound";
import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import ContactRail from "./components/ContactRail";
import Home from "./pages/Home";
import { AboutRoute, ContactRoute, ExperiencesRoute, SolutionsRoute } from "./pages/PageRoutes";

const DiscoverRoute = lazy(() => import("./pages/DiscoverRoute"));
const NewsRoute = lazy(() => import("./pages/NewsRoutes").then(module => ({ default: module.NewsRoute })));
const NewsArticleRoute = lazy(() => import("./pages/NewsRoutes").then(module => ({ default: module.NewsArticleRoute })));
const LegacyNewsArticleRoute = lazy(() => import("./pages/NewsRoutes").then(module => ({ default: module.LegacyNewsArticleRoute })));
const ProductCatalogRoute = lazy(() => import("./pages/ProductRoutes").then(module => ({ default: module.ProductCatalogRoute })));
const LegacyPageRoute = lazy(() => import("./pages/ProductRoutes").then(module => ({ default: module.LegacyPageRoute })));
const ServicesRoute = lazy(() => import("./pages/ServicesRoute").then(module => ({ default: module.ServicesRoute })));

export default function App() {
  return (
    <ErrorBoundary>
      <div className="site-content-with-contact-rail">
      <Suspense fallback={<div role="status" style={{ padding: "3rem", color: "#10202c" }}>Loading page…</div>}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/index.html" component={Home} />
        <Route path="/experiences" component={ExperiencesRoute} />
        <Route path="/solutions" component={SolutionsRoute} />
        <Route path="/solutions.html" component={SolutionsRoute} />
        <Route path="/news" component={NewsRoute} />
        <Route path="/news.html" component={DiscoverRoute} />
        <Route path="/news/:slug" component={NewsArticleRoute} />
        <Route path="/products" component={ProductCatalogRoute} />
        <Route path="/products.html" component={ProductCatalogRoute} />
        <Route path="/about" component={AboutRoute} />
        <Route path="/about-us.html" component={AboutRoute} />
        <Route path="/contact" component={ContactRoute} />
        <Route path="/contactus.html" component={ContactRoute} />
        <Route path="/services.html" component={ServicesRoute} />
        <Route path="/404" component={NotFound} />
        <Route path="/:slug.html" component={LegacyPageRoute} />
        <Route path="/:slug" component={LegacyNewsArticleRoute} />
        <Route component={NotFound} />
      </Switch>
      </Suspense>
      </div>
      <ContactRail />
    </ErrorBoundary>
  );
}
