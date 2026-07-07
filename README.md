# WebFolio — Personal Portfolio Site

A modern, responsive portfolio website built with Vite, TypeScript, and Tailwind CSS. Currently a work-in-progress foundation; the goal is to turn this into a fully-featured portfolio that showcases your work, skills, and experience.

## What's here today

- **Multi-page structure** — Home, About, and Contact pages ready for content
- **Responsive design** — Built with Tailwind CSS and mobile-first approach
- **Header widget** — Navigation with mobile menu toggle and active-link highlighting
- **TypeScript support** — Type-safe development for all components
- **Vite-powered** — Fast development server and optimized builds

## What we're building

A complete personal portfolio site with:

- Hero section introducing you quickly
- About section with deeper background
- Skills section organized by category
- Projects section loaded from JSON, with modal previews
- Experience timeline
- Functional contact form with validation and async states
- Social meta tags for sharing
- Optimized performance and accessibility

## Getting started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm build

# Preview production build
npm run preview
```

The site will be available at `http://localhost:5173` (or the URL shown in your terminal).

## Project structure

This project uses **Feature-Sliced Design (FSD)**, organizing code into layers: `app` (core app logic), `pages` (page components), `widgets` (reusable UI blocks), `features` (user-facing functionality), `entities` (domain models), and `shared` (utilities, config, styles). Each layer only imports from lower layers, keeping dependencies clear and preventing circular imports.

See [docs/architecture.md](./docs/architecture.md) for a detailed explanation of each layer and import rules.

## How to contribute

Each task is tracked as a GitHub issue. Check the issue for what needs to be done, create a feature branch, make changes following the FSD layout, and open a pull request.
