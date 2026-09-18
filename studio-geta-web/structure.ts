import type {StructureResolver} from 'sanity/structure'
import {HomeIcon, DocumentTextIcon, DocumentIcon, ImageIcon, LinkIcon, MenuIcon, EnvelopeIcon, CalendarIcon, TranslateIcon, EditIcon, CogIcon} from '@sanity/icons'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Geta Web')
    .items([
      S.listItem()
        .title('Home Page')
        .icon(HomeIcon)
        .child(
          S.document()
            .schemaType('homePage')
            .documentId('homePage')
            .title('Home Page'),
        ),
      S.listItem()
        .title('Navigation')
        .icon(MenuIcon)
        .child(
          S.document()
            .schemaType('nav')
            .documentId('nav')
            .title('Navigation'),
        ),
      S.listItem()
        .title('Footer')
        .icon(LinkIcon)
        .child(
          S.document()
            .schemaType('footer')
            .documentId('footer')
            .title('Footer'),
        ),
      S.listItem()
        .title('Site settings')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site settings'),
        ),
      S.listItem()
        .title('Translations')
        .icon(TranslateIcon)
        .child(
          S.document()
            .schemaType('translations')
            .documentId('translations')
            .title('Translations'),
        ),
      S.listItem()
        .title('Modals')
        .icon(EnvelopeIcon)
        .child(
          S.document()
            .schemaType('modals')
            .documentId('modals')
            .title('Modals'),
        ),
      S.listItem()
        .title('Pages')
        .icon(DocumentIcon)
        .child(S.documentTypeList('page').title('Pages')),
      S.divider(),
      S.listItem()
        .title('Blog posts')
        .icon(EditIcon)
        .child(S.documentTypeList('post').title('Blog posts')),
      S.listItem()
        .title('Events')
        .icon(CalendarIcon)
        .child(S.documentTypeList('event').title('Events')),
      S.listItem()
        .title('Cases')
        .icon(DocumentTextIcon)
        .child(S.documentTypeList('case').title('Cases')),
      S.listItem()
        .title('Client Logos')
        .icon(ImageIcon)
        .child(S.documentTypeList('clientLogo').title('Client Logos')),
    ])
