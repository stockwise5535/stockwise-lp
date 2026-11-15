# Correct published homepage brand fix

2026-11-14 (America/Los_Angeles).

Source: user-supplied `stockwise-homepage-source.zip`, from the original Mac
`Desktop/NexOps/stockwise-homepage 5` folder. Its white design, English headings,
nav and original video poster match the user's production screenshot. Vercel's
`stockwise-homepage` project has no Git connection. Earlier stockwise-lp deployment
was a different project and did NOT update the requested homepage.

## Completed

- Replace MIERUKA with Stockwise across root, English, Japanese and both Chinese
  pages: titles, descriptions, header, CTAs, body and footer.
- Reuse the exact app V3 PNG (hexagon + wordmark), with a CSS dark treatment for
  the white header, not a newly drawn approximation. Add matching favicon and
  1200×630 social card/metadata.
- Preserve all original body content other than brand/logo, inline scripts,
  destinations, video references, poster/article artwork and region redirects.
- Fix narrow navigation and input sizing; no document overflow at six widths.
- Prepare hash-checked, fixed-project Mac publishing helper; it backs up changed
  originals, rejects unreviewed edits/wrong project/missing video, preserves the
  original routing/video, and does not automatically retry a failed deployment.

## Validation actually performed

9 local unit/preservation/preflight checks passed. Chromium checks passed for all
5 pages at 320, 375, 390, 768, 1024 and 1440px (30 combinations). English desktop
and Japanese mobile screenshots visually reviewed. Static build of the supplied
source passed. Video was intentionally excluded from the uploaded ZIP, so movie
playback and a complete media-bearing build are NOT claimed. The helper requires
the original Mac video instead of shipping a broken media-free replacement.
Source/dist secret scan and diff whitespace checks are run before committing.

## Release state

Correct HP not yet deployed by this cloud session: no Vercel management credentials.
The owner explicitly authorized publication; only the owner's already-linked Mac
CLI is needed. Git source is saved on a dedicated branch, not merged into the
separate stockwise-lp main. No email, billing, Supabase or secret change.
