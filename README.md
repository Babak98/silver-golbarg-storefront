# Silver Golbarg | نقره گلبرگ

A Persian, right-to-left silver jewelry storefront built with AI assistance for a real small business in Iran.

**Portfolio owner:** Hamidreza Rahmani (Babak)

**Live storefront:** https://silver-golbarg.hrs777.chatgpt.site/

## What it demonstrates

- Persian RTL storefront and product detail pages.
- Owner-only product creation, editing, deletion, and image upload.
- Price calculation from weight and per-gram pricing groups.
- Persian/Arabic numeral normalization and input validation.
- Cloudflare D1 persistence and R2 image storage.

This is a web development case study, not a machine-learning project. It complements my AI research portfolio by showing a practical business application. Development used AI assistance; this repository does not claim the code was written entirely by hand.

## Stack

TypeScript, React, Next.js-compatible Vinext, Vite, Cloudflare Workers, D1, R2, and Drizzle migrations. See package.json and package-lock.json for pinned dependencies.

## Local setup

Requires Node.js >=22.13.0. Run `npm run install:ci`, then `npm run build`. Apply the SQL migrations in drizzle/ in order to a local D1 database using the generated dist/server/wrangler.json configuration:

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_gigantic_giant_man.sql
```

Use the actual migration filenames in this checkout. Then run `npm run dev`. Local data starts empty; production database contents and uploaded product photos are not included.

The owner email in lib/owner.ts is deliberately `owner@example.com`. Replace it in your private deployment configuration before using management features. The starter's loopback-only mock sign-in uses a different identity; it does not automatically grant administrator access.

## Hosting and limits

Hosted sign-in depends on Sites' trusted identity headers and dispatch-owned authentication routes. This source cannot be deployed unchanged to an arbitrary server with equivalent authentication. Provision your own DB/BUCKET bindings and trusted authentication before deployment; never trust user-supplied identity headers on a publicly exposed standalone server.

The original Sites project identifier has been removed. The pricing initialization branch contains demo identifiers rather than live product identifiers. Business contact information already shown in the public storefront remains in this snapshot.

Orders are made by phone or Instagram; no online payment or checkout is implemented. No conversion, revenue, or AI-model performance claims are made. This portfolio snapshot was inspected but has not been independently built or tested after sanitization.

## Code map

- app/: storefront, product pages, admin screens, and API routes.
- lib/: product access, pricing validation, owner authorization.
- drizzle/: database migrations.
- public/: visual assets and font license.
- scripts/ and build/: starter runtime and hosting support.

Third-party license notices are preserved. No additional project-wide license is granted by this snapshot.

