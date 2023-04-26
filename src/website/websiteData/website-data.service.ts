import { Injectable } from "@nestjs/common";
import { Website } from "../entities/structure.entity";
import { common } from "src/utils";
import {
  DataPartAboutV1,
  DataPartFooterV1,
  DataPartHeaderV1,
  DataPartParamItem,
  DataPartPolicyV1,
  DataPartProfileV1,
  DataPartSocialLinksV1,
  DataPartTermsV1,
  DataPartVideosV1,
} from "../entities/data-parts";

interface DataPartProviderMetadata {
  website: Website;
}

// TODO: value
const getProfile = async (
  metadata: DataPartProviderMetadata,
  params: any,
): Promise<{ profile: DataPartProfileV1 }> => ({
  profile: {
    value: {
      isRtl: true,
      lang: "fa",
      websiteTitle: "Salamat Trading",
      shortText: "this is the short version of my profile info",
    },
  },
});

const getTerms = async (
  metadata: DataPartProviderMetadata,
  params: any,
): Promise<{ terms: DataPartTermsV1 }> => ({
  terms: {
    value: { richText: "this is the short version of my profile info" },
  },
});

const getPolicy = async (
  metadata: DataPartProviderMetadata,
  params: any,
): Promise<{ policy: DataPartPolicyV1 }> => ({
  policy: {
    value: { richText: "this is the short version of my profile info" },
  },
});

const getHeader = async (
  metadata: DataPartProviderMetadata,
  params: any,
): Promise<{ header: DataPartHeaderV1 }> => ({
  header: {
    value: {
      actionButton: {
        id: "19",
        title: "Visit Youtube Channel",
        url: "https://www.youtube.com/@salamattrading",
        target: "_blank",
      },
      primaryMenu: [
        {
          id: "1",
          order: 1,
          title: "Home",
          url: "/",
          target: "_self",
        },
        {
          id: "2",
          order: 2,
          title: "About",
          url: "/about",
          target: "_self",
        },
        {
          id: "3",
          order: 3,
          title: "Contact",
          url: "/contact",
          target: "_self",
        },
      ],
    },
  },
});

const getFooter = async (
  { website }: DataPartProviderMetadata,
  params: any,
): Promise<{ footer: DataPartFooterV1 }> => ({
  footer: {
    value: {
      primaryMenu: [
        { order: 1, id: "10", title: "Home", url: "/home", target: "_self" },
      ],
      secondaryMenu: [
        {
          id: "16",
          title: "Terms of Use",
          url: "/terms",
          order: 16,
          target: "_blank",
        },
        {
          id: "17",
          title: "Privacy Policy",
          url: "/privacy",
          order: 17,
          target: "_blank",
        },
        {
          id: "18",
          title: "Disclaimer",
          url: "/disclaimer",
          order: 18,
          target: "_blank",
        },
        {
          id: "19",
          title: "Sitemap",
          url: "/sitemap",
          order: 19,
          target: "_blank",
        },
      ],
      rightsText: (() => {
        const params = {
          createdAtYear: website.createdAt.getFullYear(),
          currentYear: new Date().getFullYear(),
        };
        return common.fillTheGaps(
          `© Copyright {{createdAtYear}}${
            params.createdAtYear === params.currentYear
              ? ""
              : "-{{currentYear}}"
          }. All Rights Reserved.`,
          params,
        );
      })(),
    },
  },
});

const getVideos = async (
  metadata: DataPartProviderMetadata,
  params: any,
): Promise<{ videos: DataPartVideosV1 }> => ({
  videos: {
    nextLink: "pagination like youtube api",
    value: [],
  },
});

const getAbout = async (
  metadata: DataPartProviderMetadata,
  params: any,
): Promise<{ about: DataPartAboutV1 }> => ({
  about: {
    value: [
      {
        title: "درباره سلامت  تریدینگ",
        text:
          "سلام. من مهدی سلامت هستم، معامله گر بازار های مالی به خصوص ارزهای دیجیتال، علاقه مند به بلاکچین و سیستم های غیرمتمرکز واقعی و یکی از آرزوهام اینه که روزی سیستم مالی سنتی کاملا تغییر کنه و یک سیستم  غیرمتمرکز واقعی جای اون رو بگیره." +
          " " +
          "من تو این کانال، آخرین اخبار ارزهای دیجیتال به صورت روزانه، آموزش های مربوط به معامله ی این ارزها، بررسی شرایط بازار کریپتو، معرفی استراتژی های معاملاتی و اسکلپ، و کلا هر چیزی که بتونیم تو این بازار برای کسب سود ازش استفاده کنیم رو در اختیارتون قرار میدم." +
          " " +
          "تو این کانال هیچ سیگنالی برای خرید و فروش نمیدیم و توصیه میکنم شما هم به دنبال سیگنال نباشید." +
          " " +
          "امیدوارم در کنار هم سودهای خوبی به دست بیاریم و حداقل از وقتی که برای دیدن ویدیوها میزارید، پشیمون نشید.",
      },
    ],
  },
});

const getSocialLinks = async (
  metadata: DataPartProviderMetadata,
  params: any,
): Promise<{ socialLinks: DataPartSocialLinksV1 }> => ({
  socialLinks: {
    value: {
      links: [
        {
          id: "3",
          order: 1,
          socialMedia: "youtube",
          url: "https://www.youtube.com/@salamattrading",
        },
        {
          id: "4",
          order: 2,
          socialMedia: "telegram",
          url: "https://t.me/g9giGirCfg5hZjg8",
        },
        {
          id: "5",
          order: 3,
          socialMedia: "email",
          url: "myemail@example.com",
        },
      ],
    },
  },
});

const dataParts = {
  profile: getProfile,
  footer: getFooter,
  header: getHeader,
  about: getAbout,
  videos: getVideos,
  terms: getTerms,
  policy: getPolicy,
  "social-links": getSocialLinks,
};

@Injectable()
export class WebsiteDataService {
  async getWebsiteData(
    website: Website,
    parts: DataPartParamItem[],
  ): Promise<any> {
    const metadata: DataPartProviderMetadata = {
      website,
    };

    const tmp = await Promise.allSettled(
      parts.map((p: any) => dataParts[p.part](metadata, p.params)),
    );
    const result = tmp.reduce(
      (result: any, data: any) => ({ ...result, ...data.value }),
      {},
    );

    return result;
  }

  async getAvailableDataParts(includeVersions = false) {
    return [
      "profile",
      "header",
      "footer",
      "social-links",
      "terms",
      "policy",
      "about",
    ];
  }

  async getWebsiteSharedData(website: Website): Promise<any> {
    const sharedDataParts: DataPartParamItem[] = [
      { part: "profile", version: 1 },
      { part: "header", version: 1 },
      { part: "footer", version: 1 },
      { part: "social-links", version: 1 },
      { part: "terms", version: 1 },
      { part: "policy", version: 1 },
    ];
    return this.getWebsiteData(website, sharedDataParts);
  }
}
