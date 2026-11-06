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
