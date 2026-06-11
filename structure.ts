import type {StructureResolver} from 'sanity/structure'
import {HomeIcon, DocumentTextIcon, DocumentIcon, ImageIcon, LinkIcon, MenuIcon, EnvelopeIcon} from '@sanity/icons'

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
        .title('Kundcase')
        .icon(DocumentTextIcon)
        .child(S.documentTypeList('kundcase').title('Kundcase')),
      S.listItem()
        .title('Client Logos')
        .icon(ImageIcon)
        .child(S.documentTypeList('clientLogo').title('Client Logos')),
    ])
