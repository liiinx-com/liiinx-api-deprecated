import { Injectable } from "@nestjs/common";
import {
  PageColumn,
  getAboutPage,
  getHomeGenericPage,
  getHomePage,
} from "./entities";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { lodash } from "../utils";

import { Content } from "./entities";

const { sortBy } = lodash;

@Injectable()
export class WebsiteService {
  // constructor(
  //   @InjectRepository(Content)
  //   private contentRepository: Repository<Content>,
  // ) {}

  async getPage(handle: string, name: string) {
    if (name.toUpperCase() === "ABOUT") {
      return getAboutPage();
    }

    if (name.toUpperCase() === "HOME") {
      return getHomePage();
    }

    if (name.toUpperCase() === "GENERIC") {
      const { variant, type, config, columns } = await getHomeGenericPage();

      const leftCol = columns.find((i) => i.location === "LEFT");
      const centerCol = columns.find((i) => i.location === "CENTER");
      const rightCol = columns.find((i) => i.location === "RIGHT");

      console.log("leftCol, centerCol, rightCol", leftCol, centerCol, rightCol);

      const getColumnConfig = ({
        config,
        sections,
        sizeConfig,
        id,
        location,
      }: PageColumn) => {
        return {
          id,
          location,
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
      };

      return {
        type,
        variant,
        pageConfig: config,
        content: {
          leftColumn: leftCol ? getColumnConfig(leftCol) : null,
          centerColumn: centerCol ? getColumnConfig(centerCol) : null,
          rightColumn: rightCol ? getColumnConfig(rightCol) : null,
        },
      };
    }
  }
}
