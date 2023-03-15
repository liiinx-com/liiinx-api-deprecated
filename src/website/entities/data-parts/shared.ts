import { ComponentStyle } from "../section-props";

export class DataPartItem {
  nextLink?: string;
  value: any;
}

export class DataPartParam {
  parts: DataPartParamItem[];
}

export class DataPartParamItem {
  part: string;

  version: number;

  params?: object;
}

export class MenuLink {
  id: string;
  order?: number;
  title: string;
  url: string;
  target: string;
  styles?: ComponentStyle;
}

export class SocialMediaLink {
  constructor() {
    this.target = "_blank";
  }
  id: string;
  order: number;
  target?: string;
  url: string;
  socialMedia:
    | "youtube"
    | "email"
    | "telegram"
    | "twitter"
    | "tiktok"
    | "facebook"
    | "instagram"
    | "instagram";
}
