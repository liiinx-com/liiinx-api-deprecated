import { Injectable } from "@nestjs/common";
import { BoxSize } from "./types";
import {
  Page,
  PageTypes,
  Theme,
  Website,
  WebsitePage,
} from "./entities/structure.entity";
import { lodash } from "../utils";
import { User, UserRole, UserStatus } from "src/user/entities/user.entity";
import { WebsiteLayoutResponse } from "./dto";

const theme1: Theme = {
  created_at: new Date(),
  updated_at: new Date(),
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
  created_at: new Date(),
  updated_at: new Date(),
  id: "user-1",
  email: "mahdi.salamat@gmail.com",
  firstName: "Mahdi",
  lastName: "Salamat",
  roles: [UserRole.USER],
  metadata: {},
  status: UserStatus.ACTIVE,
  timezone: "EST",
  websites: [],
};

const elasticLayout: Page = {
  created_at: new Date(),
  updated_at: new Date(),
  id: "layout-id-1",
  type: PageTypes.LAYOUT,
  title: "Simple Responsive Layout",
  description: "Amazing simple responsive layout",
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
  websitePages: [],
  frontendModuleKey: "ElasticLayout",
};

const salamatWebsite: Website = {
  id: "website-id-1",
  created_at: new Date(),
  updated_at: new Date(),
  handle: "salamat-trading",
  owner: mehdiSalamat,
  pages: [],
  themeId: "theme-id-1",
  themeOverrides: { primaryTextStyle: { color: "pink" } },
};

const salamatLayout: WebsitePage = {
  id: "website-page-id-1",
  created_at: new Date(),
  updated_at: new Date(),
  website: salamatWebsite,
  page: elasticLayout,
  deletable: false,
  editable: true,
  themeOverrides: {},
  structureOverrides: {
    navbarConfig: {
      sectionType: "NAVBAR",
      sectionVariant: "NAVBAR1",
      sectionProps: {
        rtl: true,
      },
    },
  },

  config: {},
  metaTags: {},
};

@Injectable()
export class WebsiteService {
  async getWebsite(handle: string) {
    return salamatWebsite;
  }

  async getPage(handle: string, name: string) {
    return {};
  }

  async getTheme(themeId: string) {
    return theme1;
  }

  async getWebsiteTheme(handle: string) {
    const website = await this.getWebsite(handle);
    const theme = await this.getTheme(website.themeId);
    return {
      ...theme.config,
      ...website.themeOverrides,
    };
  }

  async getLayoutConfig(
    handle: string,
    lang: string,
  ): Promise<WebsiteLayoutResponse> {
    const parentLayout = salamatLayout.page;
    const websiteLayout = salamatLayout;

    const result: WebsiteLayoutResponse = {};

    // navbar
    if (
      parentLayout.structure.navbarConfig ||
      websiteLayout.structureOverrides.navbarConfig
    ) {
      result.navbar = {
        ...parentLayout.structure.navbarConfig,
        ...websiteLayout.structureOverrides.navbarConfig,
      };
    }

    // hero
    if (
      parentLayout.structure.heroConfig ||
      websiteLayout.structureOverrides.heroConfig
    ) {
      result.hero = {
        ...parentLayout.structure.heroConfig,
        ...websiteLayout.structureOverrides.heroConfig,
      };
    }

    // content
    if (
      parentLayout.structure.contentConfig ||
      websiteLayout.structureOverrides.contentConfig
    ) {
      result.content = {
        ...parentLayout.structure.contentConfig,
        ...websiteLayout.structureOverrides.contentConfig,
      };
    }

    // footer
    if (
      parentLayout.structure.footerConfig ||
      websiteLayout.structureOverrides.footerConfig
    ) {
      result.footer = {
        ...parentLayout.structure.footerConfig,
        ...websiteLayout.structureOverrides.footerConfig,
      };
    }

    return result;
  }
}
