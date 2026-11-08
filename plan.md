# Homepage reference redesign

## Reference analysis

The supplied full-page movie-power.com screenshot uses a compact white navigation bar, an expansive near-black cinematic hero with an isometric 3D venue graphic and slider controls, then generous white catalog sections with centered headings, brief introductions, four-across product cards, orange rectangular calls to action, and three-across venue solution cards. Dark angular promotional bands separate white content areas; benefits, audience categories, company story and a dark contact/footer close the page. The screenshot's own logos, copy, product imagery, claims, and proprietary artwork are not to be reused.

## Approach and preservation

Mode: homepage redesign / overhaul of presentation, preserving LJ's identity and functional contracts. Adapt the reference's broad composition into an original LJ Sports Tech catalog homepage for a general audience. Keep `/`, `/experiences`, `/solutions`, `/about`, and `/contact`; anchors `#top`, `#experiences`, `#about`, `#solutions`, and `#contact`; the existing three-slide accessible hero; the 3D interactive product showroom with vertical transitions, arrows, touch and keyboard selection; LJ's real product content and inquiry links; the shared navigation and footer; and reduced-motion and mobile behavior. Interior pages retain their existing styles.

## Design decisions

Visual language: accessible commercial sports-technology catalog with a cinematic centerpiece. Variance 6/10, motion 6/10, density 5/10, asset dependence 9/10, brand fidelity 9/10. The light canvas, centered section introductions, dark hero and warm orange action accents take their direction from the reference; the orange is compatible with the official LJ mark. Retain Archivo Black and Manrope. Use spacious 8px-based intervals, crisp rectangular buttons and image frames, a restrained navy/white/orange palette, and limited card shadows. Product images are genuine LJ photos/illustrations; the isometric hero is original conceptual artwork and is labeled as such. Motion is purposeful, with short transitions and reduced-motion support.

Homepage order: existing header and three-slide hero; four authentic product cards; retained interactive showroom; three solution cards; promotional band; short benefit and audience summaries; company story; clear contact area and shared footer. Content should be concise and welcoming. Do not add unsupported sales numbers, fake testimonials, unverified warranties, or claims about products. A contact form may prepare an email locally, but must clearly say it opens the visitor's email app rather than suggesting server-side submission.

## Project structure

`client/src/components/HomeHero.tsx` and scoped hero CSS own the hero; `HomeCatalogue.tsx` and scoped CSS own the product grid and connect the existing `ProductShowroom`; `HomeLower.tsx` and scoped CSS own the solutions, company and contact sections; `client/src/pages/Home.tsx` composes the page and owns shared product selection. Existing global and interior-page files remain untouched where possible. Static frontend delivery and existing route manifest remain unchanged.

## News section extension

Mode: extension, preserving the existing LJ site and its mobile product navigation. Replace the Solutions label in the shared header with News as requested, while retaining the existing `/solutions` page and its homepage/footer links. The new News page follows the established navy, pale neutral, white and restrained blue/orange visual language, with the same typography, shared navigation and footer.

Use the official LJ news archive as a dated content snapshot. Add a searchable, paginated news listing and complete article pages with source attribution and actual article imagery; retain readable text, headings, lists and tables while sanitizing copied HTML and removing executable content. Article metadata and page content are rendered into static HTML. Use `/news.html` as the primary header destination, with `/news`, `/news/:slug`, and original article HTML paths also supported without changing the existing routes. Load the news bundle separately from the homepage to avoid making every visit download the archive. No CMS or automatic source synchronization is implied.

The new `client/src/pages/NewsPage.tsx`, `NewsArticlePage.tsx`, and scoped `news-pages.css` own the presentation; `NewsRoutes.tsx` composes them with the shared layout; `client/src/data/news-index.json` stores article summaries and `client/public/news-content/` holds full article bodies for on-demand loading. Optimized copies of the official news imagery live in `client/public/news-images/`, avoiding the source CDN's observed browser-loading failures. `scripts/prerender.tsx` builds the page and article HTML, and `client/public/manus-routes.json` declares the new public routes.

## Product-link migration

Mode: extension. Preserve the current brand, shared header/footer, 152-item desktop/mobile product menus, quick filters, homepage sections, all 70 full news stories, existing routes and article text. Replace same-domain product and category destinations with local routes while retaining the exact original paths and known aliases so existing bookmarks and in-article links keep working after a domain cutover. Do not switch or publish the live domain as part of this migration.

Import the official product detail content and images as a dated source snapshot; retain useful product descriptions, factual model/specification text and photographs, while sanitizing executable markup. Add an accessible product listing, detail and category template that uses the existing LJ palette and typography, shared layout and contact path. Do not invent product claims or use AI-generated substitutes for real products. Keep the catalog index lightweight and load detailed content per product where appropriate; include content-bearing static HTML for legacy paths. Ensure links are relative and work in Preview without relying on the original live domain. The product snapshots and localized images belong under `client/public/`, lightweight indices under `client/src/data/`, presentational templates under `client/src/pages/`, and `scripts/prerender.tsx` plus `client/public/manus-routes.json` must include the migrated routes.

Preserve the source site's `/index.html`, `/solutions.html`, `/about-us.html`, `/contactus.html` and `/services.html` navigation paths. The first four reuse the equivalent existing pages; Services receives a cohesive support page. Because the old catalog PDF endpoint is disallowed by the source's robots policy, its page offers a genuine catalog-request email instead of a nonfunctional download.

## Homepage project slider extension

Mode: extension. Preserve all existing homepage content and journeys. Add a standalone project-stories-and-inspiration slider between the product showroom and the existing solutions section, reusing the homepage's white/navy/orange visual language and existing LJ imagery. Lead with the documented Thailand customer story, then label product-led ideas as inspiration rather than completed installations. Use labeled, manual controls with touch and keyboard support, no unsolicited autoplay, and a reduced-motion fallback. Link each slide to an existing relevant destination.

## About Us expansion

Mode: extension of the existing interior page. Preserve the company building photo, original story and 2018/2020 timeline, capability list, navigation, CTA and both About routes. Add accessible, family-friendly mission and values copy plus a design-process section. Keep the established navy, blue, white and Archivo/Manrope typography; introduce a small interactive, labeled 3D concept of an indoor play space without portraying it as a real product or installation. Respect reduced motion and provide a non-WebGL fallback. Source: https://www.ljsportstech.com/about-us.html (company history, digital sports R&D/manufacture, customization, venue planning and installation support); https://www.ljsportstech.com/ (3D venue-layout planning). Values are presented as an editorial description of the approach, not a verified formal corporate values statement.

## Integrated About galleries

Mode: extension. Preserve the existing 3D About page, history, mission, design scene, navigation and CTA. Restore the official Factory gallery and the three certificate gallery groupings from https://www.ljsportstech.com/about-us.html, retaining the original section anchors and offering a clear section-jump navigation. Use original company images, preserve the full certificate images without cropping or inventing their meaning, and use local project assets for reliable display independent of the old domain. Fit the established navy/white/electric-blue visual system; show all thumbnails without staggered reveal delays and load off-screen images lazily. Keep the live domain unchanged.

## Contact Us form extension

Mode: extension. Preserve the existing Contact page, email/phone/WhatsApp/address, site navigation and both `/contact` and `/contactus.html` routes. Add an accessible form in the existing navy/white/blue visual language with clearly labeled name, email and message fields, validation, keyboard support, submission status and a direct email fallback. On submit, prepare a `mailto:` draft to business@ljsportstech.com using the entered name, email and message. Explain that the visitor must send the draft in their own email app; preserve the entered text and do not claim that a message has been sent. No server or database is enabled. The form will live in a scoped reusable component and styles and integrate into the existing static React page.
