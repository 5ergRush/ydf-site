<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Agent Working Guide

## Project Summary

This repository is the public website for Yerevan Dance Festival. The current edition is bachata-only and the site is a static/public marketing and information site for now.

Future content direction is to use Google Sheets as a lightweight CMS/database, with typed data structures in the app mapping cleanly to spreadsheet tabs.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- npm
- GitHub
- Vercel

## Current Public Routes

- `/` - homepage
- `/lineup` - bachata artists
- `/venues` - currently used as the Roadmap page
- `/pricing` - passes and pricing

Do not break or rename these routes unless explicitly asked.

## Branch And Deployment

- GitHub production branch: `master`
- Vercel deploys from `master`
- Production domain: `yerevandancefestival.com`
- `www` and non-`www` domains are managed through Vercel
- DNS is managed in Porkbun

See [docs/deployment.md](docs/deployment.md) for deployment notes.

## Important Project Docs

- [docs/branding.md](docs/branding.md)
- [docs/google-sheets-schema.md](docs/google-sheets-schema.md)
- [docs/schedule-architecture.md](docs/schedule-architecture.md)
- [docs/deployment.md](docs/deployment.md)
- [docs/content-guidelines.md](docs/content-guidelines.md)

## Brand Rules

The YDF visual identity is based on Instagram/social media references: warm, energetic, sensual, premium, and festival-focused.

Core visual direction:

- Warm orange, red, and pink gradients
- Secondary magenta, purple, and deep violet gradients
- Dark/violet base surfaces
- White bold typography
- Gold accents used sparingly for premium and pass highlights
- Sparkles, soft glows, and curved decorative line motifs

Main palette:

- Orange: `#FFB000`
- Deep orange: `#FF5E00`
- Pink/red: `#FF005C`
- Magenta: `#FF2D9A`
- Purple: `#A100FF`
- Deep violet: `#2A005F`
- Gold: `#FFD166`
- White: `#FFFFFF`
- Near black: `#120014`

Preserve the current brand styling unless the task explicitly asks for a redesign. Avoid generic SaaS styling.

## Content Rules

This edition is bachata-only.

- Use "Bachata Edition", "bachata artists", "bachata classes", and "bachata parties".
- Do not use kizomba wording unless it appears in an artist's broader personal background.
- Do not invent artists, prices, dates, venues, schedule items, or claims.
- Keep copy understandable for international visitors.
- Artist descriptions may be long; layouts must handle long text gracefully.
- Homepage artist previews should use excerpts, horizontal scroll, carousel, or a CTA to the full lineup instead of cramped full bios.

See [docs/content-guidelines.md](docs/content-guidelines.md) for more.

## Google Sheets Direction

Google Sheets is the current planned lightweight CMS/database.

Planned tabs:

- `Artists`
- `Passes`
- `ScheduleData`
- `ScheduleVisual`
- `Roadmap`
- `Settings`

`ScheduleData` is the machine-readable source of truth for the website. `ScheduleVisual` is optional and should be a generated or human-friendly overview, not parsed by the website.

Avoid relying on:

- Merged cells
- Colors as data
- Visual position as data

Prefer stable fields such as:

- `id`
- `slug`
- `sortOrder`
- `isVisible`
- `isFeatured`

Use ISO dates and 24h times. Avoid merged cells in data tabs. Use semicolon-separated lists only where a list field is unavoidable.

See [docs/google-sheets-schema.md](docs/google-sheets-schema.md) and [docs/schedule-architecture.md](docs/schedule-architecture.md).

## Schedule Direction

Recommended `ScheduleData` columns:

```txt
id | day | date | start | end | title | type | track | artists | venue | description | isVisible
```

Use controlled event types where possible:

- `workshop`
- `party`
- `registration`
- `meal`
- `tour`
- `pool`
- `afterparty`
- `show`
- `competition`
- `break`
- `social`
- `masterclass`

The website should eventually render schedule content as mobile-friendly grouped cards or timelines from `ScheduleData`.

## Development Workflow

Before making changes:

- Inspect relevant files first.
- Read relevant project docs before editing.
- For Next.js app code, read the relevant guide in `node_modules/next/dist/docs/` first.
- Keep changes focused.
- Avoid unnecessary dependencies.
- Prefer editable data files and typed structures over repeated hardcoded markup.
- Preserve brand and content rules unless explicitly asked to change them.

After code changes, run:

```bash
npm run lint
npx tsc -p tsconfig.json --noEmit
npm run build
```

For documentation-only changes, a build is not required unless app files changed.

When reporting back, include:

- Changed files
- Assumptions
- Commands run and results

## Keeping Docs Updated

Update `AGENTS.md` and the relevant file under `docs/` when changing:

- Routes
- Deployment setup
- Data source or schema
- Brand rules
- Content rules
- Schedule architecture
- Major component architecture
- Recurring development workflow

Do not update project docs for tiny visual tweaks, copy-only edits, or one-off fixes unless they affect future work.
