/** Keep catalog paths on this website while retaining their original public URLs. */
export function localCatalogPath(value: string): string {
  try {
    const url = new URL(value, "https://www.ljsportstech.com");
    if (url.hostname === "www.ljsportstech.com" || url.hostname === "ljsportstech.com") {
      return `${url.pathname}${url.search}${url.hash}`;
    }
  } catch {
    // Existing relative or external values are left unchanged.
  }
  return value;
}
