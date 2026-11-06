import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";
import { AboutRoute, ContactRoute, ExperiencesRoute, SolutionsRoute } from "./pages/PageRoutes";

export default function App() {
  return (
    <ErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/experiences" component={ExperiencesRoute} />
        <Route path="/solutions" component={SolutionsRoute} />
        <Route path="/about" component={AboutRoute} />
        <Route path="/contact" component={ContactRoute} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </ErrorBoundary>
  );
}
