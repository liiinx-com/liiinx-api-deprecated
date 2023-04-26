import { Injectable } from "@nestjs/common";
import { Website } from "../entities/structure.entity";
import { WebsitesRepository } from "./websites.repository";

@Injectable()
export class WebsitesService {
  constructor(private readonly websitesRepository: WebsitesRepository) {}

  async getWebsite(handle: string): Promise<Website> {
    return this.websitesRepository.getByHandle(handle);
  }

  async newWebsite(params: Partial<Website>): Promise<Website> {
    return this.websitesRepository.newWebsite(params);
  }

  // async getLayoutConfig(
  //   handle: string,
  //   lang: string,
  // ): Promise<GetWebsiteLayoutResponse> {
  //   return null;
  // const parentLayout = salamatLayout.parentPage;
  // const websiteLayout = salamatLayout;

  // const result: GetWebsiteLayoutResponse = {
  //   type: parentLayout.type,
  //   variant: parentLayout.frontendVariantKey,
  //   structure: {},
  // };

  // // navbar
  // if (
  //   parentLayout.structure.navbarConfig ||
  //   websiteLayout.structureOverrides.navbarConfig
  // ) {
  //   result.structure.navbar = {
  //     ...parentLayout.structure.navbarConfig,
  //     ...websiteLayout.structureOverrides.navbarConfig,
  //   };
  // }

  // // hero
  // if (
  //   parentLayout.structure.heroConfig ||
  //   websiteLayout.structureOverrides.heroConfig
  // ) {
  //   result.structure.hero = {
  //     ...parentLayout.structure.heroConfig,
  //     ...websiteLayout.structureOverrides.heroConfig,
  //   };
  // }

  // // content
  // if (
  //   parentLayout.structure.contentConfig ||
  //   websiteLayout.structureOverrides.contentConfig
  // ) {
  //   result.structure.content = {
  //     ...parentLayout.structure.contentConfig,
  //     ...websiteLayout.structureOverrides.contentConfig,
  //   };
  // }

  // // footer
  // if (
  //   parentLayout.structure.footerConfig ||
  //   websiteLayout.structureOverrides.footerConfig
  // ) {
  //   result.structure.footer = {
  //     ...parentLayout.structure.footerConfig,
  //     ...websiteLayout.structureOverrides.footerConfig,
  //   };
  // }

  // return result;
  // }
}
