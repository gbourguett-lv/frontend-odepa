# Code Review Rules

## TypeScript
- Use `const`/`let`, never `var`
- No implicit `any` types
- Explicit return types on all functions (exported and internal)
- Use `import type { ReactElement }` from `'react'` for component return types — NOT `JSX.Element` (no global JSX namespace in `react-jsx` mode)

## React
- Use functional components only
- Prefer named exports
- Exception: route files use `export default` as required by React Router v7
- Keep components small and focused
- No inline components defined inside render
- All components must declare explicit return types: `: ReactElement`, `: ReactElement | null`, etc.

## Styling
- Use Tailwind CSS utility classes
- Follow the existing design system (CSS variables: bg-background, text-foreground, etc.)
- Mobile-first responsive design

## General
- Code and comments in neutral Spanish
- No console.log in production code (use structured logging)
- Handle loading and error states explicitly

## Tooling

All commands run from `frontend-odepa/`:

| Command | Description |
|---------|-------------|
| `npm run lint` | ESLint check (no auto-fix) |
| `npm run lint:fix` | ESLint auto-fix |
| `npm run format` | Prettier format all `app/**/*.{ts,tsx}` |
| `npm run format:check` | Prettier format check |
| `npm run typecheck` | `react-router typegen` + `tsc` |
| `npm run test` | Vitest (single run + coverage) |
| `npm run test:watch` | Vitest watch mode |

Pre-commit hook (Husky + lint-staged) runs ESLint + Prettier on staged `app/**/*.{ts,tsx}` files automatically.

## Notes
- `vitest.config.ts` is excluded from `tsc` — Vite 8 (Rolldown) and Vitest's bundled Vite (Rollup) have incompatible plugin types at the TS level. Tests still run correctly.
