import { DataPartItem, MenuLink, SocialMediaLink } from "./shared";

export class DataPartProfileV1 extends DataPartItem {
  value: {
    websiteTitle: string;
    shortText: string;
    logoUrl?: string; // if no logo then use websiteTitle as the text logo
  };
}

export class DataPartTermsV1 extends DataPartItem {
  value: {
    richText: string;
  };
}

export class DataPartPolicyV1 extends DataPartItem {
  value: {
    richText: string;
  };
}
export class DataPartHeaderV1 extends DataPartItem {
  value: {
    actionButton?: MenuLink;
    primaryMenu: MenuLink[];
    secondaryMenu?: MenuLink[];
  };
}
export class DataPartFooterV1 extends DataPartItem {
  value: {
    primaryLinks: MenuLink[];
    rightsText: string;
  };
}
export class DataPartSocialLinksV1 extends DataPartItem {
  value: {
    links: SocialMediaLink[];
  };
}
export class DataPartAboutV1 extends DataPartItem {}
export class DataPartVideosV1 extends DataPartItem {}
