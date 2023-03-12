import {
  IsObject,
  IsNotEmpty,
  ArrayMinSize,
  ArrayMaxSize,
  IsArray,
  ValidateNested,
  IsOptional,
} from "class-validator";
import { Type } from "class-transformer";
import { NavbarSectionInfo } from "../entities/section.types";

class ContentSectionInfo {
  leftSections?: SectionInfo[];
  centerSections?: SectionInfo[];
  rightSections?: SectionInfo[];
}

class SectionInfo {
  sectionType: "NAVBAR" | "FOOTER" | "HERO" | "TITLE_BAR";
  sectionVariant: string;
  sectionProps?: any;
  order?: number;
}

export class GetWebsiteThemeResponse {}

export class WebsitePageDto {
  slug?: string;
  metaTags?: [];
  type: string;
  variant: string;
  config?: object;
  structure?: {
    navbar?: NavbarSectionInfo;
    hero?: SectionInfo;
    content?: ContentSectionInfo;
    footer?: SectionInfo;
  };
}

export class GetWebsitePageResponse {
  page: WebsitePageDto;
  layout: WebsitePageDto;
  theme: any;
}

export class DataPartRequest {
  @IsNotEmpty()
  part: string;

  @IsObject()
  @IsOptional()
  params?: object;
}

export class GetWebsiteDataResponse {}

export class GetWebsiteDataRequest {
  @ValidateNested({ each: true })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @Type(() => DataPartRequest)
  parts: DataPartRequest[];
}
