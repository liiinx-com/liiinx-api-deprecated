import { Controller, Get, Param, Query, Header } from "@nestjs/common";
import { HeadMetaData2, PageData } from "./types";
import { salamatWebsite } from "./salamat";
import { testData } from "./entities";
import { WebsiteService } from "./website.service";

@Controller("website")
export class WebsiteController {
  constructor(private readonly pageService: WebsiteService) {}

  @Get(":handle/head")
  async getHeadParams(
    @Param("handle") handle: string,
    @Query("lang") lang = "EN",
    @Query("page") page = "HOME",
  ): Promise<HeadMetaData2[]> {
    console.log("head------", handle, page, lang);
    console.log("testData :>> ", JSON.stringify(testData(), null, 2));

    const data: HeadMetaData2 =
      page.toUpperCase() === "HOME"
        ? {
            tagName: "meta",
            attributes: {
              name: "description",
              content: "data for home",
            },
          }
        : {
            tagName: "meta",
            attributes: {
              name: "title",
              content: "data for about",
            },
          };

    return [data];
  }

  @Get(":handle/layout")
  async getLayout(
    @Param("handle") handle: string,
    @Query("lang") lang = "EN",
  ): Promise<any> {
    // console.log("layout------", handle, lang);
    return salamatWebsite;
  }

  @Get(":handle/:pageName/styles.css")
  @Header("content-type", "text/css")
  @Header("Cross-Origin-Resource-Policy", "cross-origin")
  //   @Header("Content-Disposition", "attachment; filename=styles.css")
  getStyles(
    @Param("handle") handle: string,
    @Param("pageName") pageName: string,
  ) {
    console.log("dddd", handle, pageName);
    // TODO: if page or handle not found

    return "";
  }

  @Get(":handle/pages/:pageName")
  async getPage(
    @Param("handle") handle: string,
    @Param("pageName") pageName: string,
    @Query("lang") lang = "EN",
  ): Promise<any> {
    console.log("page------", handle, lang, pageName);

    return this.pageService.getPage(handle, pageName);
  }
}
