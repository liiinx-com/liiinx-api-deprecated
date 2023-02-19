export interface SectionStyle {
  className?: string;
  style?: object;
}

export interface SectionProps {
  variant: string;
}

export interface FooterProps extends SectionProps {
  footerStyle: SectionStyle;
  footerTextStyle: SectionStyle;
}

export interface HeroProps extends SectionProps {
  variant: string;
  primaryText: string;
  primaryTextStyle?: SectionStyle;
  secondaryText?: string;
  secondaryTextStyle?: SectionStyle;
  button?: {
    text: string;
    enabled: boolean;
    buttonStyle?: SectionStyle;
  };
  imageUrl?: string;
  videoUrl?: string;
}

export interface NavbarProps extends SectionProps {
  rtl: boolean;
  linkStyle: SectionStyle;
  navbarStyle?: SectionStyle;
}

export interface TitleBarProps extends SectionProps {
  variant: string;
  title: string;
  titleClassName?: string;
  titleStyle?: object;
  subTitle?: string;
  subTitleClassName?: string;
  subTitleStyle?: object;
}
