import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Header,
} from "@nestjs/common";
import { HeadMetaData2, PageData } from "./types";
import { salamatWebsite } from "./salamat";
import { WebsiteService } from "./website.service";
import { WebsiteDataPartsFilter } from "./dto";

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

  @Get(":handle/theme")
  async getTheme(@Param("handle") handle: string): Promise<any> {
    return this.pageService.getWebsiteTheme(handle);
  }

  @Get(":handle/layout-v0")
  async getLayout(
    @Param("handle") handle: string,
    @Query("lang") lang = "EN",
  ): Promise<any> {
    // console.log("layout------", handle, lang);
    return salamatWebsite;
  }

  @Post(":handle/data")
  async getData(
    @Param("handle") handle: string,
    @Query("lang") lang = "EN",
    @Body() partsFilters: WebsiteDataPartsFilter,
  ): Promise<any> {
    const result = {
      profile: {},
    };

    console.log("lang", lang, handle);

    const requestedPartsKeys = partsFilters.parts.map((p) => p.part);

    if (requestedPartsKeys.includes("profile")) {
      result.profile = {
        lang: "en",
        dir: "ltr",
        title: "Salamat Trading",
        logoUrl: "https://www.youtube.com/channel/UCfYnf9Lo9TAsdvpw1F9dCuQ",
        shortDescription:
          "من مهدی سلامت هستم، معامله گر بازار های مالی به خصوص ارزهای دیجیتال، علاقه مند به بلاکچین و سیستم های غیرمتمرکز واقعی و یکی از آرزوهام اینه که روزی سیستم مالی سنتی کاملا تغییر کنه و یک سیستم  غیرمتمرکز واقعی جای اون رو بگیره.    من تو این کانال، آخرین اخبار ارزهای دیجیتال به صورت روزانه، آموزش های مربوط به معامله ی این ارزها، بررسی شرایط بازار کریپتو، معرفی استراتژی های معاملاتی و اسکلپ، و کلا هر چیزی که بتونیم تو این بازار برای کسب سود ازش استفاده کنیم رو در اختیارتون قرار میدم.    تو این کانال هیچ سیگنالی برای خرید و فروش نمیدیم و توصیه میکنم شما هم به دنبال سیگنال نباشید.",
      };
    }

    return result;
  }

  @Get(":handle/layout")
  async getLayoutConfig(
    @Param("handle") handle: string,
    @Query("lang") lang = "EN",
  ): Promise<any> {
    // console.log("layout------", handle, lang);
    return this.pageService.getLayoutConfig(handle, lang);
  }

  @Get(":handle/:pageName/styles.css")
  @Header("content-type", "text/css")
  @Header("Cross-Origin-Resource-Policy", "cross-origin")
  //   @Header("Content-Disposition", "attachment; filename=styles.css")
  getStyles(
    @Param("handle") handle: string,
    @Param("pageName") pageName: string,
  ) {
    // TODO: if page or handle not found

    return "h1 {color: lime}";
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
