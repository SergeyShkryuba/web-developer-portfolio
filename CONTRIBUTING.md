# Contributing to WebFolio

Thank you for contributing! Here's how to work on this project.

## Before you push

1. **Format your code:**

   ```bash
   npm run format
   ```

2. **Check for lint errors:**

   ```bash
   npm run lint
   ```

3. **Fix lint errors automatically (when possible):**
   ```bash
   npm run lint:fix
   ```

## Branch naming

Follow the naming pattern: `<issue-number>-<short-description-in-kebab-case>`

Example: `15-add-hero-section`, `23-fix-header-bug`

## Commit messages

Use conventional commits format:

- `feat(scope): description` — for new features
- `fix(scope): description` — for bug fixes
- `docs(scope): description` — for documentation
- `refactor(scope): description` — for refactoring
- `chore(scope): description` — for maintenance tasks

Example: `feat(hero): add animated intro section`

## Pull requests

- Keep PRs focused on a single issue
- Link the issue in the PR description with "Closes #123"
- Ensure all tests pass and linting is clean before opening
- No comments in PRs or issues unless clarification is needed
