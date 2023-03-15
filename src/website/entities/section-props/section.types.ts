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
  globals: {
    textColor: string;
    primaryColor: string;
    primaryTextColor: string;
    secondaryColor: string;
    secondaryTextColor: string;
  };

  body: ComponentStyle;
  navbar: {
    boxSize: BoxSize;
    wrapper: ComponentStyle;
    navbar: ComponentStyle;
    link: ComponentStyle;
    text: ComponentStyle;
  };
  hero: {
    boxSize: BoxSize;
    wrapper: ComponentStyle;
  };
  main: {
    boxSize: BoxSize;
    wrapper: ComponentStyle;
    main: ComponentStyle;
  };
  footer: {
    boxSize: BoxSize;
    wrapper: ComponentStyle;
    footer: ComponentStyle;
    text: ComponentStyle;
    link: ComponentStyle;
  };
}

// export interface Theme {
//   bodyStyle: ComponentStyle;
//   primaryTextStyle: ComponentStyle;
//   paragraphStyle: ComponentStyle;

//   headerBoxSize: BoxSize;
//   headerWrapperStyle: ComponentStyle;
//   navbarStyle: ComponentStyle;
//   navbarLinkStyle: ComponentStyle;

//   heroBoxSize: BoxSize;
//   heroWrapperStyle: ComponentStyle;

//   mainBoxSize: BoxSize;
//   mainWrapperStyle: ComponentStyle;

//   footerBoxSize: BoxSize;
//   footerWrapperStyle: ComponentStyle;
//   footerStyle: ComponentStyle;
//   footerTextStyle: ComponentStyle;
// }

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

export class ContentSectionInfo {
  leftSections?: SectionInfo[];
  centerSections?: SectionInfo[];
  rightSections?: SectionInfo[];
}

class SectionInfo {
  constructor() {
    this.enabled = true;
  }
  sectionType: "NAVBAR" | "FOOTER" | "HERO" | "TITLE_BAR";
  sectionVariant: string;
  sectionProps?: object;
  order?: number;
  enabled: boolean;
}

export class NavbarSectionInfo extends SectionInfo {
  constructor() {
    super();
    this.sectionType = "NAVBAR";
    this.sectionVariant = "NAVBAR1";
  }

  sectionProps?: {
    rtl: boolean;
  };
}

export class HeroSectionInfo extends SectionInfo {
  constructor() {
    super();
    this.sectionType = "HERO";
    this.sectionVariant = "HERO1";
  }
  sectionProps?: {
    primaryText: string;
    secondaryText?: string;
    button?: {
      text: string;
      enabled: boolean;
    };
    // imageUrl?: string;
    // videoUrl?: string;
  };
}

export class FooterSectionInfo extends SectionInfo {
  constructor() {
    super();
    this.sectionType = "FOOTER";
    this.sectionVariant = "FOOTER1";
  }

  sectionProps: {
    showLogo: boolean;
    showSocialLinks: boolean;
  };
}

export enum Status {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}

export enum PageTypes {
  LAYOUT = "LAYOUT",
  HOME = "HOME",
  ABOUT = "ABOUT",
  CONTACT = "CONTACT",
  GENERIC = "GENERIC",
}

// enum Sizes {
//   AUTO = "AUTO",
//   FULL = "FULL",
// }
