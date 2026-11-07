import { createRoot } from "react-dom/client";
import App from "./App";
import { captureInitialArticle } from "./initial-news";
import { captureInitialProduct } from "./initial-product";
import "./index.css";
captureInitialArticle();
captureInitialProduct();
createRoot(document.getElementById("root")!).render(<App />);
