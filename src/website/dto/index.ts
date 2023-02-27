import {
  IsObject,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
  IsArray,
} from "class-validator";
import { SectionInfo } from "../types";
import { Transform, Type } from "class-transformer";

export class ThemeResponse {}

export class WebsiteLayoutResponse {
  navbar?: SectionInfo;
  hero?: SectionInfo;
  content?: SectionInfo;
  footer?: SectionInfo;
}

export class DataPartFilter {
  @Type(() => String)
  @IsNotEmpty()
  // @IsEnum(entity: object)
  part: string;

  @IsObject()
  params: object;
}

export class WebsiteDataPartsFilter {
  @ValidateNested({ each: true })
  @IsArray()
  parts: DataPartFilter[];
}
