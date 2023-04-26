import { Injectable } from "@nestjs/common";
import {
  ContentSectionInfo,
  FooterSectionInfo,
  HeroSectionInfo,
  NavbarSectionInfo,
  Theme,
} from "../entities/section-props";
import { Page, Website, WebsitePage } from "../entities";
import { WebsiteSectionFactory } from "./website-sections.factory";

export interface AddWebsiteParams {
  themeId: string;
  handle: string;
  ownerId: string;
  themeOverrides?: Theme;
  config?: object;
  status?: string;
}

export interface AddWebsitePageParams {
  theme: Theme;
  slug: string;
  website: Website;
  parentPage: Page;
  pageTitle: {
    text: string;
    asHeroProps?: HeroSectionInfo;
  };
  status?: string;
  contentOverrides?: ContentSectionInfo;
  navbarCustomProps?: NavbarSectionInfo;
  heroCustomProps?: HeroSectionInfo;
  footerCustomProps?: FooterSectionInfo;
  themeOverrides?: Theme;
}

@Injectable()
export class WebsiteFactory {
  constructor(private readonly sectionFactoryService: WebsiteSectionFactory) {}
  async newWebsite({
    themeId,
    handle,
    ownerId,
    config,
    themeOverrides,
    status = "DRAFT",
  }: AddWebsiteParams): Promise<Partial<Website>> {
    const result: Partial<Website> = {
      handle,
      ownerId,
      status,
      themeId,
      config,
      themeOverrides,
    };
    return result;
  }

  async newWebsitePage({
    theme,
    slug,
    pageTitle = {
      text: "Untitled-Page",
    },
    website,
    parentPage,
    themeOverrides,
    heroCustomProps,
    contentOverrides,
    navbarCustomProps,
    footerCustomProps,
    status = "DRAFT",
  }: AddWebsitePageParams): Promise<Partial<WebsitePage>> {
    const result: Partial<WebsitePage> = {
      parentPage,
      metaTags: [],
      config: {
        title: pageTitle.text,
      },
      themeOverrides,
      deletable: false,
      website,
      navbarCustomProps,
      heroCustomProps,
      footerCustomProps,
      contentOverrides,
      slug,
      status,
    };

    if (pageTitle.asHeroProps) {
      result.heroCustomProps =
        this.sectionFactoryService.getPageTitleAsHeroSectionProps(
          theme,
          pageTitle.text,
        );
    }

    return result;
  }

  //   async generateWebsitePage(
  //     theme: Theme,
  //     pageType: PageTypes,
  //     {
  //       id,
  //       slug,
  //       pageTitle = "Untitled-Page",
  //       website,
  //       parentPage,
  //       heroCustomProps,
  //       contentOverrides,
  //       navbarCustomProps = this.sectionFactoryService.getNavbarDefaultConfig(
  //         theme,
  //       ),
  //       footerCustomProps = this.sectionFactoryService.getFooterDefaultConfig(
  //         theme,
  //       ),
  //     }: GenerateWebsitePageTypeParams,
  //   ): Promise<WebsitePage> {
  //     const result: WebsitePage = {
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //       id,
  //       parentPage,
  //       metaTags: [],
  //       config: {
  //         title: pageTitle,
  //       },
  //       deletable: false,
  //       website,
  //       navbarCustomProps,
  //       ...(heroCustomProps
  //         ? {
  //             heroCustomProps:
  //               this.sectionFactoryService.getHeroDefaultConfig(theme),
  //           }
  //         : {}),
  //       footerCustomProps,
  //       contentOverrides,
  //       slug,
  //       status: "ACTIVE",
  //       themeOverrides: {},
  //     };
  //     return result;
  //   }
}
