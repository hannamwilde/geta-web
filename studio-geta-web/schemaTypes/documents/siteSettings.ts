import {defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons'

/**
 * Site-wide defaults. Every page falls back to these when it has no SEO of
 * its own, so this is the one place to change the brand name, the sharing
 * image or the search-engine switch.
 */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  icon: CogIcon,
  fieldsets: [
    {name: 'identity', title: 'Identity', options: {collapsible: true, collapsed: false}},
    {name: 'brand', title: 'Brand images', options: {collapsible: true, collapsed: false}},
    {name: 'seo', title: 'Default SEO', options: {collapsible: true, collapsed: false}},
    {name: 'social', title: 'Social sharing', options: {collapsible: true, collapsed: true}},
    {name: 'indexing', title: 'Search engines', options: {collapsible: true, collapsed: true}},
  ],
  fields: [
    // ── Identity ─────────────────────────────────────────────────────────────
    defineField({
      name: 'siteName',
      title: 'Site name',
      type: 'string',
      description: 'The brand name, shown in search results and link previews.',
      fieldset: 'identity',
      placeholder: 'Geta Digital',
    }),
    defineField({
      name: 'locale',
      title: 'Language',
      type: 'string',
      description: 'Sets the page language and the locale reported to social networks.',
      fieldset: 'identity',
      initialValue: 'sv_SE',
      options: {
        list: [
          {title: 'Svenska', value: 'sv_SE'},
          {title: 'Norsk', value: 'nb_NO'},
          {title: 'Dansk', value: 'da_DK'},
          {title: 'Suomi', value: 'fi_FI'},
          {title: 'English', value: 'en_US'},
        ],
      },
    }),

    // ── Brand images ─────────────────────────────────────────────────────────
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      description:
        'The icon shown in browser tabs and bookmarks. Use a square image, at least 512×512. PNG or SVG.',
      fieldset: 'brand',
      options: {accept: 'image/png,image/svg+xml'},
    }),
    defineField({
      name: 'placeholderImage',
      title: 'Placeholder image',
      type: 'image',
      description:
        'Stands in wherever content has no image of its own. It is letterboxed into each card rather than cropped, so any shape works — but upload it at least 1600px wide, since cards scale it up.',
      fieldset: 'brand',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', type: 'string', title: 'Alt text'})],
    }),

    // ── Default SEO ──────────────────────────────────────────────────────────
    defineField({
      name: 'defaultTitle',
      title: 'Default title',
      type: 'string',
      description: 'Used by pages that have no title of their own. Falls back to the site name.',
      fieldset: 'seo',
      placeholder: 'Geta Digital',
      validation: (rule) => rule.max(60).warning('Keep under 60 characters for best results'),
    }),
    defineField({
      name: 'titleTemplate',
      title: 'Title format',
      type: 'string',
      description:
        'How page titles are framed in the browser tab. %s is replaced by the page title.',
      fieldset: 'seo',
      placeholder: '%s | Geta Digital',
      validation: (rule) =>
        rule.custom((value) =>
          !value || value.includes('%s')
            ? true
            : 'Must contain %s, which stands for the page title',
        ),
    }),
    defineField({
      name: 'description',
      title: 'Default description',
      type: 'text',
      rows: 3,
      description: 'Shown in search results for pages with no description of their own.',
      fieldset: 'seo',
      placeholder:
        'Geta Digital är en nordisk e-handelskonsult specialiserad på strategi, design och teknisk utveckling för e-handel.',
      validation: (rule) => rule.max(160).warning('Keep under 160 characters for best results'),
    }),

    // ── Social sharing ───────────────────────────────────────────────────────
    defineField({
      name: 'ogImage',
      title: 'Default share image',
      type: 'image',
      description:
        'Used when a page is shared and has no image of its own. Recommended size: 1200×630.',
      fieldset: 'social',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', type: 'string', title: 'Alt text'})],
    }),
    defineField({
      name: 'twitterSite',
      title: 'X / Twitter handle',
      type: 'string',
      description: 'Including the @.',
      fieldset: 'social',
      placeholder: '@getadigital',
    }),

    // ── Indexing ─────────────────────────────────────────────────────────────
    defineField({
      name: 'noIndex',
      title: 'Hide the whole site from search engines',
      type: 'boolean',
      description: 'Adds noindex to every page. Use on a staging site — leave off in production.',
      fieldset: 'indexing',
      initialValue: false,
    }),
  ],
  preview: {
    prepare: () => ({title: 'Site settings'}),
  },
})
