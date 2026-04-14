# Code Review Rules

## TypeScript
- Use `const`/`let`, never `var`
- No implicit `any` types
- Prefer explicit return types on exported functions

## React
- Use functional components only
- Prefer named exports
- Exception: route files use `export default` as required by React Router v7
- Keep components small and focused
- No inline components defined inside render
- Always declare explicit return types on exported functions (`: JSX.Element`, `: JSX.Element | null`, etc.)

## Styling
- Use Tailwind CSS utility classes
- Follow the existing design system (CSS variables: bg-background, text-foreground, etc.)
- Mobile-first responsive design

## General
- Code and comments in neutral Spanish
- No console.log in production code (use structured logging)
- Handle loading and error states explicitly
