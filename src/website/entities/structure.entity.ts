import { BaseEntity } from "../../shared/base.entity";
import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import {
  FooterSectionInfo,
  HeroSectionInfo,
  NavbarSectionInfo,
  ContentSectionInfo,
  PageTypes,
  WebsitePageConfig,
} from "./section-props";

// @Entity({ name: "def_themes" })
// export class Theme extends BaseEntity {
//   @Column({ length: 100 })
//   title: string;

//   @Column({ length: 250 })
//   description: string;

//   @Column({ type: "json", default: {} })
//   config: object;

//   @Column({ length: 50, default: "ACTIVE" })
//   status: string;
// }

@Entity({ name: "websites" })
export class Website extends BaseEntity {
  @Column({ length: 100 })
  handle: string;

  @Column({ length: 50, name: "theme_id" })
  themeId: string;

  // @Column()
  // mainPageId: string; // TODO: Next Version

  @Column({ type: "json", default: {} })
  config: object;

  @Column()
  ownerId: string;

  @OneToMany(() => WebsitePage, (page) => page.website)
  pages: WebsitePage[];

  @Column({ type: "json", default: {}, name: "theme_overrides" })
  themeOverrides: object;
}

@Entity({ name: "def_pages" })
export class Page extends BaseEntity {
  @Column({ length: 100 })
  title: string;

  @Column({
    type: "enum",
    enum: PageTypes,
    name: "page_type",
  })
  type: PageTypes;

  @Column({ length: 100, nullable: true })
  navbarVariant?: string;
  @Column({ length: 100, nullable: true })
  heroVariant?: string;
  @Column({ length: 100, nullable: true })
  footerVariant?: string;

  // from pageSectionFactory
  navbarCustomProps?: NavbarSectionInfo;

  // from pageSectionFactory
  heroCustomProps?: HeroSectionInfo;

  // from pageSectionFactory
  contentOverrides?: ContentSectionInfo;

  // from pageSectionFactory
  footerCustomProps?: FooterSectionInfo;

  // from pageSectionFactory
  themeOverrides?: object;

  @Column({ length: 100, name: "frontend_variant_key" })
  frontendVariantKey: string;

  @Column({ length: 500 })
  description: string;

  @Column({ type: "json", name: "consumed_data_parts", default: [] })
  consumedDataParts: []; // [{dataPart: "profile", version: 1, isRequired: true}]

  // @Column({ type: "json", name: "readonly_config", default: {} })
  // readonlyConfig: {}; // TODO: do not remove this until the time comes

  @Column({ type: "json", name: "meta_tags", default: [] })
  metaTags: [];

  @OneToMany(() => WebsitePage, (wPage) => wPage.parentPage)
  websitePages: WebsitePage[];

  @Column()
  editable: boolean;
}

@Entity({ name: "website_pages" })
export class WebsitePage extends BaseEntity {
  @ManyToOne(() => Page, (page) => page.websitePages)
  parentPage: Page;

  // to override website layout
  @ManyToOne(() => Page, (page) => page.websitePages, { nullable: true })
  layout?: Page;

  @ManyToOne(() => Website, (website) => website.pages)
  website: Website;

  @Column({ type: "json", default: {} })
  config: WebsitePageConfig;

  @Column({ type: "json", name: "navbar_custom_props", nullable: true })
  navbarCustomProps?: object;

  @Column({ type: "json", name: "hero_custom_props", nullable: true })
  heroCustomProps?: object;

  @Column({ type: "json", name: "content_custom_props", nullable: true })
  contentOverrides?: ContentSectionInfo;

  @Column({ type: "json", name: "footer_custom_props", nullable: true })
  footerCustomProps?: object;

  @Column({ nullable: true })
  slug: string; //custom url for page

  @Column({ type: "json", default: {}, name: "theme_overrides" })
  themeOverrides: object;

  @Column({ default: false })
  deletable: boolean;

  @Column({ type: "json", name: "meta_tags", default: [] })
  metaTags: [];
}
