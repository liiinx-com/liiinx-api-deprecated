import { GetWebsitePageResponse, WebsitePageDto } from "./dto";
import { WebsitePage } from "./entities";
import { common, lodash } from "src/utils";

export const mapToWebsitePageResponse = (
  page: WebsitePage,
  layout: WebsitePage,
  theme: any,
  sharedData: any,
): GetWebsitePageResponse => {
  return {
    page: mapToWebsitePageDto(page, layout),
    theme,
    sharedData,
  };
};

export const mapToWebsitePageDto = (
  page: WebsitePage,
  layout: WebsitePage,
): WebsitePageDto => {
  const { id, config, metaTags, contentOverrides, parentPage, slug } = page;

  let leftSections = [];
  let centerSections = [];
  let rightSections = [];

  const result: WebsitePageDto = {
    id,
    slug,
    handle: page.website.handle,
    config,
    metaTags,
    pageType: page.parentPage.type,
    pageVariant: page.parentPage.frontendVariantKey,
    layoutType: layout.parentPage.type,
    layoutVariant: layout.parentPage.frontendVariantKey,
  };

  // navbar
  if (parentPage.navbarCustomProps || page.navbarCustomProps) {
    result.structure = {
      ...result.structure,
      navbar: common.deepMergeAll([
        parentPage.navbarCustomProps,
        page.navbarCustomProps,
      ]),
    };
    console.log("result.structure", result.structure);
  }

  // hero
  if (parentPage.heroCustomProps || page.heroCustomProps) {
    result.structure = {
      ...result.structure,
      hero: common.deepMergeAll([
        parentPage.heroCustomProps,
        page.heroCustomProps,
      ]),
    };
  }

  // footer
  if (parentPage.footerCustomProps || page.footerCustomProps) {
    result.structure = {
      ...result.structure,
      footer: common.deepMergeAll([
        parentPage.footerCustomProps,
        page.footerCustomProps,
      ]),
    };
  }

  // content left sections
  if (parentPage.contentOverrides?.leftSections)
    leftSections = [...parentPage.contentOverrides.leftSections];
  if (contentOverrides?.leftSections)
    leftSections = lodash.sortBy(
      [...leftSections, ...contentOverrides.leftSections],
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
  if (parentPage.contentOverrides?.centerSections)
    centerSections = [...parentPage.contentOverrides.centerSections];
  if (contentOverrides?.centerSections)
    centerSections = lodash.sortBy(
      [...centerSections, ...contentOverrides.centerSections],
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

  if (parentPage.contentOverrides?.rightSections)
    rightSections = [...parentPage.contentOverrides.rightSections];
  if (contentOverrides?.rightSections)
    rightSections = lodash.sortBy(
      [...rightSections, ...contentOverrides.rightSections],
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
