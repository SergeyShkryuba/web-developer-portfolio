# Design Tokens

## Colors

| Token           | Value                    | Usage                      |
| --------------- | ------------------------ | -------------------------- |
| `bg`            | `oklch(0.16 0.012 260)`  | Page background            |
| `surface`       | `oklch(0.205 0.014 260)` | Cards, panels              |
| `surface-2`     | `oklch(0.235 0.015 260)` | Alternating sections       |
| `ink`           | `oklch(0.97 0.006 250)`  | Primary text               |
| `muted`         | `oklch(0.72 0.012 255)`  | Secondary text             |
| `line`          | `oklch(0.34 0.012 260)`  | Borders, dividers          |
| `accent`        | `oklch(0.88 0.20 128)`   | Links, buttons, highlights |
| `accent-strong` | `oklch(0.83 0.21 128)`   | Hover / active states      |
| `on-accent`     | `oklch(0.18 0.04 145)`   | Text on accent background  |

## Typography

| Token          | Value                            |
| -------------- | -------------------------------- |
| `font-display` | `Bricolage Grotesque` — headings |
| `font-body`    | `Hanken Grotesk` — body text     |

## Shape

| Token       | Value |
| ----------- | ----- |
| `radius-sm` | `6px` |
| `radius-md` | `8px` |

## Adding new tokens

Add a CSS custom property inside `@theme` in `src/shared/styles/style.css`.
Tailwind v4 auto-generates utility classes from `--color-*`, `--font-*`, etc.
