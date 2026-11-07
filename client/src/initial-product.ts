// Keep a statically rendered product available if its supplemental data request fails.
type InitialProduct = { path: string; id: string; html: string; gallery: string[] };
let initialProduct: InitialProduct | null = null;

export function captureInitialProduct() {
  const main = document.querySelector<HTMLElement>("#root main[data-product-id]");
  const body = main?.querySelector<HTMLElement>("[data-product-body]");
  if (!main?.dataset.productId || !body?.innerHTML.trim()) return;
  let gallery: string[] = [];
  try {
    const parsed: unknown = JSON.parse(main.dataset.productGallery ?? "[]");
    if (Array.isArray(parsed)) gallery = parsed.filter((item): item is string => typeof item === "string");
  } catch { /* The product photo remains available from the catalog index. */ }
  initialProduct = { path: window.location.pathname, id: main.dataset.productId, html: body.innerHTML, gallery };
}

export function getInitialProduct(id: string): InitialProduct | null {
  return initialProduct?.path === window.location.pathname && initialProduct.id === id ? initialProduct : null;
}
