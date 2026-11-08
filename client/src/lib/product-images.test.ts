import { describe, expect, it } from "vitest";
import { deferProductBodyImages, productImageVariant } from "./product-images";

describe("product image optimization", () => {
  it("defers inline images without changing their content or links", () => {
    const html = '<p>Details</p><a href="/products.html"><img src="/product-images/a.webp" alt="Example"></a>';
    expect(deferProductBodyImages(html)).toBe('<p>Details</p><a href="/products.html"><img decoding="async" loading="lazy" src="/product-images/a.webp" alt="Example"></a>');
  });

  it("does not duplicate existing loading or decoding attributes", () => {
    const html = '<img loading="eager" decoding="sync" src="/photo.webp">';
    expect(deferProductBodyImages(html)).toBe(html);
    expect(deferProductBodyImages(deferProductBodyImages('<img src="/photo.webp">'))).toBe(deferProductBodyImages('<img src="/photo.webp">'));
  });

  it("reserves known original image dimensions without overriding explicit sizing", () => {
    const source = "/product-images/5f9e7ab29c214c9cbcc8.webp";
    const output = deferProductBodyImages(`<img src="${source}" alt="photo">`);
    expect(output).toMatch(/width="\d+" height="\d+"/);
    expect(output).toContain('loading="lazy"');
    const explicit = deferProductBodyImages(`<img src="${source}" width="100">`);
    expect(explicit).toContain('width="100"');
    expect(explicit).not.toContain('height=');
    expect(deferProductBodyImages(output)).toBe(output);
  });

  it("keeps an original URL available alongside any generated preview", () => {
    const image = "/product-images/be7bed3667e30de76f89.webp";
    const variant = productImageVariant(image);
    expect(variant).toBeDefined();
    expect(variant?.originalWidth).toBeGreaterThan(0);
    expect(variant?.thumbnail).toMatch(/^\/(product-thumbnails|product-images)\//);
    expect(productImageVariant("/unknown.webp")).toBeUndefined();
  });
});
