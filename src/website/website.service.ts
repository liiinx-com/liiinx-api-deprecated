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
import { Website, WebsitePage } from "./entities";

@Injectable()
export class WebsiteService {
  constructor(
    private readonly themesService: ThemesService,
    private readonly websitesService: WebsitesService,
    private readonly websitePagesService: WebsitePagesService,
    private readonly websiteDataService: WebsiteDataService,
    private readonly sectionFactory: WebsiteSectionFactory,
  ) {}

  async getPage(handle: string, slug: string): Promise<GetWebsitePageResponse> {
    const website = await this.websitesService.getWebsite(handle);
    if (!website) throw new HttpException("NOT_FOUND", HttpStatus.NOT_FOUND);

    const layout = await this.websitePagesService.getLayout(handle);
    const page = await this.websitePagesService.getPage(handle, slug);
    // console.log("layout", layout);
    // console.log("page", page);
    if (!page || !layout)
      throw new HttpException("NOT_FOUND", HttpStatus.NOT_FOUND);

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
    page.navbarCustomProps = common.deepMergeAll([
      this.sectionFactory.getNavbarDefaultConfig(pageTheme),
      layout.navbarCustomProps,
      page.navbarCustomProps,
    ]);

    // Set page hero section to layout
    if (page.heroCustomProps || layout.heroCustomProps) {
      page.heroCustomProps = common.deepMergeAll([
        this.sectionFactory.getHeroDefaultConfig(pageTheme),
        layout.heroCustomProps,
        page.heroCustomProps,
      ]);
    }

    page.footerCustomProps = common.deepMergeAll([
      this.sectionFactory.getFooterDefaultConfig(pageTheme),
      layout.footerCustomProps,
      page.footerCustomProps,
    ]);

    console.log("page", page);
    console.log("layout", layout);

    return mapToWebsitePageResponse(page, layout, pageTheme, sharedData);
  }

  private async getWebsitePageTheme(
    website: Website,
    page: WebsitePage,
  ): Promise<any> {
    const theme = await this.themesService.getTheme(website.themeId);
    return common.deepMergeAll([
      theme,
      website.themeOverrides,
      page.themeOverrides,
    ]);
  }

  async getWebsiteData(
    handle: string,
    parts: DataPartRequest[],
    lang: string,
  ): Promise<GetWebsiteDataResponse> {
    const website = await this.websitesService.getWebsite(handle);
    if (!website) throw new HttpException("NOT_FOUND", HttpStatus.NOT_FOUND);

    return this.websiteDataService.getWebsiteData(website, parts);
  }
}
