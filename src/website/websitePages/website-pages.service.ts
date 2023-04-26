import { Injectable } from "@nestjs/common";
import { WebsitePagesRepository } from "./website-pages.repository";
import { WebsitePage } from "../entities";
import { WebsiteSectionFactory } from "./website-sections.factory";

interface HeadMetaData {
  tagName: "meta";
  attributes: object;
}

class GetHeadParamsResponse {
  metaTags: HeadMetaData[];
}

@Injectable()
export class WebsitePagesService {
  constructor(private readonly wPagesRepository: WebsitePagesRepository) {}

  async getPage(handle: string, slug: string): Promise<WebsitePage> {
    return this.wPagesRepository.getPage(handle, slug);
  }

  async getLayout(handle: string): Promise<WebsitePage> {
    return this.wPagesRepository.getLayout(handle);
  }

  async newWebsitePage(params: Partial<WebsitePage>): Promise<WebsitePage> {
    return this.wPagesRepository.newPage(params);
  }

  async getPageData(handle: string, parts: any): Promise<any> {
    // mapWebsitePageToWebsitePageBaseResponse
    // const webPage: WebsitePage =
    //   name === "home" ? salamatHomePage : salamatAboutPage;

    const result: any = {};

    const requestedPartsKeys = parts.map((p: any) => p.part);
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

  // @Get(":handle/layout")
  // async getLayoutConfig(
  //   @Param("handle") handle: string,
  //   @Query("lang") lang = "EN",
  // ): Promise<any> {
  //   return this.websitesService.getLayoutConfig(handle, lang);
  // }

  // async getHeadParams(
  //   @Param("handle") handle: string,
  //   @Query("lang") lang = "EN",
  //   @Query("page") page = "HOME",
  // ): Promise<GetHeadParamsResponse> {
  //   const sampleTag: HeadMetaData =
  //     page.toUpperCase() === "HOME"
  //       ? {
  //           tagName: "meta",
  //           attributes: {
  //             name: "description",
  //             content: "data for home",
  //           },
  //         }
  //       : {
  //           tagName: "meta",
  //           attributes: {
  //             name: "title",
  //             content: "data for about",
  //           },
  //         };

  //   const result: GetHeadParamsResponse = {
  //     metaTags: [sampleTag],
  //   };
  //   return result;
  // }
}
