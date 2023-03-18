import { Injectable } from "@nestjs/common";
import {
  FooterSectionInfo,
  HeroSectionInfo,
  NavbarSectionInfo,
  Theme,
} from "../entities/section-props";

@Injectable()
export class WebsiteSectionFactory {
  getNavbarDefaultConfig(
    theme: Theme,
    sectionProps: any = null,
    sectionVariant: string = "NAVBAR1",
  ): NavbarSectionInfo {
    return {
      enabled: true,
      sectionType: "NAVBAR",
      sectionVariant,
      sectionProps: {
        ...sectionProps,
        rtl: false,
      },
    };
  }

  getFooterDefaultConfig(
    theme: Theme,
    sectionProps: any = null,
    sectionVariant: string = "FOOTER1",
  ): FooterSectionInfo {
    return {
      enabled: true,
      sectionType: "FOOTER",
      sectionVariant,
      sectionProps: {
        ...sectionProps,
        showLogo: true,
        showSocialLinks: true,
        showPrimaryMenu: true,
      },
    };
  }

  getHeroDefaultConfig(
    theme: Theme,
    sectionProps: any = null,
    sectionVariant: string = "HERO1",
  ): HeroSectionInfo {
    return {
      enabled: true,
      sectionType: "HERO",
      sectionVariant,
      sectionProps: {
        ...sectionProps,
        primaryText: "",
        primaryTextStyles: {
          style: {
            backgroundColor: "white",
            color: theme.globals.primaryTextColor,
          },
        },
      },
    };
  }
}
