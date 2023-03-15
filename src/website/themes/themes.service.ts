import { Injectable } from "@nestjs/common";
import { ThemesRepository } from "./theme.repository";
// import { Theme } from "../entities/structure.entity";
import { GetWebsiteThemeResponse } from "../dto";
import { WebsitesService } from "../websites";
import { BoxSize, Theme } from "../entities/section-props";

const defaultTheme: Theme = {
  globals: {
    primaryColor: "#512DA8",
    primaryTextColor: "#311B92",
    textColor: "#212121",
    secondaryColor: "#303F9F",
    secondaryTextColor: "#0D47A1",
  },

  navbar: {
    boxSize: BoxSize.CONTAINER,
    navbar: {
      style: { backgroundColor: "#FAFAFA" },
      className: "",
    },
    wrapper: {
      style: { backgroundColor: "#FAFAFA" },
      className: "",
    },
    link: {
      style: { color: "#1f1f1f", fontWeight: "500" },
      className: "",
    },
    text: {
      style: { color: "silver" },
      className: "",
    },
  },

  body: {
    style: { backgroundColor: "#EEEEEE" },
    className: "",
  },

  hero: {
    boxSize: BoxSize.FULL,
    wrapper: {
      className: "",
      style: {
        backgroundColor: "#EEEEEE",
      },
    },
  },
  main: {
    boxSize: BoxSize.CONTAINER,
    wrapper: {
      className: "",
      style: {
        backgroundColor: "#E0E0E0",
      },
    },
    main: {
      style: { backgroundColor: "purple" },
      className: "",
    },
  },
  footer: {
    boxSize: BoxSize.CONTAINER,
    wrapper: {
      className: "",
      style: {
        backgroundColor: "#EEEEEE",
      },
    },
    text: {
      className: "",
      style: {
        color: "orange",
      },
    },
    link: {
      className: "",
      style: {
        color: "#4CAF50",
      },
    },
    footer: {
      className: "",
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
