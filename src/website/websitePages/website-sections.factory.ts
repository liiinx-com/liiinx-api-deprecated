import { Injectable } from "@nestjs/common";
import {
  FooterSectionInfo,
  HeroSectionInfo,
  NavbarSectionInfo,
} from "../entities/section-props";

@Injectable()
export class WebsiteSectionFactory {
  getNavbarDefaultConfig(
    sectionProps: any = null,
    sectionVariant: string = "NAVBAR1",
  ): NavbarSectionInfo {
    return {
      enabled: true,
      sectionType: "NAVBAR",
      order: 1,
      sectionVariant,
      sectionProps: {
        rtl: false,
      },
    };
  }

  getFooterDefaultConfig(
    sectionProps: any = null,
    sectionVariant: string = "FOOTER1",
  ): FooterSectionInfo {
    return {
      enabled: true,
      sectionType: "FOOTER",
      order: 1,
      sectionVariant,
      sectionProps: {
        showLogo: true,
        showSocialLinks: true,
      },
    };
  }

  getHeroDefaultConfig(
    sectionProps: any = null,
    sectionVariant: string = "HERO1",
  ): HeroSectionInfo {
    return {
      enabled: true,
      sectionType: "HERO",
      sectionVariant,
      sectionProps,
      order: 1,
    };
  }
}
