# Schedule Architecture

## Source Of Truth

`ScheduleData` is the database tab for schedule content. The website should render from this machine-readable data.

`ScheduleVisual` is optional. It can be a generated visual schedule or a human-friendly overview for organizers, but it should not be treated as the frontend data source.

## Recommended ScheduleData Columns

```txt
id | day | date | start | end | title | type | track | artists | venue | description | isVisible
```

## Controlled Event Types

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

## Data Rules

- Use ISO dates.
- Use 24h times.
- Keep one event per row.
- Avoid merged cells.
- Do not use colors, visual position, or spreadsheet layout as data.
- Use stable `id` values.
- Hide events with `isVisible` rather than deleting rows that may be referenced elsewhere.
- Use semicolon-separated lists only where needed, such as multiple artists.

## Frontend Rendering Direction

The website should render mobile-friendly grouped schedule cards or a timeline:

- Group by date/day.
- Sort by `date`, then `start`, then `sortOrder` if added later.
- Display event type, title, time range, venue, artists, and description.
- Keep cards readable on mobile before optimizing desktop density.

## ScheduleVisual Direction

A future Google Apps Script may generate `ScheduleVisual` from `ScheduleData` for organizers and marketing review.

That script should:

- Read from `ScheduleData`.
- Write or refresh `ScheduleVisual`.
- Avoid making `ScheduleVisual` the source of truth.
- Keep generated formatting separate from the website data contract.
