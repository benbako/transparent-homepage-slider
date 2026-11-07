# LJ Sports Tech

React / Express / tRPC / Drizzle starter, adapted from the Sandbox web-db-user template.

- `pnpm dev:static`: the static-site development server; honors `PORT` (default 3000).
- `pnpm build:static`: build the static website, including prerendered product and news pages in `dist/public/`.
- `pnpm build` / `pnpm start`: also build the prerendered site and serve it with the optional Express server.
- `pnpm dev`: optional Express development server; honors `PORT` (default 3000).
- `pnpm db:migrate`: apply checked-in migrations. `pnpm db:push`: generate and apply new schema changes.
- `pnpm check` / `pnpm test`: types and application tests.

Start with the Webdev skill's default-template guide. Platform login, storage, payments and service contracts live in its shared references; read the relevant capability before extending its helper.

`server/_core/publicConfig.ts` exposes only named public runtime values. Private keys stay server-side. The platform serves managed `/manus-storage/` assets; the application does not register a second proxy.

Platform configuration is readable and editable through `webdev.config`. Default settings are initial values, not enforced constraints. The agent may modify the files, commands and configuration or follow the flexible guide for another stack.
