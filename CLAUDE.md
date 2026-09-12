# Project Notes

## Old colors (no longer used — kept for reference)

| Variable | Old value | Role |
|---|---|---|
| `--green` | `#C1F238` | Accent (lime green) |
| `--dark` | `#002B14` | Primary (deep forest green) |
| `--soft-bg` | `#F0F3F5` | Secondary (light blue-grey) |

## Current colors

| Variable | Value | Role |
|---|---|---|
| `--green` | `#FDCC54` | Accent |
| `--dark` | `#00212B` | Primary |
| `--soft-bg` | `#eef0fa` | Secondary |

## New content pages — always check spacing between hero and body

When adding a new page with a `.hero-section` followed by a content section, the default
`.hero-section--compact` bottom padding (80px) is usually enough on its own. Do not add a
custom `padding-bottom` override to the hero AND leave the content section with no
`padding-top` — that combination (seen on the first draft of `/privacy` and `/terms`) makes
the first heading visually touch the hero section. Before shipping any new page, actually look
at the rendered spacing between the hero and the first heading below it, on both desktop and
mobile, rather than assuming the values are fine.
