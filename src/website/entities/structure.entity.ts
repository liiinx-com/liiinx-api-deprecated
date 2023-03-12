import { BaseEntity } from "../../shared/base.entity";
import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import {
  FooterSectionInfo,
  HeroSectionInfo,
  NavbarSectionInfo,
  ContentSectionInfo,
  PageTypes,
} from "./section.types";

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

export class PageStructure extends BaseEntity {
  @Column({ type: "json", name: "navbar_config", nullable: true })
  navbarConfig?: NavbarSectionInfo;

  @Column({ type: "json", name: "hero_config", nullable: true })
  heroConfig?: HeroSectionInfo;

  @Column({ type: "json", name: "content_config", nullable: true })
  contentConfig?: ContentSectionInfo;

  @Column({ type: "json", name: "footer_config", nullable: true })
  footerConfig?: FooterSectionInfo;
}

@Entity({ name: "def_pages" })
export class Page extends PageStructure {
  @Column({ length: 100 })
  title: string;

  @Column({
    type: "enum",
    enum: PageTypes,
    name: "page_type",
  })
  type: PageTypes;

  @Column({ length: 100, name: "frontend_variant_key" })
  frontendVariantKey: string;

  @Column({ length: 500 })
  description: string;

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
export class WebsitePage extends PageStructure {
  @ManyToOne(() => Page, (page) => page.websitePages)
  parentPage: Page;

  @ManyToOne(() => Page, (page) => page.websitePages, { nullable: true })
  layout?: Page;

  @ManyToOne(() => Website, (website) => website.pages)
  website: Website;

  @Column({ type: "json", default: {} })
  config: object;

  // @Column(() => PageStructure)
  // structureOverrides: PageStructure;

  @Column({ nullable: true })
  slug: string; //custom url for page

  @Column({ type: "json", default: {}, name: "theme_overrides" })
  themeOverrides: object;

  @Column({ default: false })
  deletable: boolean;

  @Column({ type: "json", name: "meta_tags", default: [] })
  metaTags: [];
}
