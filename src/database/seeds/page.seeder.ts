import { Page, PageTypes } from "../../website/entities";

import { Seeder } from "typeorm-extension";
import { DataSource } from "typeorm";

export default class PageSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(Page);
    await repository.insert([
      {
        type: PageTypes.HOME,
        title: "Simple Home Page",
        description: "Amazing Home Page",
        //metaTags: [],

        editable: true,
        frontendVariantKey: "HOME1",
        websitePages: [],

        structure: {
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
        },
      },
    ]);
  }
}
