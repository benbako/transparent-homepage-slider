# Product migration source notes

The catalog is a snapshot of the public LJ Sports Tech website collected on November 7, 2026. It includes the 152 products previously listed in the site's product navigation, their source descriptions and product images, 38 English product categories, and the original product/category paths used by the site and its 70 imported news articles. Images were optimized and stored within this project so product pages do not rely on the original image host.

The original category pages provide first-page listings; additional membership is matched using the source product breadcrumbs and the existing verified top-level catalog. The source's Simulated Archery category had no products in its visible first-page listing, so no products were invented for it. The catalog is a dated snapshot, not an automatic synchronization with the source website.

The source Services page linked to a PDF through a `/phoenix/admin/download` endpoint disallowed by its robots policy. The preserved Services page therefore offers a direct catalog request rather than an unavailable download. To restore that exact download, provide the catalog PDF or an authorized accessible copy.

No domain, DNS, or live-site cutover is performed by this project update. After publication and domain configuration, test the original URLs on the actual public host before switching traffic.

The development Preview currently serves the SPA shell with HTTP 200 for unknown URLs before showing a not-found page in the browser. The published hosting gateway may behave differently; verify real HTTP 404 status for nonexistent URLs on the final public host as part of cutover testing.

On November 8, 2026, at the owner's request, the displayed contact email in four product descriptions was updated to business@ljsportstech.com; their remaining content was unchanged by that update.
