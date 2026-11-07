import productIndex from "./product-index.json";
import categoryIndex from "./product-categories.json";

export interface ProductSummary {
  id: string;
  title: string;
  sourcePath: string;
  groupName: string;
  groupPath: string;
  summary: string;
  image: string;
  model: string;
  categoryPaths: string[];
}

export interface ProductDetail extends ProductSummary {
  html: string;
  gallery: string[];
}

export interface ProductCategory {
  id: string;
  name: string;
  sourcePath: string;
  description: string;
  productIds: string[];
}

// The listing stays lightweight; full descriptions are stored per product.
export const products = productIndex as ProductSummary[];
export const productCategories = categoryIndex as ProductCategory[];
