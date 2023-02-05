import { Controller, Get, Param, Query, Header } from "@nestjs/common";
import { HeadMetaData, PageData } from "./types";
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
  ): Promise<HeadMetaData[]> {
    console.log("head------", handle, page, lang);
    console.log("testData :>> ", JSON.stringify(testData(), null, 2));

    const data: HeadMetaData =
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
    console.log("layout------", handle, lang);
    return salamatWebsite;
  }

  @Get(":handle/styles.css")
  @Header("content-type", "text/css")
  //   @Header("Content-Disposition", "attachment; filename=styles.css")
  async getStyles(@Param("handle") handle: string): Promise<string> {
    console.log("dddd", handle);
    return ".testika {background-color:#4DD0E1;color:red;}";
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
