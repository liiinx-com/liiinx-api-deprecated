import {
  IsObject,
  IsNotEmpty,
  ArrayMinSize,
  ArrayMaxSize,
  IsInt,
  IsPositive,
  IsArray,
  ValidateNested,
  IsOptional,
} from "class-validator";
import { Type } from "class-transformer";
import { NavbarSectionInfo } from "../entities/section-props";
import {
  DataPartAboutV1,
  DataPartFooterV1,
  DataPartHeaderV1,
  DataPartProfileV1,
} from "../entities/data-parts";

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
  handle: string;
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
  sharedData: any;
}

//=======DATA PARTS=======
export class DataPartRequest {
  @IsNotEmpty()
  part: string;

  @IsInt()
  @IsPositive()
  version: number;

  @IsObject()
  @IsOptional()
  params?: object;
}

export class GetWebsiteDataResponse {
  profile?: DataPartProfileV1;
  header?: DataPartHeaderV1;
  footer?: DataPartFooterV1;
  about?: DataPartAboutV1;
}

export class GetWebsiteDataRequest {
  @ValidateNested({ each: true })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @Type(() => DataPartRequest)
  parts: DataPartRequest[];
}
