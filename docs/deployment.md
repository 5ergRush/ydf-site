# Deployment

## Production Setup

- GitHub production branch: `master`
- Vercel deploys from `master`
- Production domain: `yerevandancefestival.com`
- `www` and non-`www` domains are managed through Vercel
- DNS is managed in Porkbun

## Deployment Flow

Future pushes to `master` trigger a production deployment on Vercel.

For meaningful changes, run verification before pushing:

```bash
npm run lint
npx tsc -p tsconfig.json --noEmit
npm run build
```

Documentation-only changes do not require a build unless app code changed.

## Notes For Agents

- Do not change deployment settings unless explicitly asked.
- Do not rename the production branch.
- Do not change domain or DNS assumptions without updating this file and `AGENTS.md`.

## Account Environment

The account system requires the Vercel environment variables listed in
`.env.example`. The Supabase Secret key (`sb_secret_...`) is server-only.
Public Supabase and Turnstile values use `NEXT_PUBLIC_` and therefore require a
rebuild when changed.

See `docs/supabase-setup.md` for the full provisioning and launch checklist.
