import { Website, WebsitePage, Page } from "../../website/entities";
import { Seeder } from "typeorm-extension";
import { DataSource } from "typeorm";
import { PageTypes } from "../../website/entities/section-props";
import { WebsiteSectionFactory } from "../../website/websitePages/website-sections.factory";

const sectionFactory = new WebsiteSectionFactory();

const salamatWebsite: any = {
  handle: "salamat-trading",
  ownerId: "mehdiSalamatId",
  pages: [],
  themeId: "theme-id-1",
  themeOverrides: { primaryTextStyle: { color: "pink" } },
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

const salamatAboutPage: any = {
  //   parentPage: defAboutPage,
  metaTags: [],
  config: {},
  themeOverrides: {},
  deletable: true,
  //   website: salamatWebsite,
  slug: "about",

  heroConfig: {
    sectionType: "HERO",
    sectionVariant: "HERO1",
    order: 1,
    sectionProps: {
      heroAttr1: "someValue",
    },
  },
  contentConfig: {
    centerSections: [
      {
        sectionType: "TITLE_BAR",
        sectionVariant: "TITLE_BAR1",
        sectionProps: { title: "from salamat about page" },
        order: 1,
      },
    ],
  },
};

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

    await websiteRepository.insert([salamatWebsite]);

    const salamatLayoutPage = getPage({
      website: salamatWebsite,
      parentPage: elasticLayout,
      navbarConfig: sectionFactory.getNavbarDefaultConfig({ rtl: true }),
    });
    const salamatHomePage = getPage({
      website: salamatWebsite,
      parentPage: defHome1Page,
      slug: "home",
    });

    const aboutHeroConfig = sectionFactory.getHeroDefaultConfig({
      primaryText: "About Hero Text is from obj",
      secondaryText: "secondary about hero text yay!",
    });

    const salamatAboutPage = getPage({
      website: salamatWebsite,
      parentPage: defAbout1Page,
      slug: "about",
      heroConfig: aboutHeroConfig,
    });
    await websitePageRepository.insert([
      // salamatLayoutPage,
      // salamatHomePage,
      // salamatAboutPage,
    ]);
  }
}
