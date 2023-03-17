import { Website, WebsitePage, Page } from "../../website/entities";
import { Seeder } from "typeorm-extension";
import { DataSource } from "typeorm";
import { PageTypes } from "../../website/entities/section-props";

const salamatWebsite: any = {
  handle: "salamat-trading",
  ownerId: "mehdiSalamatId",
  pages: [],
  themeId: "theme-id-1",
  themeOverrides: {
    globals: {
      primaryColor: "#673AB7",
      primaryTextColor: "#673AB7",
      textColor: "#1f1f1f",
      secondaryColor: "#1565C0",
      secondaryTextColor: "#424242",
    },
  },
};

const getPage: any = ({
  slug,
  website,
  parentPage,
  contentConfig,
  navbarConfig,
  footerConfig,
  heroConfig,
}) => ({
  parentPage,
  metaTags: [],
  config: {},
  deletable: false,
  website,
  navbarConfig,
  heroConfig,
  footerConfig,
  slug,
  status: "ACTIVE",
  contentConfig,
});

export default class PageSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const pageRepository = dataSource.getRepository(Page);
    const websiteRepository = dataSource.getRepository(Website);
    const websitePageRepository = dataSource.getRepository(WebsitePage);

    const elasticLayout = await pageRepository.findOne({
      where: {
        type: PageTypes.LAYOUT,
        status: "ACTIVE",
        frontendVariantKey: "ELASTIC_LAYOUT1",
      },
    });

    const defHome1Page = await pageRepository.findOne({
      where: {
        type: PageTypes.HOME,
        status: "ACTIVE",
        frontendVariantKey: "HOME1",
      },
    });

    const defAbout1Page = await pageRepository.findOne({
      where: {
        type: PageTypes.ABOUT,
        status: "ACTIVE",
        frontendVariantKey: "ABOUT1",
      },
    });
    //----------------------------------------

    // await websiteRepository.insert([salamatWebsite]);

    const salamatLayoutPage = getPage({
      website: salamatWebsite,
      parentPage: elasticLayout,
      navbarCustomProps: { rtl: true },
    });
    const salamatHomePage = getPage({
      website: salamatWebsite,
      parentPage: defHome1Page,
      slug: "home",
    });

    const salamatAboutPage = getPage({
      website: salamatWebsite,
      parentPage: defAbout1Page,
      slug: "about",
      heroCustomProps: {
        primaryText: "About Hero Text is from obj",
        secondaryText: "secondary about hero text yay!",
      },
    });
    await websitePageRepository.insert([
      // salamatLayoutPage,
      // salamatHomePage,
      // salamatAboutPage,
    ]);
  }
}
