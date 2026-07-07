# Architecture — Feature-Sliced Design

WebFolio uses **Feature-Sliced Design (FSD)**, a vertical slicing architecture that organizes code by features rather than layers. This keeps features self-contained and prevents circular dependencies.

## The Six Layers (bottom to top)

### 1. `shared/`

**What lives here:** Low-level utilities, configs, styles, and constants shared across the entire app — things with **no dependencies** on domain logic.

**Examples:** `CONFIG`, helper functions, global CSS, reusable UI utilities, date formatters.

**Does NOT contain:** Feature logic, page-specific code, anything that knows about the app's domain.

**In this codebase:** `src/shared/config/` (CONFIG.APP_NAME), `src/shared/styles/` (global CSS).

---

### 2. `entities/`

**What lives here:** Core business objects and models — the "nouns" of your app. Entities have no side effects; they're pure data structures and their methods.

**Examples:** A `User` entity with a `getName()` method, a `Portfolio` data structure, a `Project` model.

**Does NOT contain:** API calls, UI logic, or business processes that span multiple entities.

**In this codebase:** (Empty for now, will hold domain models like `Portfolio`, `Project`, `Experience`.)

---

### 3. `features/`

**What lives here:** User-facing business logic — features that users interact with. A feature wraps entities and provides use cases. Features are self-contained and reusable.

**Examples:** "Contact form submission", "load projects from JSON", "open project in modal".

**Does NOT contain:** Page layout or app-level logic (that's for `pages/`).

**In this codebase:** (Empty for now, will hold features like `ProjectModal`, `ContactForm`, `SkillsFilter`.)

---

### 4. `widgets/`

**What lives here:** Reusable UI components that wrap features and entities. Widgets are "smart" — they contain logic — but they're **composable and feature-agnostic**.

**Examples:** A `Header` widget, a `Footer` widget, a `ProjectCard` widget that displays a project.

**Does NOT contain:** Page-specific layout or app-wide orchestration.

**In this codebase:** `src/widgets/header/` (navigation bar), `src/widgets/footer/` (page footer).

---

### 5. `pages/`

**What lives here:** Page-level components that assemble features and widgets into complete pages. Each page is a route.

**Examples:** Home page, About page, Contact page.

**Does NOT contain:** Shared logic (that's widgets/features) or reusable UI (that's widgets).

**In this codebase:** `src/pages/` (will hold the page bundles and layouts).

---

### 6. `app/`

**What lives here:** The app-level entry point. Global setup, initialization, root styles, and the render target.

**Examples:** `main.ts` (the script tag in HTML), global error handling, app startup logic.

**Does NOT contain:** Feature logic or page assembly (that's `pages/`).

**In this codebase:** `src/app/main.ts` (imports shared styles and runs init code).

---

## Import Rule (The Dependency Rule)

**Higher layers can import from lower layers. Lower layers CANNOT import from higher layers.**

Visually:

```
app → pages, app-level setup
pages → widgets, features, entities, shared
widgets → features, entities, shared
features → entities, shared
entities → shared
shared → nothing (no external imports)
```

**Why?** This prevents circular dependencies and keeps concerns separated. If `entities` could import from `features`, you could have a cycle: `entity` → `feature` → `entity`.

---

## How to add new code

1. **Is it a reusable utility or constant?** → `shared/`
2. **Is it a business object or data model?** → `entities/`
3. **Is it a user-facing workflow?** → `features/`
4. **Is it a reusable UI block?** → `widgets/`
5. **Is it a page or route?** → `pages/`
6. **Is it app-level setup?** → `app/`

When in doubt, ask: "Where does this live in production?" If it's on multiple pages, it's a widget. If it only appears on one page, check if it's a feature or if it should be in `pages/`.
