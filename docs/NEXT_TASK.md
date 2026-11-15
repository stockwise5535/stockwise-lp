# Published homepage — NEXT TASK

## Status — 2026-11-14 (America/Los_Angeles)

Correct white homepage source received from the user's Mac ZIP and patched.
Local checks passed; the actual `stockwise-homepage` Production release is pending
execution on the original linked Mac folder. Do not confuse this with the separate
`stockwise-lp` Production deployment completed earlier.

Next action: run the pinned `scripts/publish-from-original.mjs` on the original
`Desktop/NexOps/stockwise-homepage 5` folder. It requires the existing correct
Vercel binding, unchanged original files/routing and nonempty `assets/demo.mov`;
backs up changed files before applying; preserves video; deploys once through the
owner's Vercel CLI; and checks `/en/` and `/ja/` for the new brand after deployment.
No cloud Vercel credential is available and no live deployment is claimed here.

Strategy/roadmap/current-task/relevant APAC context was read from stockwise-app
`f797b105c3fb16e9f815e2b9eed0dc3749f22a79`, where the four requested documents exist.
