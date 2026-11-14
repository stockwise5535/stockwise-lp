# Homepage brand alignment — 2026-11-14

## Implemented locally

Repository: `stockwise5535/stockwise-lp`, based on main `28ace432b96b1481f9a6c1a222c9156569e151ec`.
Working branch: `codex/align-v3-branding`.

Customer-facing identity is now consistently **Stockwise** on `/` and `/ja/`.
Removed the old StockWise / 在庫Wise forms in titles, hero copy, product comparison,
mock dashboard and footer. No MIERUKA occurrence was found in either original page.
The box-emoji brand and letter-S mockup brand were replaced with the existing
hexagonal icon + wordmark PNG copied byte-for-byte from the V3 app header
(`stockwise-app` main `10e0a86c14d9ee685b310fac02fa341211d13ce7`,
`public/stockwise-logo.png`). Other feature pictograms remain unchanged.

Added a hexagonal favicon (the icon portion of that same PNG), localized social
metadata, and an actual 1200×630 PNG social card, with SVG source retained.
The old separate app icon was deliberately not reused because its SW artwork
does not match the requested V3 hexagonal mark.

Responsive rules preserve the desktop two-column layout and stack the hero,
feature and comparison sections on phones. The wide dashboard illustration scrolls
within its own region instead of overflowing the document. Existing CTA destinations,
prices, functional claims and third-party font link remain unchanged; this branding
change does not validate those existing marketing claims or pricing.

## Validation

- `npm test`: 3 brand/metadata/asset checks passed.
- `npm run build`: static production package created in `dist/`.
- `PLAYWRIGHT_PATH=/workspace/.growth-test-deps/node_modules/playwright-core npm run test:browser`:
  Chromium checks passed for both languages at 320, 375, 390, 768, 1024 and 1440px.
  Checks include document overflow, all three brand images loading, footer CTA
  visibility/bounds and unchanged CTA destination. Desktop and mobile screenshots
  are in ignored `artifacts/`; favicon was visually inspected too.
- External font requests are blocked in local browser tests; the existing fallback
  fonts were tested. No physical phone or hosted preview test is claimed.
- Source/build secret scan: 21 files inspected, no findings. `git diff --check` passed.
- Final browser pass served the actual `dist/` Production build on local port 4180.

## Limits / release state

The requested live alias returns proxy CONNECT 403 in this environment. The
repository's most recent GitHub Production deployment reports success, but its
immutable deployment URL alone does not confirm the requested alias mapping.
Confirm that mapping before a future release. Existing public production is unchanged.

No push, deployment, billing activation, email, SNS operation, Supabase schema/RLS
change or secret modification. Existing app/CRM work remains in its separate checkout.

## Context reviewed

The user-specified product strategy, roadmap, next-task and relevant APAC report
sections were read from development commit `f797b105c3fb16e9f815e2b9eed0dc3749f22a79`;
those documents do not exist on the current app main or homepage main. This report
records this homepage task only and does not relabel historical app verification.
