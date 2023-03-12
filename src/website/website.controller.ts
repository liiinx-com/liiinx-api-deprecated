import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Header,
  HttpCode,
} from "@nestjs/common";

import { GetWebsiteDataRequest } from "./dto";
import { WebsiteService } from "./website.service";

@Controller("website")
export class WebsiteController {
  constructor(private readonly websiteService: WebsiteService) {}

  @Post(":handle/data")
  @HttpCode(200)
  async getData(
    @Param("handle") handle: string,
    @Query("lang") lang = "EN",
    @Body() pageDataReq: GetWebsiteDataRequest,
  ) {
    console.log("pageDataReq.", pageDataReq.parts);
    return this.websiteService.getWebsiteData(handle, pageDataReq.parts);
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
