import { Injectable } from "@nestjs/common";
import { ThemesRepository } from "./theme.repository";
// import { Theme } from "../entities/structure.entity";
import { BoxSize, Theme, ThemeGlobals } from "../entities/section-props";

const getDefaultTheme = (globalSettings: ThemeGlobals): Theme => ({
  globals: globalSettings,
  navbar: {
    boxSize: BoxSize.CONTAINER,
    navbar: {
      style: { backgroundColor: "#FFF" },
      className: "",
    },
    wrapper: {
      style: { backgroundColor: "#FFF" },
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
        backgroundColor: "#FFF",
      },
    },
  },
  main: {
    boxSize: BoxSize.CONTAINER,
    wrapper: {
      className: "",
      style: {
        backgroundColor: "#f7f9fb",
      },
    },
    main: {
      style: { backgroundColor: "#FFF" },
      className: "",
    },
  },
  footer: {
    boxSize: BoxSize.CONTAINER,
    wrapper: {
      className: "",
      style: {
        backgroundColor: "#f7f9fb",
      },
    },
    text: {
      className: "",
      style: {
        color: globalSettings.secondaryTextColor,
      },
    },
    link: {
      className: "",
      style: {
        color: globalSettings.primaryTextColor,
      },
    },
    footer: {
      className: "",
      style: {
        backgroundColor: "#f7f9fb",
      },
    },
  },
});

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

  async getDefaultTheme(): Promise<Theme> {
    return getDefaultTheme(await this.getGlobalColorsPreset());
  }

  async getTheme(themeId: string): Promise<Theme> {
    return getDefaultTheme(await this.getGlobalColorsPreset());
  }

  async getGlobalColorsPreset(setName = "default"): Promise<ThemeGlobals> {
    return {
      primaryColor: "#673AB7",
      primaryTextColor: "#673AB7",
      textColor: "#1f1f1f",
      secondaryColor: "#1565C0",
      secondaryTextColor: "#424242",
    };
  }

  // {"globals":{"primaryColor":"#673AB7","primaryTextColor":"#673AB7","textColor":"#1f1f1f","secondaryColor":"#1565C0","secondaryTextColor":"#424242"}}
  // {"globals":{"primaryColor":"#673AB7","primaryTextColor":"#673AB7","textColor":"#1f1f1f","secondaryColor":"#1565C0","secondaryTextColor":"#424242"}}

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
