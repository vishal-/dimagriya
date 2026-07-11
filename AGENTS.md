<!-- BEGIN:nextjs-agent-rules -->

# AGENTS.md

# Kids Brain Gym

This repository contains the Kids Brain Gym application.

The goal is to create an educational app for children that feels like a game rather than a learning platform.

---

# Project Philosophy

When making decisions, always optimize for:

1. Simplicity
2. Performance
3. Offline capability
4. Accessibility
5. Child-friendly UX

If a feature makes the app more complicated without improving the experience for kids, don't implement it.

---

# Target Audience

Children approximately 4–10 years old.

Remember:

- Kids cannot read long paragraphs.
- Kids tap randomly.
- Kids have short attention spans.
- Everything should provide immediate visual feedback.

---

# Design Principles

Always assume:

- Mobile first
- Tablet optimized
- Desktop only for development/testing

Maximum content width:

768px

Never design desktop-first layouts.

Spacing should be generous.

Touch targets should be at least 44px.

Animations should be subtle and smooth.

Avoid clutter.

---

# Performance

Performance is a feature.

Prefer:

- static assets
- local resources
- code splitting
- lazy loading
- memoization where appropriate

Avoid:

- unnecessary dependencies
- large runtime libraries
- repeated renders
- unnecessary API requests

The app should remain usable with slow internet.

Offline support is preferred whenever practical.

---

# Icons

Primary icon source:

Noto Emoji via Iconify.

Do not mix multiple icon styles within the same screen unless explicitly requested.

Icons should be cheerful and recognizable by children.

---

# Images

Prefer:

SVG

then

WebP

Avoid PNG unless transparency is required.

---

# Accessibility

Always include:

- keyboard navigation
- ARIA labels
- readable color contrast
- large tap areas

Never rely only on color to communicate meaning.

---

# Code Style

Prefer:

Small reusable components.

Keep components focused.

Extract logic into hooks when reused.

Avoid giant files.

Aim for readable code over clever code.

---

# React Guidelines

Prefer:

Server Components when possible.

Client Components only when interactivity is required.

Avoid unnecessary state.

Derived state should be computed rather than stored.

---

# Styling

Use TailwindCSS.

Prefer utility classes.

Avoid inline styles unless necessary.

Use CSS variables for theme values.

---

# Animations

Animations should help understanding.

Avoid flashy effects.

Prefer:

- fade
- slide
- scale
- subtle bounce

Avoid long animations.

---

# Game Design

Every activity should satisfy at least one of:

- pattern recognition
- observation
- memory
- logical thinking
- vocabulary
- creativity
- curiosity

Reward success immediately.

Never punish failure.

Hints are preferred over blocking progress.

---

# Difficulty

Activities should scale gradually.

Easy wins first.

Challenge later.

Never frustrate the child.

---

# Dependencies

Before adding a package, ask:

Can this be implemented using native APIs?

Avoid dependency bloat.

---

# Testing

Test on:

- small mobile
- large mobile
- tablet

Desktop is not the primary target.

---

# Naming

Use descriptive names.

Good:

PuzzleCard

MemoryGame

LevelSelector

Bad:

Card2

Helper

Stuff

---

# File Organization

Keep related files together.

Example:

/memory-game
    page.tsx
    GameBoard.tsx
    Card.tsx
    hooks.ts
    types.ts

---

# Git

Keep commits focused.

One logical change per commit.

---

# When Unsure

If multiple implementations are possible:

Choose the simpler solution.

If still unsure:

Choose the solution that is easiest to maintain.

---

# Golden Rule

Every change should make the app easier for a child to use.

If it doesn't improve the child's experience, reconsider the implementation.

<!-- END:nextjs-agent-rules -->
