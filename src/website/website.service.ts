import { Injectable } from "@nestjs/common";
import { getAboutPage } from "./entities";
import { lodash } from "../utils";

const { sortBy } = lodash;

@Injectable()
export class WebsiteService {
  getPage(handle: string, name: string) {
    const { variant, type, config, columns } = getAboutPage();

    return {
      type,
      variant,
      pageConfig: config,
      content: sortBy(columns, ["order"]).map(
        ({ config, sections, sizeConfig, id }) => {
          return {
            id,
            columnConfig: {
              ...sizeConfig,
              ...config,
            },
            sections: sortBy(sections, ["order"]).map(
              ({
                id,
                config,
                section: { type, defaultConfig, readonlyConfig },
                variant,
              }) => {
                return {
                  id,
                  type,
                  variant,
                  sectionConfig: {
                    ...defaultConfig,
                    ...config,
                    ...readonlyConfig,
                  },
                };
              },
            ),
          };
        },
      ),
    };
  }
}

// const sampleHero1DefaultProps = {
//   primaryText: "Primary text goes here",
//   secondaryText:
//     "Secondary text also goes here which may be more about description",
//   button: { enabled: true, text: "Click Me Now" },
// };

// const sampleHero1RequiredProps = {
//   primaryText: "Primary text goes here",
// };

// const homeEmpty: PageData = {
//   type: "GENERIC",
//   variant: "",
//   props: { worx: true },
//   content: {
//     left: [],
//     right: [],
//     center: [
//       {
//         sectionType: "HERO",
//         sectionVariant: "HERO1",
//         sectionProps: {
//           ...sampleHero1RequiredProps,
//           ...sampleHero1DefaultProps,
//           button: { enabled: true, text: "See More!" },
//         },
//       },
//     ],
//   },
// };

// const aboutEmpty: PageData = {
//   type: "ABOUT",
//   variant: "ABOUT1",
//   props: { about1Worx: true },
//   content: {
//     left: [],
//     right: [],
//     center: [
//       // {
//       //   sectionType: "HERO",
//       //   sectionVariant: "HERO1",
//       //   sectionProps: { randomProp: "some value opacity-80" },
//       // },
//     ],
//   },
// };

// if (pageName.toUpperCase() === "HOME") return homeEmpty;
// if (pageName.toUpperCase() === "ABOUT") return aboutEmpty;
// return homeEmpty;
