import { Injectable } from "@nestjs/common";

// TODO: value
const getProfile = async (params: any) => ({
  profile: { value: { dir: "ltr", lang: "en" } },
});

const getHeader = async (params: any) => ({
  header: { value: { headerData: { yes: true } } },
});

const getFooter = async (params: any) => ({
  footer: { value: { someFooterData: { yes: true } } },
});

const getVideos = async (params: any) => ({
  videos: {
    nextLink: "pagination like youtube api",
    value: [],
  },
});

const getAbout = async (params: any) => ({
  about: { value: { someData: "lorem ipsum" } },
});

const getSocialLinks = async (params: any) => ({
  socialLinks: { nextLink: "pagination like youtube api", value: [] },
});

const dataParts = {
  profile: getProfile,
  footer: getFooter,
  header: getHeader,
  about: getAbout,
  videos: getVideos,
  "social-links": getSocialLinks,
};

@Injectable()
export class WebsiteDataService {
  async getWebsiteData(handle: string, parts: any): Promise<any> {
    const tmp = await Promise.allSettled(
      parts.map((p: any) => dataParts[p.part](p.params)),
    );
    const result = tmp.reduce(
      (result: any, data: any) => ({ ...result, ...data.value }),
      {},
    );

    return result;
  }
}
