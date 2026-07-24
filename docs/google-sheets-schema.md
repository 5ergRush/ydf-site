# Google Sheets Schema

## Direction

Google Sheets is the planned lightweight editorial CMS for public festival
content. It is not the database for accounts, products, prices, purchases,
payments, roles, QR tokens, or audit records; those are stored in Supabase.

The website should consume machine-readable data, not spreadsheet presentation. Data tabs should avoid merged cells and visual-only meaning.

## Tabs

- `Artists`
- `Passes` (legacy public-pricing fallback during the Supabase transition)
- `ScheduleData`
- `ScheduleVisual`
- `Roadmap`
- `Settings`

## Data Rules

- `ScheduleData` is the source of truth for schedule data.
- `ScheduleVisual` is a human-friendly or generated overview and should not be parsed by the website.
- Do not parse merged cells, colors, or visual positioning as data.
- Use stable IDs, slugs, `sortOrder`, `isVisible`, and `isFeatured`.
- Use ISO dates, for example `2026-08-21`.
- Use 24h times, for example `19:30`.
- Avoid merged cells in all machine-readable data tabs.
- Use semicolon-separated lists only where a list field is needed, such as artist IDs on a schedule row.
- Keep column names stable once the website depends on them.

## Proposed Artists Schema

```txt
id | slug | name | role | country | city | bio | excerpt | image | instagram | website | sortOrder | isFeatured | isVisible
```

Notes:

- `id` should be stable and not derived from row number.
- `slug` is for URLs or anchors if artist detail pages are added later.
- `role` can contain values like artist, DJ, instructor, performer, or organizer if needed.
- `excerpt` is for homepage previews.
- `bio` can be long and should be used on the full lineup page.

## Legacy Passes Schema

```txt
id | slug | name | price | currency | originalPrice | description | benefits | badge | ctaLabel | ctaUrl | sortOrder | isFeatured | isVisible
```

Notes:

- `benefits` may be semicolon-separated if stored in one cell.
- Do not invent prices or discounts.
- `isFeatured` can drive highlighted pricing card styling.
- Do not store participant purchases, payment status, or price snapshots here.
- The public pricing page prefers active, published Supabase products. This tab
  remains a temporary fallback until the catalog has been populated.

## Proposed ScheduleData Schema

```txt
id | day | date | start | end | title | type | track | artists | venue | description | isVisible
```

Notes:

- `date` uses ISO format.
- `start` and `end` use 24h local time.
- `artists` may be semicolon-separated artist IDs or names until a richer data layer exists.
- `type` should use controlled values where possible.

## Proposed Roadmap Schema

```txt
id | title | description | status | dateLabel | sortOrder | isVisible
```

Notes:

- `status` can describe planning, announced, confirmed, or completed states.
- `dateLabel` is display text and should not replace real dates if machine sorting is needed later.

## Proposed Settings Schema

```txt
key | value | description
```

Possible settings:

- `festivalName`
- `editionLabel`
- `city`
- `country`
- `domain`
- `instagramUrl`
- `ticketUrl`
- `contactEmail`
- `isTicketSalesOpen`
