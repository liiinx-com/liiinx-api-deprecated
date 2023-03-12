import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import {
  GetWebsiteDataResponse,
  GetWebsitePageResponse,
  GetWebsiteThemeResponse,
} from "./dto";
import { ThemesService } from "./themes";
import { WebsitesService } from "./websites";
import { WebsitePagesService } from "./websitePages";
import { mapToWebsitePageResponse } from "./website.mapper";
import { WebsiteDataService } from "./websiteData";

@Injectable()
export class WebsiteService {
  VALID_DATA_PARTS = ["SOCIAL_LINKS", "PROFILE", "ABOUT"];

  constructor(
    private readonly themesService: ThemesService,
    private readonly websitesService: WebsitesService,
    private readonly websitePagesService: WebsitePagesService,
    private readonly websiteDataService: WebsiteDataService,
  ) {}

  async getPage(handle: string, slug: string): Promise<GetWebsitePageResponse> {
    const layout = await this.websitePagesService.getLayout(handle);
    const page = await this.websitePagesService.getPage(handle, slug);
    if (!page || !layout)
      throw new HttpException("NOT FOUND", HttpStatus.NOT_FOUND);

    const theme = await this.getWebsiteTheme(handle);
    // metaTags
    if (layout.metaTags.length) {
      page.metaTags = [...layout.metaTags, ...page.metaTags];
    }

    // Set page hero section to layout
    if (page.heroConfig) {
      layout.heroConfig = page.heroConfig;
      page.heroConfig = null;
    }

    return mapToWebsitePageResponse(page, layout, theme);
  }

  private async getWebsiteTheme(handle: string): Promise<any> {
    const website = await this.websitesService.getWebsite(handle);
    if (!website) throw new HttpException("NOT FOUND", HttpStatus.NOT_FOUND);

    const theme = await this.themesService.getTheme(website.themeId);
    return {
      ...theme.config,
      ...website.themeOverrides,
    };
  }

  async getWebsiteData(
    handle: string,
    parts: any,
  ): Promise<GetWebsiteDataResponse> {
    return this.websiteDataService.getWebsiteData(handle, parts);
  }
}
