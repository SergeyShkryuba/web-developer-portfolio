# Portfolio — Sergey Shkryuba

A multi-page static portfolio site built with Vite, TypeScript (strict) and
Tailwind CSS v4, organised along feature-sliced lines. No framework: everything
below is plain DOM code, which is the point — the site is also the sample.

|           |                                                                                |
| --------- | ------------------------------------------------------------------------------ |
| **Live**  | https://web-developer-portfolio-delta-navy.vercel.app                          |
| **Stack** | Vite 8 · TypeScript 6 (strict) · Tailwind CSS v4 · Vitest · ESLint · Prettier  |
| **CI**    | Typecheck, lint, format check, unit tests and a production build on every push |

## Structure

```
src/
  app/        entry point and wiring
  widgets/    header, footer, projects, modal
  features/   theme switcher, contact form, scroll reveal, back-to-top, …
  shared/     design tokens and global styles
pages/        about.html, contact.html
tests/        Vitest specs
```

Header and footer live in `src/widgets/*/**.html` and are injected into every
page at build time by `vite-plugins/html-inject.js`, so the markup exists once.

## Notable details

- **Strict TypeScript that is actually enforced.** `npm run typecheck` runs in
  CI with `noUncheckedIndexedAccess`, `noUnusedLocals` and friends on. (It had
  to be turned on: the project was configured as TypeScript but nothing ever
  ran the compiler, and about twenty type errors had accumulated behind it.)
- **No flash of the wrong theme.** The theme is applied by a tiny inline script
  in `<head>`, before first paint, rather than after the bundle loads.
- **Accessible project modal** with a focus trap, Escape handling and focus
  restored to the control that opened it.
- **Self-hosted fonts** via `@fontsource-variable`, so no render-blocking
  request to a third party and no visitor IP leaving for Google.
- **Reduced-motion aware** — animations degrade under
  `prefers-reduced-motion`.

## Contact form

The form posts JSON to whatever endpoint `VITE_CONTACT_ENDPOINT` names
(Formspree, Web3Forms, a serverless function — anything that accepts a POST).

```bash
cp .env.example .env
# then set VITE_CONTACT_ENDPOINT
```

With no endpoint configured the form does **not** claim success: it reports the
failure and points the visitor at the email address. That is deliberate — the
previous implementation was a mock that resolved on `Math.random() > 0.5`.

## Projects data

`src/widgets/projects/projects.json` is the single source of truth for the
projects section. Each entry needs `id`, `title`, `description`, `tags`,
`links.source` and `previewLabel`; `links.demo` and `preview` are optional, and
a project without a demo simply does not render a demo link. A test asserts
that every URL in the file is a real `https://` link, so a placeholder `#`
cannot reach production again.

## Scripts

| Command             | What it does                  |
| ------------------- | ----------------------------- |
| `npm run dev`       | Dev server                    |
| `npm run build`     | Production build into `dist/` |
| `npm run preview`   | Serve the built output        |
| `npm run typecheck` | `tsc --noEmit`                |
| `npm run lint`      | ESLint                        |
| `npm run format`    | Prettier, writing changes     |
| `npm test`          | Vitest                        |
| `npm run verify`    | Everything above, in CI order |

## Licence

MIT
