import { createRoot } from "react-dom/client";
import App from "./App";
import { captureInitialArticle } from "./initial-news";
import "./index.css";

captureInitialArticle();
createRoot(document.getElementById("root")!).render(<App />);
