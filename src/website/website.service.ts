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

@Injectable()
export class WebsiteService {
  constructor(
    private readonly themesService: ThemesService,
    private readonly websitesService: WebsitesService,
    private readonly websitePagesService: WebsitePagesService,
    private readonly websiteDataService: WebsiteDataService,
  ) {}

  async getPage(handle: string, slug: string): Promise<GetWebsitePageResponse> {
    const website = await this.websitesService.getWebsite(handle);
    if (!website) throw new HttpException("NOT FOUND", HttpStatus.NOT_FOUND);

    const layout = await this.websitePagesService.getLayout(handle);
    const page = await this.websitePagesService.getPage(handle, slug);
    if (!page || !layout)
      throw new HttpException("NOT FOUND", HttpStatus.NOT_FOUND);

    // Inject frontend shared data
    const sharedData = await this.websiteDataService.getWebsiteSharedData(
      website,
    );

    // Theme
    const theme = await this.getWebsiteTheme(handle);
    let removeMe = {
      // globals: {
      //   primaryColor: "#673AB7",
      //   primaryTextColor: "#673AB7",
      //   textColor: "#1f1f1f",
      //   secondaryColor: "#1565C0",
      //   secondaryTextColor: "#424242",
      // },
    };
    console.log("website.themeOverrides", website.themeOverrides);
    // ! TODO: deep merge other instances as well.
    // const updatedTheme = { ...theme, ...website.themeOverrides, ...removeMe };
    const updatedTheme = theme;

    // MetaTags
    if (layout.metaTags.length) {
      page.metaTags = [...layout.metaTags, ...page.metaTags];
    }

    // Set page hero section to layout
    if (page.heroConfig) {
      layout.heroConfig = page.heroConfig;
      page.heroConfig = null;
    }

    return mapToWebsitePageResponse(page, layout, updatedTheme, sharedData);
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
    parts: DataPartRequest[],
    lang: string,
  ): Promise<GetWebsiteDataResponse> {
    const website = await this.websitesService.getWebsite(handle);
    if (!website) throw new HttpException("NOT FOUND", HttpStatus.NOT_FOUND);

    return this.websiteDataService.getWebsiteData(website, parts);
  }
}
