# LJ Sports Tech Deployment Guide

This project is a React/Vite website with a static-first production build. The recommended deployment options are:

- **Vercel** for the simplest Git-connected deployment, preview deployments, and a root-domain or custom-domain site.
- **GitHub Pages** when the project should be hosted as static files from GitHub Actions.

The project’s production build prerenders the public pages into `dist/public/`, including the homepage, product catalog, product details, news archive, articles, About, Contact, Solutions, Services, and legacy HTML aliases.

Vercel and GitHub Pages can host the current static site. Neither option automatically enables the inactive server-side contact-email flow; the contact form continues to prepare a `mailto:` draft for `business@ljsportstech.com`.

## Before deploying

Use Node.js 20 or newer and pnpm 10.18.0. From the repository root, install dependencies and run the release checks:

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm check
pnpm test
pnpm build:static
git diff --check
```

The static build writes the deployable files to:

```text
dist/public/
```

To inspect the generated site locally, serve that directory with any static web server. For example:

```bash
python3 -m http.server 4173 --directory dist/public
```

Then open `http://localhost:4173/` and check the homepage, `/products.html`, `/news`, `/about`, `/contact`, and a representative product and article path.

## Option 1: Deploy to Vercel

Vercel is the preferred option when the site will use a root URL such as `https://example.com` or a custom domain. Vercel supports Vite projects and Git-connected preview deployments. Its Vite guidance also recommends multi-page output for production when the build produces multiple pages, which matches this project’s prerendered output. [1]

### Dashboard deployment

1. Push the repository to GitHub or another Git provider.
2. In Vercel, choose **Add New Project** and import the repository.
3. Set the project root to the repository root.
4. Use these build settings:

   ```text
   Framework preset: Other
   Install command: pnpm install --frozen-lockfile
   Build command: pnpm build:static
   Output directory: dist/public
   ```

   If Vercel manages dependency installation automatically, `pnpm build:static` is sufficient as the build command. Keep the install step locked to `pnpm-lock.yaml` when configuring it explicitly.

5. Deploy a preview first.
6. Test the preview at `/`, `/products.html`, `/news`, `/news.html`, `/about-us.html`, `/contactus.html`, and at least one original product and news URL.
7. Attach the production domain only after the preview has passed.

Vercel’s build configuration allows the output directory to be set explicitly when it differs from the platform default. This project requires `dist/public`, not the usual Vite `dist` directory. [2]

### Vercel CLI deployment

Install or run the Vercel CLI from the repository root:

```bash
pnpm dlx vercel
```

Follow the prompts to link the repository to a Vercel project. For a production deployment after the project is linked:

```bash
pnpm dlx vercel --prod
```

If the CLI asks for build configuration, use:

```text
Build command: pnpm build:static
Output directory: dist/public
```

### Optional `vercel.json`

A `vercel.json` file is not required for the current prerendered multi-page build. Avoid adding a catch-all rewrite to `/index.html` unless the application is intentionally changed to SPA-only output. Catch-all SPA rewrites can hide missing static pages and defeat the existing prerendered HTML.

If a future change removes prerendering and turns the site into a client-only SPA, use the rewrite pattern recommended by Vercel’s Vite documentation instead of copying the configuration below blindly. [1]

### Vercel environment variables

The current static build does not require a customer-provided API key or email-provider secret. Do not add private credentials to `VITE_*` variables because Vite exposes those variables to browser code.

If automatic contact delivery is enabled in the future, use a server-side function or approved backend with secrets stored in Vercel’s environment-variable settings. Keep the current mailto fallback until provider delivery is tested and approved.

## Option 2: Deploy to GitHub Pages

GitHub Pages is suitable for this project when the site is published as static files through GitHub Actions. Vite’s official static deployment guide recommends selecting GitHub Actions as the Pages source and uploading the generated build directory from a workflow. [3]

### Important URL limitation

The current application is designed for a root-domain deployment. It contains root-relative public paths such as `/assets/...`, `/news/...`, `/products.html`, and `/manus-storage/...`.

Therefore, the safest GitHub Pages targets are:

- `https://USERNAME.github.io/` for a user site;
- `https://ORGANIZATION.github.io/` for an organization site; or
- a custom domain attached to GitHub Pages.

A repository project site such as `https://USERNAME.github.io/REPOSITORY/` requires a separate base-path migration. Setting Vite’s `base` alone is not enough because application links and some asset paths are written as root-relative URLs. Do not deploy to a repository subpath until those paths have been adapted and the full route set has been retested.

Vite documents the corresponding `base` rule: use `/` for a root or custom-domain site, and `/<REPOSITORY>/` for a repository project site. [3]

### Configure the site base

For a user, organization, or custom-domain Pages site, the current root-path behavior is appropriate. If adapting the application for a repository project site, update `vite.config.ts` with a conditional base value and then audit all root-relative links and assets:

```ts
export default defineConfig({
  base: process.env.GITHUB_PAGES === "true" ? "/REPOSITORY/" : "/",
  // existing project configuration...
});
```

This snippet is only the first step of a project-site migration. Product links, article links, static assets, managed-storage paths, route-manifest paths, and prerendered HTML must all be checked against the subpath.

### Enable GitHub Pages

1. Open the repository on GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Add the workflow below at `.github/workflows/deploy-pages.yml`.
5. Commit and push it to the default branch.
6. Wait for the Actions workflow to finish, then open the Pages URL shown by GitHub.

### GitHub Actions workflow

This workflow uses pnpm, installs from the lockfile, builds the existing static output, uploads `dist/public`, and deploys it to GitHub Pages:

```yaml
name: Deploy static site to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10.18.0

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build static site
        run: pnpm build:static

      - name: Configure GitHub Pages
        uses: actions/configure-pages@v5

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist/public

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

The action permissions and Pages deployment sequence follow GitHub’s Pages workflow model and Vite’s official static deployment pattern. Pin action versions more tightly if your organization requires commit-SHA pinning. [3]

### GitHub Pages verification

After the workflow completes, test these paths directly instead of checking only the homepage:

```text
/
/products.html
/news
/news.html
/about-us.html
/contactus.html
/solutions.html
/services.html
/manus-routes.json
```

Also check one original product HTML alias, one `/products/<slug>` page, one `/news/<slug>` page, the homepage hero controls, the mobile product drawer, and the contact form’s mailto behavior.

Because the build emits actual HTML files for public paths, the site does not need a broad SPA fallback for the current production structure. A custom `404.html` can be added later for friendly missing-page messaging, but it should not be used to conceal broken generated routes.

## Custom domains and HTTPS

For either host, configure the custom domain in the hosting provider’s domain settings, then follow the provider’s DNS instructions. Test both the bare domain and the `www` variant if both are configured, and choose one canonical destination.

Do not change DNS simply to test a deployment. First validate the provider-generated preview or Pages URL, confirm the complete route set and contact behavior, and only then plan a domain cutover.

## Deployment checklist

Before considering the deployment complete:

- The build finishes with `pnpm build:static`.
- `dist/public/index.html` exists and contains the homepage content.
- Product and news pages are present in the generated output.
- `/manus-routes.json` returns JSON rather than the SPA shell.
- The refined logo and managed-storage assets load, with local fallbacks where available.
- Hero, showroom, project slider, 3D effects, and mobile navigation work.
- Reduced-motion behavior remains enabled.
- There is no horizontal overflow at 320px, 390px, tablet, and desktop widths.
- The contact form honestly opens a visitor email draft and does not claim automatic delivery.
- No private credentials are committed to the repository or exposed through `VITE_*` variables.
- The deployment preview is reviewed before any custom-domain or DNS change.

## References

[1]: https://vercel.com/docs/frameworks/frontend/vite "Vite on Vercel"
[2]: https://vercel.com/docs/builds/configure-a-build "Configuring a Build on Vercel"
[3]: https://vite.dev/guide/static-deploy "Vite Static Deployment Guide"
