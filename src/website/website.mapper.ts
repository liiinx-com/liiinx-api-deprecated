import { GetWebsitePageResponse, WebsitePageDto } from "./dto";
import { WebsitePage } from "./entities";
import { lodash } from "src/utils";

export const mapToWebsitePageResponse = (
  page: WebsitePage,
  layout: WebsitePage,
  theme: any,
  sharedData: any,
): GetWebsitePageResponse => {
  return {
    page: mapToWebsitePageDto(page), // TODO: sharedData?
    layout: mapToWebsitePageDto(layout),
    theme,
    sharedData,
  };
};

export const mapToWebsitePageDto = (
  page: WebsitePage,
  sharedData?: any,
): WebsitePageDto => {
  const {
    config,
    metaTags,
    contentConfig,
    // layout, // TODO: consider this--------------------------
    themeOverrides,
    parentPage,
    slug,
  } = page;

  let leftSections = [];
  let centerSections = [];
  let rightSections = [];

  const result: WebsitePageDto = {
    slug,
    handle: page.website.handle,
    config,
    metaTags,
    type: page.parentPage.type,
    variant: page.parentPage.frontendVariantKey,
  };

  // navbar
  if (parentPage.navbarConfig || page.navbarConfig) {
    result.structure = {
      ...result.structure,
      navbar: { ...parentPage.navbarConfig, ...page.navbarConfig },
    };
    // navbar data
    // result.structure.navbar.sectionProps = {
    //   ...result.structure.navbar.sectionProps,
    //   ...sharedData.header.value,
    // };
  }

  // hero
  if (parentPage.heroConfig || page.heroConfig) {
    result.structure = {
      ...result.structure,
      hero: { ...parentPage.heroConfig, ...page.heroConfig },
    };
  }

  // footer
  if (parentPage.footerConfig || page.footerConfig) {
    result.structure = {
      ...result.structure,
      footer: { ...parentPage.footerConfig, ...page.footerConfig },
    };
    // footer data
    // result.structure.footer.sectionProps = {
    //   ...result.structure.footer.sectionProps,
    //   ...sharedData.footer.value,
    // };
  }

  // content left sections
  if (parentPage.contentConfig?.leftSections)
    leftSections = [...parentPage.contentConfig.leftSections];
  if (contentConfig?.leftSections)
    leftSections = lodash.sortBy(
      [...leftSections, ...contentConfig.leftSections],
      ["order"],
    );
  if (leftSections.length > 0) {
    result.structure = {
      ...result.structure,
      content: {
        ...result?.structure?.content,
        leftSections,
      },
    };
  }

  // content center sections
  if (parentPage.contentConfig?.centerSections)
    centerSections = [...parentPage.contentConfig.centerSections];
  if (contentConfig?.centerSections)
    centerSections = lodash.sortBy(
      [...centerSections, ...contentConfig.centerSections],
      ["order"],
    );
  if (centerSections.length > 0) {
    result.structure = {
      ...result.structure,
      content: {
        ...result?.structure?.content,
        centerSections,
      },
    };
  }

  if (parentPage.contentConfig?.rightSections)
    rightSections = [...parentPage.contentConfig.rightSections];
  if (contentConfig?.rightSections)
    rightSections = lodash.sortBy(
      [...rightSections, ...contentConfig.rightSections],
      ["order"],
    );
  if (rightSections.length > 0) {
    result.structure = {
      ...result.structure,
      content: {
        ...result?.structure?.content,
        rightSections,
      },
    };
  }

  return result;
};