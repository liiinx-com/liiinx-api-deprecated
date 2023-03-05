import { IsObject, IsNotEmpty, ValidateNested, IsArray } from "class-validator";

import { Type } from "class-transformer";

export interface ContentSectionInfo {
  leftSections?: SectionInfo[];
  centerSections?: SectionInfo[];
  rightSections?: SectionInfo[];
}

export interface SectionInfo {
  sectionType: "NAVBAR" | "FOOTER" | "HERO" | "TITLE_BAR";
  sectionVariant: string;
  sectionProps?: any;
  order?: number;
}

export interface HeadMetaData {
  tagName: "meta";
  attributes: object;
}

export class GetHeadParamsResponse {
  metaTags: HeadMetaData[];
}

export class GetWebsiteThemeResponse {}
export class WebsitePageBaseResponse {
  metaTags?: []; //HeadMetaData[];
  type: string;
  variant: string;
  config?: object;
  structure: {
    navbar?: SectionInfo;
    hero?: SectionInfo;
    content?: ContentSectionInfo;
    footer?: SectionInfo;
  };
}
export class GetWebsitePageResponse extends WebsitePageBaseResponse {
  slug: string;
}
export class GetWebsiteLayoutResponse extends WebsitePageBaseResponse {}

export class DataPartFilterRequest {
  @Type(() => String)
  @IsNotEmpty()
  // @IsEnum(entity: object)
  part: string;

  @IsObject()
  params: object;
}

export class GetWebsiteDataRequest {
  @ValidateNested({ each: true })
  @IsArray()
  parts: DataPartFilterRequest[];
}
