# LJ Sports Tech news source notes

The News section is a snapshot of the English-language source pages retrieved on 6 November 2026. Sources: [news listing](https://www.ljsportstech.com/news.html), [robots.txt](https://www.ljsportstech.com/robots.txt), [sitemap](https://www.ljsportstech.com/sitemap.xml), and the individual article URLs recorded in `client/src/data/news-index.json`.

The source sitemap and accessible listing pages identified 70 unique article URLs. All 70 detail pages were retrieved and their article bodies imported. The source archive uses pagination under `/index/`, which its robots.txt disallows, so the full archive total could not be independently verified; the website identifies this collection as a dated selection rather than asserting complete coverage. The individual full articles are retained as supplied by the source, not independently fact-checked.

The article body markup is allowlist-sanitized; executable markup and an interactive form were removed. Product and category links in the source stories continue to point to the existing LJ website. Before changing the live `ljsportstech.com` domain to serve this project, migrate or otherwise preserve those product/category destinations; the present project contains product navigation links, not full product detail pages.

The 143 distinct news images were copied from the source's public image hosts, resized without cropping and optimized into `client/public/news-images/` because the remote CDN was not reliable in browser testing. Article bodies use local paths, and the original article URLs remain in the index for reference. Article body text was compared against the extracted source text after the image and internal-link updates, with no text changes detected.
