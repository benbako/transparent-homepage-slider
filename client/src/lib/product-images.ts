import generatedVariants from "@/data/product-image-variants.json";
import generatedDimensions from "@/data/product-body-image-dimensions.json";

export type ProductImageVariant = {
  thumbnail: string;
  card: string;
  originalWidth: number;
  cardWidth: number;
};

const variants = generatedVariants as Record<string, ProductImageVariant>;
const bodyImageDimensions = generatedDimensions as Record<string, number[]>;

/** All originals remain available; an unknown image simply uses its original URL. */
export function productImageVariant(source: string): ProductImageVariant | undefined {
  return variants[source];
}

/** Product snapshots are sanitized upstream; defer inline images and reserve their aspect ratio. */
export function deferProductBodyImages(html: string): string {
  return html.replace(/<img\b[^>]*>/gi, tag => {
    let result = tag;
    const source = result.match(/\ssrc\s*=\s*(["'])(.*?)\1/i)?.[2];
    const dimensions = source ? bodyImageDimensions[source] : undefined;
    // Preserve any explicit source sizing; unknown images still load with their original markup.
    if (dimensions?.length === 2 && !/\s(?:width|height)\s*=/i.test(result)) {
      result = result.replace(/^<img\b/i, `$& width="${dimensions[0]}" height="${dimensions[1]}"`);
    }
    if (!/\bloading\s*=/i.test(result)) result = result.replace(/^<img\b/i, '$& loading="lazy"');
    if (!/\bdecoding\s*=/i.test(result)) result = result.replace(/^<img\b/i, '$& decoding="async"');
    return result;
  });
}
