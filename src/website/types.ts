export interface SectionInfo {
  sectionType: "NAVBAR" | "FOOTER" | "HERO" | "TITLE_BAR";
  sectionVariant: string;
  sectionProps?: object;
  order?: number;
}

export interface ContentSectionInfo {
  leftSections?: SectionInfo[];
  centerSections?: SectionInfo[];
  rightSections?: SectionInfo[];
}

export enum BoxSize {
  FULL = "w-full",
  CONTAINER = "container",
  MEDIUM = "max-w-7xl",
}

export interface ComponentStyle {
  className?: string;
  style?: object;
}

export interface Theme {
  bodyStyle: ComponentStyle;
  primaryTextStyle: ComponentStyle;
  paragraphStyle: ComponentStyle;

  headerBoxSize: BoxSize;
  headerWrapperStyle: ComponentStyle;
  navbarStyle: ComponentStyle;
  navbarLinkStyle: ComponentStyle;

  heroBoxSize: BoxSize;
  heroWrapperStyle: ComponentStyle;

  mainBoxSize: BoxSize;
  mainWrapperStyle: ComponentStyle;

  footerBoxSize: BoxSize;
  footerWrapperStyle: ComponentStyle;
  footerStyle: ComponentStyle;
  footerTextStyle: ComponentStyle;
}

// interface Badge {
//   text: string;
//   order: number;
//   icon: string;
//   className: string;
// }

// interface Link {
//   title?: string;
//   url: string;
//   order: number;
//   icon?: string;
//   badges?: Badge[];
//   badgesPosition?: "left" | "right";
// }

// interface SocialLink extends Link {
//   platform: string;
// }

export interface LayoutConfig {
  theme: Theme;
  navbar: SectionInfo;
  footer: SectionInfo;
  hero?: SectionInfo;
  // footer: {
  //   logoPosition: "left" | "right";
  //   displayLogo: boolean;
  //   footerText?: string;
  //   footerTextClassName?: string;
  //   menus?: Menu[];
  // };

  // branding: {
  //   logoUrl?: string;
  //   title: string;
  //   shortDescription: string;
  //   socialLinks: SocialLink[];
  //   lang: string;
  //   dir: "ltr" | "rtl";
  //   customUrl?: string;
  //   faviconUrl?: string; //---------should be automatic
  // };

  // body: {
  //   // backgroundColor?: string;
  //   // backgroundImage?: string;
  // };

  pages?: [];
}

export interface PageData {
  type: "ABOUT" | "CONTACT" | "GENERIC"; //|"page?";
  variant: string;
  props?: any; // pageConfig
  content: {
    left: SectionInfo[];
    right: SectionInfo[];
    center: SectionInfo[];
  };
}
