# LJ Sports Tech

A responsive, cinematic website for LJ Sports Tech, a sports-technology company creating digital interactive sports equipment and indoor play experiences.

The project combines an accessible product catalog with immersive presentation: a multi-slide sports hero, interactive experience showroom, 3D visual details, project-story slider, venue solutions, company information, contact pathways, and locally rendered product and news content.

> This repository is an original LJ Sports Tech implementation. It uses the broad idea of a cinematic sports-technology presentation as creative direction, but does not copy another site’s protected artwork, copy, logo, or exact layout.

## Highlights

- **Immersive homepage:** Eight-slide hero carousel with responsive layouts, manual controls, autoplay pause, keyboard-friendly controls, reduced-motion support, and lazy image loading.
- **Interactive visual layer:** Lightweight 3D-inspired depth animation, pointer-responsive lighting on the featured concept slide, subtle particles, and a Three.js decorative orbit with performance safeguards.
- **Experience discovery:** Tennis, football, skiing, and pickleball cards connected to an interactive product showroom with touch, mouse, keyboard, downward image transitions, and graceful fallbacks.
- **Transparent visual treatment:** Homepage-only glass surfaces, translucent controls, a readable overlay header, and responsive mobile navigation without changing the interior-page visual system.
- **Full product catalog:** 152 locally rendered product detail pages, category pages, responsive cards, optimized preview derivatives, original-image fallbacks, and legacy URL aliases.
- **News archive:** 70 locally rendered articles with preserved article paths, searchable and paginated archive views, locally optimized imagery, and readable article content.
- **Project inspiration:** A manually controlled slider combining a documented customer story with clearly labeled concept and product-led ideas.
- **About experience:** Company story, timeline, mission and design content, interactive 3D concept, Factory gallery, and Certificates gallery.
- **Contact experience:** Accessible name, email, and message form that prepares a draft addressed to `business@ljsportstech.com`, plus email, phone, and WhatsApp links.
- **Responsive and accessible:** Mobile product drawer with category filters, touch-sized controls, keyboard support, visible focus states, reduced-motion behavior, and narrow-screen overflow checks.
- **Static-first delivery:** Build-time prerendering for the homepage, product pages, news archive, articles, and other public routes.

## Technology

- React 19 and TypeScript
- Vite 7
- Wouter routing
- Three.js for the decorative 3D orbit and visual concept work
- Lucide React icons
- Framer Motion and Embla Carousel where used by existing components
- Express, tRPC, Drizzle ORM, and MySQL tooling for the optional server foundation
- Vitest for automated tests
- pnpm 10.18.0

## Project structure

```text
client/
  public/                 Static images, product/news snapshots, route manifest
  src/
    components/           Shared navigation, hero, showroom, galleries, footer
    data/                 Product, news, and project-slide indexes
    lib/                  Image, contact, and shared browser helpers
    pages/                Homepage, catalog, article, About, Contact, and other routes
scripts/
  optimize-product-images.py  Generates repeatable product preview derivatives
  prerender.tsx               Produces static HTML for public routes
server/                       Optional Express/tRPC server and platform helpers
shared/                       Shared types and constants
drizzle/                      Checked-in database schema and migrations
```

## Requirements

- Node.js 20 or newer is recommended.
- pnpm 10.18.0.
- A modern browser for local development and review.

The project is primarily usable as a static website. Database and server features are optional and are not required for the public static pages or the current mailto-based contact flow.

## Installation

Clone the repository and install the locked dependencies:

```bash
git clone <repository-url>
cd ljsports
corepack enable
pnpm install --frozen-lockfile
```

If Corepack is not available, install pnpm 10.18.0 separately before running the commands below.

## Development

For the static frontend and Vite development experience:

```bash
pnpm dev:static
```

The server listens on port `3000` by default. To use another port:

```bash
PORT=4173 pnpm dev:static
```

For the optional Express development server:

```bash
pnpm dev
```

Do not start both commands on the same port. The application’s public route manifest is available at `/manus-routes.json` during development and production static serving.

## Build and preview production output

Build the Vite frontend, generate the prerenderer, and produce static HTML:

```bash
pnpm build:static
```

The generated site is written to `dist/public/`. It includes the prerendered public routes, including the product and news pages.

To build the optional server bundle as well:

```bash
pnpm build
pnpm start
```

The optional server honors `PORT` and defaults to `3000`:

```bash
PORT=3000 pnpm start
```

## Quality checks

Run the TypeScript check, automated tests, and formatting tools as needed:

```bash
pnpm check
pnpm test
pnpm format
```

`pnpm format` rewrites files with Prettier. Review the resulting diff before committing.

A complete release-oriented validation is:

```bash
pnpm check && pnpm test && pnpm build:static && git diff --check
```

## Important routes

| Route | Purpose |
| --- | --- |
| `/` | Homepage and interactive sports experience overview |
| `/experiences` | Experience-led sports offering page |
| `/products.html` | Full product catalog entry point |
| `/products/:slug` | Product detail pages and legacy product aliases |
| `/news` | Complete news archive |
| `/news.html` | Experience-led Discover showcase |
| `/news/:slug` | News article pages |
| `/about` and `/about-us.html` | Company story, 3D concept, Factory, and Certificates |
| `/contact` and `/contactus.html` | Contact information and inquiry form |
| `/solutions` and `/solutions.html` | Venue and solution information |
| `/services.html` | Services and support information |
| `/manus-routes.json` | Public route manifest used by the hosting environment |

## Contact form behavior

The contact form currently opens the visitor’s own email application with a prepared `mailto:` draft addressed to `business@ljsportstech.com`. It does not send email automatically and does not claim that a message was delivered.

The repository contains provider-neutral server preparation, but automatic email delivery is intentionally inactive until an approved provider, credentials, and managed server configuration are supplied.

## Performance and accessibility notes

- Hero and project imagery load adaptively; inactive slides are deferred until needed.
- Product cards and gallery thumbnails use generated preview derivatives with original-image fallbacks.
- Product description images are lazy-loaded and include intrinsic dimensions where available to reduce layout shift.
- Noncritical Three.js effects are deferred, pause when hidden, and respect visibility, reduced-motion, and Save-Data preferences.
- Controls use visible focus styling and touch-friendly target sizes.
- The homepage and product/news layouts have been checked at narrow phone, short-landscape, tablet, and desktop sizes.
- Original product, news, certificate, and user-supplied images are retained; generated previews do not replace the originals.

## Content and asset notes

Product and news content is stored as a local snapshot so the site can render reliably without depending on the original domain at runtime. Product and article images are retained under `client/public/`. Some concept artwork is intentionally labeled as conceptual and should not be presented as a verified installation.

The approved LJ Sports Tech logo is used through the shared `SiteLogo` component, with a local fallback for unavailable managed storage.

## Deployment

For step-by-step Vercel and GitHub Pages instructions, see [`DEPLOYMENT.md`](./DEPLOYMENT.md).

The repository is configured for a static build with:

```text
Build command: pnpm install --frozen-lockfile && pnpm build:static
Output directory: dist/public
```

The live domain and DNS are not changed by local development or by the build scripts. Publishing should be handled by the hosting platform after reviewing the generated output and repository checkpoint.

## License

The project package metadata declares the **MIT License**. Unless a separate notice says otherwise, the application source code may be used, modified, and redistributed under the MIT terms.

Images, logos, product photographs, article content, company names, trademarks, and other third-party or LJ Sports Tech brand materials may have separate ownership or usage conditions. Do not assume that the MIT declaration grants rights to reuse those assets or content independently of the project. Check the relevant asset source and obtain permission where required.

## Status

This is an actively maintained website project. The current implementation preserves the existing LJ Sports Tech content, product/news routes, responsive navigation, interactive 3D presentation, contact behavior, and static prerendering workflow.
