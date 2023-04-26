import { Injectable } from "@nestjs/common";
import {
  ContentSectionInfo,
  FooterSectionInfo,
  HeroSectionInfo,
  NavbarSectionInfo,
  PageTypes,
  Theme,
} from "../entities/section-props";
import { Page, Website, WebsitePage } from "../entities";

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
        rtl: false,
        ...sectionProps,
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

  getPageTitleAsHeroSectionProps(
    theme: Theme,
    pageTitle: string,
    imageUrl?: string,
  ) {
    return {
      primaryText: pageTitle,
    };
  }

  async getHeroDefaultConfig(
    theme: Theme,
    pageType: PageTypes,
    pageVariant: string,
    sectionProps: any = null,
    sectionVariant: string = "HERO1",
  ): Promise<HeroSectionInfo> {
    const getImageUrl = async (pageType: PageTypes, pageVariant: string) => {
      if (pageType === PageTypes.ABOUT)
        return "https://www.leadengine-wp.com/wp-content/uploads/2018/02/about-classic3.jpg";
      if (pageType === PageTypes.CONTACT) {
        const images = [
          "https://www.leadengine-wp.com/wp-content/uploads/2018/01/contact1.jpg",
          "https://www.leadengine-wp.com/wp-content/uploads/2018/01/contact3.jpg",
        ];

        return images[1];
      }
      return "";
    };

    return {
      enabled: true,
      sectionType: "HERO",
      sectionVariant,
      sectionProps: {
        primaryText: "",
        overlay: {
          colorCode: "#000",
          opacity: 0.2,
        },
        heroStyles: {
          style: {
            height: "300px",
          },
        },
        imageUrl: await getImageUrl(pageType, pageVariant),
        primaryTextStyles: {
          style: {
            // backgroundColor: "white",
            // color: theme.globals.primaryTextColor,
            color: "#fff",
          },
        },
        ...sectionProps,
      },
    };
  }
}
