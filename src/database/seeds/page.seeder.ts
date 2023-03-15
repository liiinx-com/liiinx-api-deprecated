import { Page } from "../../website/entities";
import { PageTypes } from "../../website/entities/section-props";
import { Seeder } from "typeorm-extension";
import { DataSource } from "typeorm";

const elasticLayout: any = {
  type: PageTypes.LAYOUT,
  title: "Simple Responsive Layout",
  description: "Amazing simple responsive layout",
  editable: true,
  frontendVariantKey: "ELASTIC_LAYOUT1",
  status: "ACTIVE",
  metaTags: [],
  navbarVariant: "NAVBAR1",
  footerVariant: "FOOTER1",
};

const defHome1Page: any = {
  type: PageTypes.HOME,
  title: "Simple Home Page",
  description: "Amazing Home Page",
  editable: true,
  frontendVariantKey: "HOME1",
  websitePages: [],
  status: "ACTIVE",
  contentConfig: {
    leftSections: [
      {
        sectionType: "TITLE_BAR",
        sectionVariant: "TITLE_BAR1",
        sectionProps: { title: "coming from def page left" },
        order: 6,
      },
    ],

    centerSections: [
      {
        sectionType: "TITLE_BAR",
        sectionVariant: "TITLE_BAR1",
        sectionProps: { title: "coming from def pagee" },
        order: 2,
      },
    ],
  },
};
const defAbout1Page: any = {
  type: PageTypes.ABOUT,
  frontendVariantKey: "ABOUT1",
  title: "Simple About Page",
  description: "Amazing About Page",
  editable: true,
  status: "ACTIVE",
};

export default class PageSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    console.log("dataSource", dataSource);
    const repository = dataSource.getRepository(Page);
    await repository.insert([elasticLayout, defHome1Page, defAbout1Page]);
  }
}
