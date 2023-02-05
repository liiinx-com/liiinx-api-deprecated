import { BaseEntity } from "src/shared/base.entity";
import {
  Entity,
  Column,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";

export enum Status {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToMany(() => Website, (website) => website.owner)
  websites: Website[];
}

class GeneralInfo {
  @Column({ length: 100 })
  title: string;

  @Column({ length: 500 })
  description: string;

  @Column({
    type: "enum",
    enum: Status,
    default: [Status.DRAFT],
  })
  status: Status;
}

@Entity()
export class Website extends BaseEntity {
  @Column({ length: 100 })
  handle: string;

  @Column(() => GeneralInfo)
  generalInfo: GeneralInfo;

  @Column({ length: 100 })
  themeCode: string;

  @Column()
  mainPageId: string;

  @Column("simple-json")
  config: {};

  @ManyToOne(() => User, (user) => user.websites)
  owner: User;

  @OneToMany(() => Page, (page) => page.website)
  pages: Page[];

  // ! TODO:--------------------------
  navbar: string;
  footer: string;

  //   @Column({ type: "json" })
  //   @Column("simple-json")
  //   themeOptions: Object;
}

export enum PageTypes {
  HOME = "HOME",
  ABOUT = "ABOUT",
  CONTACT = "CONTACT",
  GENERIC = "GENERIC",
}

enum Sizes {
  AUTO = "AUTO",
  FULL = "FULL",
}

enum Direction {
  ROW = "ROW",
  COLUMN = "COLUMN",
}

@Entity()
class Page extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  type: PageTypes;

  @Column()
  variant: string;

  @Column(() => GeneralInfo)
  generalInfo: GeneralInfo;

  // @Column()
  // version: number;

  @Column("simple-json")
  config: {};

  @ManyToOne(() => Website, (website) => website.pages)
  website: Website;

  @OneToMany(() => PageColumn, (pageCol) => pageCol.page)
  columns: PageColumn[];
}

class PageColumn extends BaseEntity {
  @ManyToOne(() => Page, (page) => page.columns)
  page: Page;

  @Column("simple-json")
  config: {};

  @Column("simple-json")
  sizeConfig: {
    width: string | Sizes;
    height?: string;
  };

  @Column({ default: 0 })
  order: number;

  // @ManyToOne(() => Website, (website) => website.pages) // ! TODO: fix all relations later
  sections: ColumnSection[];
}

class ColumnSection extends BaseEntity {
  @ManyToOne(() => PageColumn, (col) => col.sections)
  column: PageColumn;

  @Column({ default: 0 })
  order: number;

  // @OneToOne(() => Section)
  // @JoinColumn()
  section: Section;

  @Column("simple-json")
  config: {};

  @Column()
  variant: string;
}

class Section extends BaseEntity {
  @Column(() => GeneralInfo)
  generalInfo: GeneralInfo;

  @Column()
  type: string;

  @Column("simple-json")
  defaultConfig: {};

  @Column("simple-json")
  readonlyConfig: {};
}

const heroSection = new Section();
heroSection.type = "HERO";
heroSection.readonlyConfig = {
  someReadonlyValue1: "yes, I am always there",
  someReadonlyValue2: "yes, me again",
};
heroSection.defaultConfig = {
  sampleProp1: "yes",
  sampleProp2: true,
  sampleProp3: {
    sampleChildProp: "yes2",
  },
  sampleProp4: [1, 2, 3],
};

heroSection.generalInfo = {
  title: "Hero section",
  description: "desc for page owner to learn about the section purpose",
  status: Status.PUBLISHED,
};

const navSection = new Section();
navSection.type = "NAVBAR";
navSection.generalInfo = {
  title: "Navbar section",
  description: "desc for page owner to learn about the section purpose",
  status: Status.PUBLISHED,
};

export const testData = () => {
  const sTradingWeb = new Website();

  sTradingWeb.generalInfo = {
    title: "Salamat Trading",
    description: "some desc for only the owner",
    status: Status.PUBLISHED,
  };

  // Assigning objects
  // sTradingWeb.pages = [stAboutPg];

  return sTradingWeb;
};

export const getAboutPage = () => {
  // ABOUT PAGE

  const stAboutPg = new Page();
  stAboutPg.type = PageTypes.GENERIC;
  stAboutPg.variant = "GENERIC";
  stAboutPg.config = { someValueForPage: true };
  stAboutPg.generalInfo = {
    title: "درباره ما",
    description: "some desc for owner only",
    status: Status.DRAFT,
  };

  // ABOUT PAGE COLUMNS
  const stAboutPgCol1 = new PageColumn();
  stAboutPgCol1.sizeConfig = { width: "30%" };
  stAboutPgCol1.config = { customPageCol1Config: true };
  stAboutPgCol1.order = 2;

  const stAboutPgCol2 = new PageColumn();
  stAboutPgCol2.sizeConfig = { width: Sizes.FULL };
  stAboutPgCol2.config = { customPageCol2Config: false };
  stAboutPgCol2.order = 1;

  // ABOUT PAGE COLUMN1 SECTIONS
  const stAboutPageCol1Sec1 = new ColumnSection();
  stAboutPageCol1Sec1.section = heroSection;
  stAboutPageCol1Sec1.variant = "HERO1";
  stAboutPageCol1Sec1.order = 1;
  stAboutPageCol1Sec1.config = {
    someProp: "salamatTradingCustomValue",
    sampleProp2: false,
  };

  stAboutPg.columns = [stAboutPgCol1, stAboutPgCol2];
  stAboutPgCol1.sections = [stAboutPageCol1Sec1];
  stAboutPgCol2.sections = [];

  return stAboutPg;
};
