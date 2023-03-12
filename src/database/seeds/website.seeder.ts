import { Website, WebsitePage, Page } from "../../website/entities";
import { Seeder } from "typeorm-extension";
import { DataSource } from "typeorm";
import {
  HeroSectionInfo,
  NavbarSectionInfo,
  PageTypes,
} from "../../website/entities/section.types";

const navbarConfig = new NavbarSectionInfo();
navbarConfig.sectionProps = {
  rtl: true,
};

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
  heroConfig,
}) => ({
  parentPage,
  metaTags: [],
  config: {},
  deletable: false,
  website,
  navbarConfig,
  heroConfig,
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
    const layoutNavbarConfig = new NavbarSectionInfo();
    layoutNavbarConfig.sectionProps = {
      rtl: true,
    };

    const salamatLayoutPage = getPage({
      website: salamatWebsite,
      parentPage: elasticLayout,
      navbarConfig: layoutNavbarConfig,
    });
    const salamatHomePage = getPage({
      website: salamatWebsite,
      parentPage: defHome1Page,
      slug: "home",
    });

    const aboutHeroConfig = new HeroSectionInfo();
    aboutHeroConfig.sectionVariant = "HERO1";
    aboutHeroConfig.enabled = false;
    aboutHeroConfig.sectionProps = {
      primaryText: "About Hero Text is from obj",
      secondaryText: "secondary about hero text yay!",
    };

    const salamatAboutPage = getPage({
      website: salamatWebsite,
      parentPage: defAbout1Page,
      slug: "about",
      heroConfig: aboutHeroConfig,
    });
    await websitePageRepository.insert([
      salamatLayoutPage,
      // salamatHomePage,
      salamatAboutPage,
    ]);
  }
}

// const salamatLayout: WebsitePage = {
//   id: "website-page-id-1",
//   createdAt: new Date(),
//   updatedAt: new Date(),
//   website: salamatWebsite,
//   deletable: false,

//   parentPage: elasticLayout,
//   themeOverrides: {},
//   structureOverrides: {
//     navbarConfig: {
//       sectionType: "NAVBAR",
//       sectionVariant: "NAVBAR1",
//       sectionProps: {
//         rtl: false,
//       },
//     },
//   },

//   config: {},
//   metaTags: [],
// };
