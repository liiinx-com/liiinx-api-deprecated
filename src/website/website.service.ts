import { Injectable } from "@nestjs/common";
import { BoxSize } from "./types";
import {
  Page,
  PageTypes,
  Theme,
  Website,
  WebsitePage,
} from "./entities/structure.entity";
import { User, UserRole, UserStatus } from "src/user/entities/user.entity";
import {
  GetWebsiteLayoutResponse,
  GetWebsitePageResponse,
  GetWebsiteThemeResponse,
} from "./dto";

const theme1: Theme = {
  createdAt: new Date(),
  updatedAt: new Date(),
  id: "theme-id-1",
  title: "Elegant Light Theme",
  description: "some desc",
  status: "ACTIVE",
  config: {
    bodyStyle: {
      style: { backgroundColor: "#fff" },
    },
    primaryTextStyle: { color: "#eee" },
    paragraphStyle: { color: "#eee" },
    headerBoxSize: BoxSize.CONTAINER,
    headerWrapperStyle: {},

    heroBoxSize: BoxSize.FULL,

    mainBoxSize: BoxSize.CONTAINER,
    mainWrapperStyle: {
      style: { backgroundColor: "#F3F2F8" },
    },

    navbarStyle: {
      style: {
        backgroundColor: "#fff",
      },
    },

    navbarLinkStyle: {
      style: {
        color: "#283593",
        //"&:hover": { color: "blue" }, // ! TODO: NOT WORKING
      },
    },
  },
};

const mehdiSalamat: User = {
  createdAt: new Date(),
  updatedAt: new Date(),
  id: "user-1",
  email: "mahdi.salamat@gmail.com",
  firstName: "Mahdi",
  lastName: "Salamat",
  roles: [UserRole.USER],
  metadata: {},
  status: UserStatus.ACTIVE,
  timezone: "EST",
};

const salamatWebsite: Website = {
  id: "website-id-1",
  createdAt: new Date(),
  updatedAt: new Date(),
  handle: "salamat-trading",
  ownerId: "mehdiSalamat",
  pages: [],
  themeId: "theme-id-1",
  themeOverrides: { primaryTextStyle: { color: "pink" } },
};

const defHomePage: Page = {
  createdAt: new Date(),
  updatedAt: new Date(),
  id: "page-id-2",
  type: PageTypes.HOME,
  title: "Simple Home Page",
  description: "Amazing Home Page",
  metaTags: [],

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
};

const defAboutPage: Page = {
  createdAt: new Date(),
  updatedAt: new Date(),
  id: "page-id-31",
  type: PageTypes.ABOUT,
  frontendVariantKey: "ABOUT1",
  title: "Simple About Page",
  description: "Amazing About Page",
  metaTags: [],
  editable: true,
  structure: {},
  websitePages: [],
};

const salamatHomePage: WebsitePage = {
  createdAt: new Date(),
  updatedAt: new Date(),
  id: "page-id-4",
  parentPage: defHomePage,
  metaTags: [],
  config: {},
  themeOverrides: {},
  deletable: false,
  website: salamatWebsite,
  slug: "khaneh",
  structureOverrides: {
    contentConfig: {
      centerSections: [
        {
          sectionType: "TITLE_BAR",
          sectionVariant: "TITLE_BAR1",
          sectionProps: { title: "from salamat home page" },
          order: 1,
        },
      ],
    },
  },
};

const salamatAboutPage: WebsitePage = {
  createdAt: new Date(),
  updatedAt: new Date(),
  id: "page-id-41",
  parentPage: defAboutPage,
  metaTags: [],
  config: {},
  themeOverrides: {},
  deletable: true,
  website: salamatWebsite,
  slug: "about",
  structureOverrides: {
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
  },
};

const elasticLayout: Page = {
  createdAt: new Date(),
  updatedAt: new Date(),
  id: "page-id-1",
  type: PageTypes.LAYOUT,
  title: "Simple Responsive Layout",
  description: "Amazing simple responsive layout",
  editable: true,
  frontendVariantKey: "ELASTIC_LAYOUT1",
  websitePages: [],
  structure: {
    navbarConfig: {
      sectionType: "NAVBAR",
      sectionVariant: "NAVBAR1",
    },
    footerConfig: {
      sectionType: "FOOTER",
      sectionVariant: "FOOTER1",
    },
  },
  metaTags: [],
};

const salamatLayout: WebsitePage = {
  id: "website-page-id-1",
  createdAt: new Date(),
  updatedAt: new Date(),
  website: salamatWebsite,
  deletable: false,

  parentPage: elasticLayout,
  themeOverrides: {},
  structureOverrides: {
    navbarConfig: {
      sectionType: "NAVBAR",
      sectionVariant: "NAVBAR1",
      sectionProps: {
        rtl: false,
      },
    },
  },

  config: {},
  metaTags: [],
};

@Injectable()
export class WebsiteService {
  async getWebsite(handle: string) {
    return salamatWebsite;
  }

  async getPage(handle: string, name: string): Promise<GetWebsitePageResponse> {
    const webPage: WebsitePage =
      name === "home" ? salamatHomePage : salamatAboutPage;
    const {
      config,
      structureOverrides,
      metaTags,
      themeOverrides,
      parentPage,
      slug,
    } = webPage;
    let leftSections = [];
    let centerSections = [];
    let rightSections = [];

    const result: GetWebsitePageResponse = {
      slug,
      config,
      metaTags,
      type: webPage.parentPage.type,
      variant: webPage.parentPage.frontendVariantKey,

      structure: {
        content: {
          leftSections: null,
          centerSections: null,
          rightSections: null,
        },
      },
    };

    // hero
    if (
      parentPage.structure.heroConfig ||
      webPage.structureOverrides.heroConfig
    ) {
      result.structure.hero = {
        ...parentPage.structure.heroConfig,
        ...webPage.structureOverrides.heroConfig,
      };
    }

    // content left sections
    if (parentPage.structure?.contentConfig?.leftSections)
      leftSections = [
        ...leftSections,
        ...parentPage.structure.contentConfig.leftSections,
      ];
    if (structureOverrides?.contentConfig?.leftSections)
      leftSections = [
        ...leftSections,
        ...structureOverrides.contentConfig.leftSections,
      ];
    if (leftSections.length > 0) {
      result.structure.content.leftSections = leftSections;
    }

    // content center sections
    if (parentPage.structure?.contentConfig?.centerSections)
      centerSections = [
        ...centerSections,
        ...parentPage.structure.contentConfig.centerSections,
      ];

    if (structureOverrides?.contentConfig?.centerSections)
      centerSections = [
        ...centerSections,
        ...structureOverrides.contentConfig.centerSections,
      ];

    if (centerSections.length > 0) {
      result.structure.content.centerSections = centerSections;
    }

    // content right sections
    if (parentPage.structure?.contentConfig?.rightSections)
      rightSections = [
        ...rightSections,
        ...parentPage.structure.contentConfig.rightSections,
      ];
    if (structureOverrides?.contentConfig?.rightSections)
      rightSections = [
        ...rightSections,
        ...structureOverrides.contentConfig.rightSections,
      ];
    if (rightSections.length > 0) {
      result.structure.content.rightSections = rightSections;
    }

    return result;
  }

  async getTheme(themeId: string) {
    return theme1;
  }

  async getWebsiteTheme(handle: string): Promise<GetWebsiteThemeResponse> {
    const website = await this.getWebsite(handle);
    const theme = await this.getTheme(website.themeId);
    return {
      ...theme.config,
      ...website.themeOverrides,
    } as GetWebsiteThemeResponse;
  }

  async getLayoutConfig(
    handle: string,
    lang: string,
  ): Promise<GetWebsiteLayoutResponse> {
    const parentLayout = salamatLayout.parentPage;
    const websiteLayout = salamatLayout;

    const result: GetWebsiteLayoutResponse = {
      type: parentLayout.type,
      variant: parentLayout.frontendVariantKey,
      structure: {},
    };

    // navbar
    if (
      parentLayout.structure.navbarConfig ||
      websiteLayout.structureOverrides.navbarConfig
    ) {
      result.structure.navbar = {
        ...parentLayout.structure.navbarConfig,
        ...websiteLayout.structureOverrides.navbarConfig,
      };
    }

    // hero
    if (
      parentLayout.structure.heroConfig ||
      websiteLayout.structureOverrides.heroConfig
    ) {
      result.structure.hero = {
        ...parentLayout.structure.heroConfig,
        ...websiteLayout.structureOverrides.heroConfig,
      };
    }

    // content
    if (
      parentLayout.structure.contentConfig ||
      websiteLayout.structureOverrides.contentConfig
    ) {
      result.structure.content = {
        ...parentLayout.structure.contentConfig,
        ...websiteLayout.structureOverrides.contentConfig,
      };
    }

    // footer
    if (
      parentLayout.structure.footerConfig ||
      websiteLayout.structureOverrides.footerConfig
    ) {
      result.structure.footer = {
        ...parentLayout.structure.footerConfig,
        ...websiteLayout.structureOverrides.footerConfig,
      };
    }

    return result;
  }
}
