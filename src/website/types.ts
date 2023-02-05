export interface HeadMetaData {
  tagName: "meta";
  attributes: object;
}

export interface SectionInfo {
  sectionType: "NAVBAR" | "FOOTER" | "HERO";
  sectionVariant: string;
  sectionProps?: any;
}

export interface Theme {
  bodyClassName: string;
  mainContainerClassName: string;
  // contentClassName: string;
  // primaryColorClassName: string;
  // secondaryColorClassName: string;
  mainContainerBoxed: boolean;
}

interface Badge {
  text: string;
  order: number;
  icon: string;
  className: string;
}

interface Link {
  title?: string;
  url: string;
  order: number;
  icon?: string;
  badges?: Badge[];
  badgesPosition?: "left" | "right";
}

interface SocialLink extends Link {
  platform: string;
}

export interface LayoutConfig {
  theme: Theme;
  navbar: SectionInfo;
  footer: SectionInfo;
  // footer: {
  //   logoPosition: "left" | "right";
  //   displayLogo: boolean;
  //   footerText?: string;
  //   footerTextClassName?: string;
  //   menus?: Menu[];
  // };

  branding: {
    logoUrl?: string;
    title: string;
    shortDescription: string;
    socialLinks: SocialLink[];
    lang: string;
    dir: "ltr" | "rtl";
    customUrl?: string;
    faviconUrl?: string; //---------should be automatic
  };

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

//----------EXPERIMENT----------

// interface Section2 {
//   props: SectionProp[];
// }

// interface SectionProp {
//   // name: string;
//   // value: string;
// }

// interface HeroProps extends SectionProp {
//   primaryText: string;
// }

// interface Hero1Props extends HeroProps {
//   buttonText: string;
// }
// interface Hero2Props extends HeroProps {
//   secondaryText?: string;
//   imageUrl?: string;
//   videoUrl?: string;
// }

// interface Hero {
//   props: HeroProps | Hero1Props | Hero2Props;
// }

// const hero1: Hero = {
//   props: {
//     // buttonText:"",
//     primaryText: "",
//     imageUrl: "",
//   },
// };
