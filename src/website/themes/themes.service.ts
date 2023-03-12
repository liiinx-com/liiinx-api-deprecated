import { Injectable } from "@nestjs/common";
import { ThemesRepository } from "./theme.repository";
// import { Theme } from "../entities/structure.entity";
import { GetWebsiteThemeResponse } from "../dto";
import { WebsitesService } from "../websites";
import { BoxSize, Theme } from "../entities/section.types";

const defaultTheme: Theme = {
  globals: {
    paragraph: {
      className: "default-global-paragraph-class",
      style: { color: "red" },
    },
    primaryText: {
      className: "default-global-primary-class",
      style: { color: "green" },
    },
    secondaryText: {
      className: "default-global-secondary-class",
      style: { color: "blue" },
    },
  },

  navbar: {
    boxSize: BoxSize.CONTAINER,
    navbar: {
      style: { backgroundColor: "orange" },
      className: "default-navbar-class",
    },
    wrapper: {
      style: { backgroundColor: "red" },
      className: "default-navbar-wrapper-class",
    },
    link: {
      style: { color: "pink" },
      className: "default-navbar-link-style-class",
    },
    text: {
      style: { color: "silver" },
      className: "default-navbar-text-style-class",
    },
  },

  body: {
    style: { backgroundColor: "#FFA000" },
    className: "default-body-class",
  },

  hero: {
    boxSize: BoxSize.CONTAINER,
    wrapper: {
      className: "default-hero-wrapper-class",
      style: {
        backgroundColor: "brown",
      },
    },
  },
  main: {
    boxSize: BoxSize.CONTAINER,
    wrapper: {
      className: "default-main-wrapper-class",
      style: {
        backgroundColor: "purple",
      },
    },
    main: {
      style: { backgroundColor: "#8BC34A" },
      className: "default-main-class",
    },
  },
  footer: {
    boxSize: BoxSize.CONTAINER,
    wrapper: {
      className: "default-footer-wrapper-class",
      style: {
        backgroundColor: "#BCAAA4",
      },
    },
    text: {
      className: "default-footer-text-class",
      style: {
        color: "orange",
      },
    },
    link: {
      className: "default-footer-link-class",
      style: {
        color: "#4CAF50",
      },
    },
    footer: {
      className: "default-footer-class",
      style: {
        backgroundColor: "navy",
      },
    },
  },
};

// const themeV2: any = {
//   bodyStyle: {
//     style: { backgroundColor: "#fff" },
//   },
//   primaryTextStyle: {},
//   paragraphStyle: {},
//   headerBoxSize: BoxSize.CONTAINER,
//   headerWrapperStyle: {},

//   heroBoxSize: BoxSize.FULL,

//   mainBoxSize: BoxSize.CONTAINER,
//   mainWrapperStyle: {
//     style: { backgroundColor: "#F3F2F8" },
//   },

//   navbarStyle: {
//     style: {
//       backgroundColor: "#fff",
//     },
//   },

//   navbarLinkStyle: {
//     style: {
//       color: "#283593",
//       //"&:hover": { color: "blue" }, // ! TODO: NOT WORKING
//     },
//   },

//   heroWrapperStyle: {
//     className: "",
//     style: {},
//   },
//   heroPrimaryTextStyle: {
//     className: "",
//     style: { color: "orange" },
//   },
//   heroSecondaryTextStyle: {
//     className: "",
//     style: { color: "pink" },
//   },

//   footerBoxSize: BoxSize.CONTAINER,
//   footerWrapperStyle: {},
//   footerStyle: {},
//   footerTextStyle: {
//     style: {
//       color: "#283593",
//     },
//   },
// };

// const theme1: Theme = {
//   createdAt: new Date(),
//   updatedAt: new Date(),
//   id: "theme-id-1",
//   title: "Elegant Light Theme",
//   description: "some desc",
//   status: "ACTIVE",
//   config: {
//     bodyStyle: {
//       style: { backgroundColor: "#fff" },
//     },
//     primaryTextStyle: { color: "#eee" },
//     paragraphStyle: { color: "#eee" },
//     headerBoxSize: BoxSize.CONTAINER,
//     headerWrapperStyle: {},

//     heroBoxSize: BoxSize.FULL,

//     mainBoxSize: BoxSize.CONTAINER,
//     mainWrapperStyle: {
//       style: { backgroundColor: "#F3F2F8" },
//     },

//     navbarStyle: {
//       style: {
//         backgroundColor: "#fff",
//       },
//     },

//     navbarLinkStyle: {
//       style: {
//         color: "#283593",
//         //"&:hover": { color: "blue" }, // ! TODO: NOT WORKING
//       },
//     },
//   },
// };

@Injectable()
export class ThemesService {
  constructor(private readonly themesRepository: ThemesRepository) {}

  async getTheme(themeId: string) {
    return { config: defaultTheme };
  }

  // async getWebsiteTheme(handle: string): Promise<GetWebsiteThemeResponse> {
  //   const website = await this.websitesService.getWebsite(handle);
  //   console.log("website", website);
  //   const theme = await this.getTheme(website.themeId);
  //   return {
  //     ...theme.config,
  //     ...website.themeOverrides,
  //   } as GetWebsiteThemeResponse;
  // }
}
