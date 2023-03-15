import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Header,
  HttpCode,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { common } from "src/utils";
import { GetWebsiteDataRequest } from "./dto";
import { WebsiteService } from "./website.service";
import { WebsiteDataService } from "./websiteData";

@Controller("website")
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

  // @Get(":handle/:pageName/styles.css")
  // @Header("content-type", "text/css")
  // @Header("Cross-Origin-Resource-Policy", "cross-origin")
  // getStyles(
  //   @Param("handle") handle: string,
  //   @Param("pageName") pageName: string,
  // ) {
  //   // TODO: if page or handle not found
  //   return "h1 {color: lime}";
  // }

  @Get(":handle/pages/:slug")
  async getPage(
    @Param("handle") handle: string,
    @Param("slug") slug: string,
    @Query("lang") lang = "EN",
  ) {
    return this.websiteService.getPage(handle, slug);
  }
}
