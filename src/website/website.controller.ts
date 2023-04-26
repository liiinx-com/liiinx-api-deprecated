import {
  Controller,
  Get,
  Header,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { common } from "src/utils";
import {
  GetWebsiteDataRequest,
  PostWebsitePageRequest,
  PostWebsiteRequest,
} from "./dto";
import { WebsiteService } from "./website.service";
import { WebsiteDataService } from "./websiteData";

@Controller("websites")
export class WebsiteController {
  constructor(
    private readonly websiteService: WebsiteService,
    private readonly websiteDataService: WebsiteDataService,
  ) {}

  @Post(":handle/data")
  @HttpCode(200)
  async getData(
    @Param("handle") handle: string,
    @Query("lang") lang = "EN",
    @Body() pageDataReq: GetWebsiteDataRequest,
  ) {
    const requestedDataPartNames = pageDataReq.parts.map(({ part }) => part);
    if (
      !common.isSubsetOf(
        await this.websiteDataService.getAvailableDataParts(),
        requestedDataPartNames,
      )
    )
      throw new HttpException("INVALID_DATA_PARTS", HttpStatus.BAD_REQUEST);

    return this.websiteService.getWebsiteData(handle, pageDataReq.parts, lang);
  }

  @Get(":handle/:slug/styles.css")
  @Header("content-type", "text/css")
  @Header("Cross-Origin-Resource-Policy", "cross-origin")
  getStyles(@Param("handle") handle: string, @Param("slug") slug: string) {
    console.log("handle", handle);
    console.log("pageName", slug);

    return this.websiteService.getWebsiteCssContent(handle, slug);
  }

  @Get(":handle/pages/:slug")
  async getPage(
    @Param("handle") handle: string,
    @Param("slug") slug: string,
    @Query("lang") lang = "EN",
  ) {
    return this.websiteService.getPage(handle, slug);
  }

  @Post()
  @HttpCode(201)
  async newWebsite(@Body() { handle }: PostWebsiteRequest) {
    return this.websiteService.newWebsite({ handle });
  }

  @Post(":handle/pages")
  @HttpCode(201)
  async newPage(
    @Param("handle") handle: string,
    @Body() { pageTitle, pageType, pageVariant, slug }: PostWebsitePageRequest,
  ) {
    console.log("pageTitle", pageTitle);
    const params = {
      handle,
      pageType,
      pageVariant,
      slug,
      pageTitle: pageTitle.text,
      isHeroPageTitle: pageTitle.showAsHero, // {text, showAsHero}
    };
    // ! TODO:  Validate params
    return this.websiteService.newPage(params);
  }
}
