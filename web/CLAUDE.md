@AGENTS.md

# Code style

- Use ES modules (import/export) syntax, not CommonJS (require)
- Destructure imports when possible (eg. import { foo } from 'bar')

# Workflow

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
