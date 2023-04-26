import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import {
  DataPartRequest,
  GetWebsiteDataResponse,
  GetWebsitePageResponse,
} from "./dto";
import { ThemesService } from "./themes";
import { WebsitesService } from "./websites";
import { WebsitePagesService } from "./websitePages";
import { mapToWebsitePageResponse } from "./website.mapper";
import { WebsiteDataService } from "./websiteData";
import { common } from "src/utils";
import { WebsiteSectionFactory } from "./websitePages/website-sections.factory";
import {
  AddWebsitePageParams,
  AddWebsiteParams,
  WebsiteFactory,
} from "./websitePages/website-page.factory";
import { Website, WebsitePage } from "./entities";
import { PagesService } from "./pages";
import { PageTypes } from "./entities/section-props";
import { STATUS_LIST } from "./contants";

@Injectable()
export class WebsiteService {
  constructor(
    private readonly themesService: ThemesService,
    private readonly websitesService: WebsitesService,
    private readonly websitePagesService: WebsitePagesService,
    private readonly websiteDataService: WebsiteDataService,
    private readonly sectionFactory: WebsiteSectionFactory,
    private readonly websiteFactory: WebsiteFactory,
    private readonly pagesService: PagesService,
  ) {}

  async getPage(handle: string, slug: string): Promise<GetWebsitePageResponse> {
    const { website, layout, page } = await this.getWebsiteAndLayoutAndPage(
      handle,
      slug,
    );

    // Load frontend shared data
    const sharedData = await this.websiteDataService.getWebsiteSharedData(
      website,
    );

    // Generate website theme
    const pageTheme = await this.getWebsitePageTheme(website, page);

    // MetaTags
    if (layout.metaTags.length) {
      page.metaTags = [...layout.metaTags, ...page.metaTags];
    }

    console.log("page", page);
    console.log("layout", layout);

    // Set page navbar section to layout

    const navbarProps = common.deepMergeAll([
      layout.navbarCustomProps,
      page.navbarCustomProps,
    ]);
    page.navbarCustomProps = this.sectionFactory.getNavbarDefaultConfig(
      pageTheme,
      navbarProps,
    );

    // Set page hero section to layout
    if (page.heroCustomProps || layout.heroCustomProps) {
      const mergedProps = common.deepMergeAll([
        layout.heroCustomProps,
        page.heroCustomProps,
      ]);

      page.heroCustomProps = await this.sectionFactory.getHeroDefaultConfig(
        pageTheme,
        page.parentPage.type,
        page.parentPage.frontendVariantKey,
        mergedProps,
      );
    }

    const footerProps = common.deepMergeAll([
      layout.footerCustomProps,
      page.footerCustomProps,
    ]);
    page.footerCustomProps = this.sectionFactory.getFooterDefaultConfig(
      pageTheme,
      footerProps,
    );

    console.log("page", page);
    console.log("layout", layout);

    return mapToWebsitePageResponse(page, layout, pageTheme, sharedData);
  }

  private async getWebsitePageTheme(
    website: Website,
    page?: WebsitePage,
  ): Promise<any> {
    const theme = await this.themesService.getTheme(website.themeId);
    return common.deepMergeAll([
      theme,
      website.themeOverrides,
      page ? page.themeOverrides : {},
    ]);
  }

  async getWebsiteData(
    handle: string,
    parts: DataPartRequest[],
    lang: string,
  ): Promise<GetWebsiteDataResponse> {
    const website = await this.websitesService.getWebsite(handle);
    if (!website)
      throw new HttpException("WEBSITE_NOT_FOUND", HttpStatus.NOT_FOUND);

    return this.websiteDataService.getWebsiteData(website, parts);
  }

  async newWebsite({ handle }) {
    const parentLayoutPage = await this.pagesService.getBy(
      PageTypes.LAYOUT,
      "ELASTIC_LAYOUT1",
    ); // TODO: make dynamic

    // TODO: Check for existing handle
    const defaultTheme = await this.themesService.getDefaultTheme();

    const factoryParams: AddWebsiteParams = {
      ownerId: "mehdiSalamatId",
      handle,
      themeId: defaultTheme.id,
    };
    const savedWebsite = await this.websitesService.newWebsite(
      await this.websiteFactory.newWebsite(factoryParams),
    );

    const websiteLayout = await this.websitePagesService.newWebsitePage({
      parentPage: parentLayoutPage,
      status: STATUS_LIST.ACTIVE,
      website: savedWebsite,
    });
    console.log("websiteLayout", websiteLayout);

    return savedWebsite;
  }

  private async getWebsiteAndLayoutAndPage(
    handle: string,
    slug: string,
  ): Promise<{ website: Website; layout: WebsitePage; page: WebsitePage }> {
    const website = await this.websitesService.getWebsite(handle);
    if (!website)
      throw new HttpException("WEBSITE_NOT_FOUND", HttpStatus.NOT_FOUND);

    const layout = await this.websitePagesService.getLayout(handle);
    const page = await this.websitePagesService.getPage(handle, slug);
    // console.log("layout", layout);
    // console.log("page", page);
    if (!page || !layout)
      throw new HttpException("PAGE_NOT_FOUND", HttpStatus.NOT_FOUND);

    return { website, layout, page };
  }

  async getWebsiteCssContent(handle: string, slug: string): Promise<string> {
    const { website, page } = await this.getWebsiteAndLayoutAndPage(
      handle,
      slug,
    );

    const {
      globals: {
        primaryColor,
        primaryTextColor,
        textColor,
        secondaryColor,
        secondaryTextColor,
      },
    } = await this.getWebsitePageTheme(website, page);

    return `
      :root {
        --primary-color: ${primaryColor};
        --secondary-color: ${secondaryColor};
        --text-color: ${textColor};
        --text-font-family: sans-serif;
        --text-font-size: ${"16px"};
      }
      `;
  }

  async newPage({
    handle,
    pageType,
    pageVariant,
    slug,
    pageTitle,
    isHeroPageTitle,
  }) {
    const website = await this.websitesService.getWebsite(handle);
    if (!website)
      throw new HttpException("WEBSITE_NOT_FOUND", HttpStatus.NOT_FOUND);

    const parentPage = await this.pagesService.getBy(pageType, pageVariant);
    if (!parentPage)
      throw new HttpException("PARENT_PAGE_NOT_FOUND", HttpStatus.NOT_FOUND);

    const theme = await this.getWebsitePageTheme(website);
    const factoryParams: AddWebsitePageParams = {
      website,
      theme,
      parentPage,
      slug,
      pageTitle: {
        text: pageTitle,
        asHeroProps: isHeroPageTitle,
      },
    };

    return await this.websitePagesService.newWebsitePage(
      await this.websiteFactory.newWebsitePage(factoryParams),
    );
  }

  // async testDynamicPage(handle: string) {
  //   const website = await this.websitesService.getWebsite(handle);
  //   const layout = await this.websitePagesService.getLayout(handle);
  //   const sharedData = await this.websiteDataService.getWebsiteSharedData(
  //     website,
  //   );
  //   const theme = await this.themesService.getDefaultTheme();
  //   const parentPage = await this.pagesService.getBy(PageTypes.ABOUT, "ABOUT1");
  //   console.log("parentPage", parentPage);
  //   const pageParams: GenerateWebsitePageTypeParams = {
  //     id: "terms",
  //     slug: "terms",
  //     website,
  //     parentPage,
  //   };
  //   const page = await this.pagesFactory.generateWebsitePage(
  //     theme,
  //     PageTypes.ABOUT,
  //     pageParams,
  //   );

  //   return mapToWebsitePageResponse(page, layout, theme, sharedData);
  // }
}
