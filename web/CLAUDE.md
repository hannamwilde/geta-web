@AGENTS.md

# Code style

- Use ES modules (import/export) syntax, not CommonJS (require)
- Destructure imports when possible (eg. import { foo } from 'bar')
- Keep comments short, max 1-2 lines
- Use css nesting

# Workflow

## Where a component goes

- `components/blocks/` — Sanity page-section blocks, rendered by `blocks/pageSections`. Every block folder is named `<name>Block`.
- `components/layout/` — app chrome used by `app/layout.tsx` or every route (nav, footer, modals).
- `components/ui/` — primitives shared by more than one block or layout component.
- `app/<route>/_components/` — a template used by a single route. The `_` prefix keeps Next from treating it as a route segment; import it relatively, not via `@/components`.
- A component used by exactly one block is a sub-component of that block, not a top-level entry.

## Folder structure

- When creating a new component folder the structure should be:
  1.  Folder name describing the component in camel-case for example bannerBlock
  2.  The folder should contain index.tsx and styles.module.scss (if there are any styles for the component)
  3.  If the components has "sub-components" for example banner block CTA, create another folder called components and place a new folder for the sub-component here called bannerBlockCta
  4.  Sub-folders should also contain index.tsx and styles.module.scss (if there are any styles for the component)
  5.  So this structure should generate something like this:
      - bannerBlock
        index.tsx
        styles.module.scss
        - components
          - bannerBlockCta
            index.tsx
            styles.module.scss
