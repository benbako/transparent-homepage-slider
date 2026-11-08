import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowUpRight, ChevronRight } from "lucide-react";
import type { ProductDetail, ProductSummary } from "../data/products";
import { deferProductBodyImages, productImageVariant } from "../lib/product-images";
import { ProductCard } from "./ProductCatalogPage";
import "./product-pages.css";

export interface ProductDetailPageProps {
  product: ProductDetail;
  related: ProductSummary[];
}

function ProductGallery({ product }: { product: ProductDetail }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(() => new Set());
  const [failedPreviews, setFailedPreviews] = useState<Set<string>>(() => new Set());
  const galleryRef = useRef<HTMLDivElement>(null);
  const images = Array.from(new Set(
    [product.image, ...(product.gallery ?? [])].filter((image): image is string => Boolean(image?.trim())).map((image) => image.trim()),
  ));
  const activeImage = selectedImage && images.includes(selectedImage) ? selectedImage : images[0];
  const activeIndex = activeImage ? images.indexOf(activeImage) : -1;

  function markFailed(image: string) {
    setFailedImages((previous) => {
      if (previous.has(image)) return previous;
      const next = new Set(previous);
      next.add(image);
      return next;
    });
  }

  function markPreviewFailed(image: string) {
    setFailedPreviews(previous => {
      if (previous.has(image)) return previous;
      const next = new Set(previous);
      next.add(image);
      return next;
    });
  }

  useEffect(() => {
    galleryRef.current?.querySelectorAll("img").forEach((image) => {
      const src = image.getAttribute("src");
      const original = image.dataset.fullsrc || src;
      if (!src || !original || !image.complete || image.naturalWidth !== 0) return;
      if (src !== original) markPreviewFailed(original);
      else markFailed(original);
    });
  }, [product.id, product.image, product.gallery, selectedImage, failedPreviews]);

  return (
    <div ref={galleryRef} className="productDetail-gallery" aria-label="Product images">
      <div className="productDetail-mainImage">
        {activeImage && !failedImages.has(activeImage) ? (
          <img
            src={activeImage}
            alt={`${product.title} — product photo${images.length > 1 ? ` ${activeIndex + 1}` : ""}`}
            onError={() => markFailed(activeImage)}
          />
        ) : (
          <div className="productPage-imageFallback productDetail-imageFallback" role="img" aria-label={`Photo unavailable for ${product.title}`}>
            <span>LJ SPORTS TECH</span>
            <strong>Photo unavailable</strong>
          </div>
        )}
      </div>
      {images.length > 1 && (
        <div className="productDetail-galleryControls">
          <p aria-live="polite" aria-atomic="true">PHOTO {activeIndex + 1} OF {images.length}</p>
          <div className="productDetail-thumbnails" role="group" aria-label={`Choose a photo of ${product.title}`}>
            {images.map((image, index) => (
              <button
                key={image}
                type="button"
                className="productDetail-thumbnail"
                aria-label={`View photo ${index + 1} of ${images.length}`}
                aria-pressed={image === activeImage}
                onClick={() => setSelectedImage(image)}
              >
                {failedImages.has(image) ? (
                  <span className="productDetail-thumbnailFallback" aria-hidden="true">{index + 1}</span>
                ) : (
                  <img
                    src={failedPreviews.has(image) ? image : productImageVariant(image)?.thumbnail ?? image}
                    data-fullsrc={image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    onError={(event) => {
                      if (event.currentTarget.getAttribute("src") !== image) markPreviewFailed(image);
                      else markFailed(image);
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductDetailPage({ product, related }: ProductDetailPageProps) {
  const descriptionRef = useRef<HTMLDivElement>(null);
  const inquiry = `mailto:business@ljsportstech.com?subject=${encodeURIComponent(`Inquiry about ${product.title}`)}`;

  // The source HTML is sanitized upstream. Replace failed embedded images with text,
  // including their alt text, without changing or suppressing the surrounding content.
  useEffect(() => {
    const container = descriptionRef.current;
    if (!container) return;

    const replaceFailedImage = (image: HTMLImageElement) => {
      const fallback = document.createElement("span");
      const alt = image.alt.trim();
      fallback.className = "productDetail-inlineImageFallback";
      fallback.textContent = alt ? `${alt} (image unavailable)` : "Image unavailable";
      image.replaceWith(fallback);
    };
    const handleError = (event: Event) => {
      if (event.target instanceof HTMLImageElement) replaceFailedImage(event.target);
    };
    container.addEventListener("error", handleError, true);
    container.querySelectorAll("img").forEach((image) => {
      if (image.complete && image.naturalWidth === 0) replaceFailedImage(image);
    });
    return () => container.removeEventListener("error", handleError, true);
  }, [product.html]);

  return (
    <main id="top" className="productPage productDetail" data-product-id={product.id} data-product-gallery={JSON.stringify(product.gallery)}>
      <header className="productPage-hero productDetail-hero productPage-gutter">
        <div className="productPage-heroGrid" aria-hidden="true" />
        <div className="productPage-heroInner">
          <nav className="productDetail-breadcrumbs" aria-label="Breadcrumb">
            <ol>
              <li><a href="/products.html">Products</a></li>
              {product.groupPath && product.groupName && (
                <li><ChevronRight size={15} aria-hidden="true" /><a href={product.groupPath}>{product.groupName}</a></li>
              )}
              <li><ChevronRight size={15} aria-hidden="true" /><span aria-current="page">{product.title}</span></li>
            </ol>
          </nav>
          <p className="productPage-kicker"><span /> LJ SPORTS TECH / PRODUCT</p>
          <h1>{product.title}</h1>
          {product.summary?.trim() && <p className="productPage-heroIntro">{product.summary}</p>}
        </div>
      </header>

      <section className="productDetail-overview productPage-gutter" aria-label="Product overview">
        <div className="productDetail-overviewGrid">
          <ProductGallery product={product} />
          <aside className="productDetail-inquiry" aria-labelledby="productDetail-inquiryTitle">
            <p className="productPage-sectionLabel"><span /> PRODUCT INQUIRY</p>
            <h2 id="productDetail-inquiryTitle">LET'S TALK <span>DETAILS.</span></h2>
            {product.model?.trim() && (
              <dl className="productDetail-model">
                <dt>MODEL</dt>
                <dd>{product.model}</dd>
              </dl>
            )}
            <p>Have a question about this product? Get in touch with our team.</p>
            <a className="productDetail-primaryButton" href={inquiry}>
              EMAIL AN INQUIRY <ArrowUpRight size={18} aria-hidden="true" />
            </a>
            <a className="productDetail-contactLink" href="/contact">
              CONTACT US <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </aside>
        </div>
      </section>

      <section className="productDetail-description productPage-gutter" aria-labelledby="productDetail-descriptionTitle">
        <div className="productDetail-descriptionGrid">
          <p className="productPage-sectionLabel"><span /> PRODUCT INFORMATION</p>
          <div className="productDetail-copy">
            <h2 id="productDetail-descriptionTitle">Product description</h2>
            {/* The product snapshot supplies pre-sanitized HTML. */}
            <div ref={descriptionRef} className="productDetail-body" data-product-body="" dangerouslySetInnerHTML={{ __html: deferProductBodyImages(product.html) }} />
            <a className="productDetail-back" href="/products.html"><ArrowLeft size={17} aria-hidden="true" /> BACK TO ALL PRODUCTS</a>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="productDetail-related productPage-gutter" aria-labelledby="productDetail-relatedTitle">
          <div className="productPage-sectionTop">
            <div>
              <p className="productPage-sectionLabel"><span /> EXPLORE MORE</p>
              <h2 id="productDetail-relatedTitle">RELATED <span>PRODUCTS.</span></h2>
            </div>
            <a className="productDetail-allLink" href="/products.html">VIEW ALL PRODUCTS <ArrowUpRight size={17} aria-hidden="true" /></a>
          </div>
          <div className="productPage-cardGrid">
            {related.map((item) => <ProductCard key={item.id} product={item} />)}
          </div>
        </section>
      )}
    </main>
  );
}

export { ProductDetailPage };
