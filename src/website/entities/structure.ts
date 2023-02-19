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

export class PageColumn extends BaseEntity {
  @ManyToOne(() => Page, (page) => page.columns)
  page: Page;

  @Column("simple-json")
  config: {};

  @Column("simple-json")
  sizeConfig: {
    width: string | Sizes;
    height?: string;
  };

  @Column()
  location: string;

  // @Column({ default: 0 })
  // order: number; // ! We don't need this

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
//------------------------------------
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
//------------------------------------
const titleBarSection = new Section();
titleBarSection.type = "TITLE_BAR";
titleBarSection.readonlyConfig = {
  someReadonlyValue1: "yes, I am always there",
};
titleBarSection.defaultConfig = {
  title: "",
  subTitle: "",
  titleStyle: {},
  subTitleStyle: {},
};
titleBarSection.generalInfo = {
  title: "Title section",
  description: "Used to display title and subtitles",
  status: Status.PUBLISHED,
};
//------------------------------------
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

export const getAboutPage = async () => {
  const stPage = new Page();
  stPage.id = "2";
  stPage.type = PageTypes.ABOUT;
  stPage.variant = "ABOUT1";
  stPage.config = { someValueForPage: true };
  stPage.generalInfo = {
    title: "درباره ما",
    description: "some desc for owner only",
    status: Status.DRAFT,
  };

  return stPage;
};

export const getHomePage = async () => {
  const stPage = new Page();
  stPage.id = "2";
  stPage.type = PageTypes.HOME;
  stPage.variant = "HOME1";
  stPage.config = { someValueForPage: true };
  stPage.generalInfo = {
    title: "Home Page",
    description: "some desc for owner only",
    status: Status.DRAFT,
  };

  return stPage;
};

export const getHomeGenericPage = async () => {
  const stHomePg = new Page();
  stHomePg.id = "1";
  stHomePg.type = PageTypes.GENERIC;
  stHomePg.variant = "GENERIC";
  stHomePg.config = { someValueForPage: true };
  stHomePg.generalInfo = {
    title: "درباره ما",
    description: "some desc for owner only",
    status: Status.DRAFT,
  };

  // ABOUT PAGE COLUMNS
  const stHomePgLeftCol = new PageColumn();
  stHomePgLeftCol.id = "2";
  stHomePgLeftCol.sizeConfig = { width: "30%" };
  stHomePgLeftCol.config = { customPageCol1Config: true };
  stHomePgLeftCol.location = "LEFT";

  const stHomePgCenterCol = new PageColumn();
  stHomePgCenterCol.id = "3";
  stHomePgCenterCol.sizeConfig = { width: Sizes.FULL };
  stHomePgCenterCol.config = { customPageCol2Config: false };
  stHomePgCenterCol.location = "CENTER";

  // ABOUT PAGE COLUMN1 SECTIONS
  const stHomePageCol1Sec1 = new ColumnSection();
  stHomePageCol1Sec1.id = "4";
  stHomePageCol1Sec1.section = heroSection;
  stHomePageCol1Sec1.variant = "HERO1";
  stHomePageCol1Sec1.order = 1;
  stHomePageCol1Sec1.config = {
    primaryText: "Salamat Trading Forever!",
    primaryTextStyle: { style: { color: "yellow" } },
    secondaryText: "Nice to have this!",
    secondaryTextStyle: { style: { color: "pink" } },
  };

  const stHomePageCol1Sec2 = new ColumnSection();
  stHomePageCol1Sec2.id = "5";
  stHomePageCol1Sec2.section = titleBarSection;
  stHomePageCol1Sec2.variant = "TITLE_BAR1";
  stHomePageCol1Sec2.order = 2;
  stHomePageCol1Sec2.config = {
    title: "Recent Videos",
    titleStyle: {
      fontSize: "20px",
    },
    // subTitle: "Subtitle goes here!",
  };

  // stAboutPg.columns = [stAboutPgLeftCol, stAboutPgCenterCol];
  stHomePg.columns = [stHomePgCenterCol, stHomePgLeftCol];
  stHomePgLeftCol.sections = [stHomePageCol1Sec2];
  stHomePgCenterCol.sections = [stHomePageCol1Sec2];

  return stHomePg;
};
