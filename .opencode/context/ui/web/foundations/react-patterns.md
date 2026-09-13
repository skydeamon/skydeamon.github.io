<!-- Context: ui/web/foundations/react-patterns | Priority: high | Version: 1.0 | Updated: 2026-09-11 -->
# React Patterns — Overview

**Category**: development  
**Purpose**: Modern React patterns, hooks usage, and component design principles  
**Used by**: frontend-specialist

## Overview

This guide covers modern React patterns using functional components, hooks, and best practices for building scalable React applications.

## Topics

| File | Covers |
|------|--------|
| `react-components.md` | Functional components, custom hooks, composition, compound components |
| `react-hooks.md` | useEffect dependencies, useMemo, useCallback |
| `react-state.md` | Local state first, useReducer |
| `react-performance.md` | Code splitting, virtualization |

## Best Practices

1. **Keep components small and focused** - Single responsibility principle
2. **Use TypeScript** - Type safety prevents bugs and improves DX
3. **Colocate related code** - Keep components, styles, and tests together
4. **Use meaningful prop names** - Clear, descriptive names improve readability
5. **Avoid inline functions in JSX** - Extract to named functions or useCallback
6. **Use fragments** - Avoid unnecessary wrapper divs
7. **Handle loading and error states** - Always show feedback to users
8. **Test components** - Use React Testing Library for user-centric tests

## Anti-Patterns

- ❌ **Prop drilling** - Use context or composition instead
- ❌ **Massive components** - Break down into smaller, focused components
- ❌ **Mutating state directly** - Always use setState or dispatch
- ❌ **Using index as key** - Use stable, unique identifiers
- ❌ **Unnecessary useEffect** - Derive state when possible
- ❌ **Ignoring ESLint warnings** - React hooks rules prevent bugs
- ❌ **Not memoizing context values** - Causes unnecessary re-renders

## References

- React Documentation (react.dev)
- React Patterns by Kent C. Dodds
- Epic React by Kent C. Dodds

**Related**: `ui/web/foundations/overview.md`, `ui/web/navigation.md`