import {
  PickupTimeSlot,
  Retailer,
  ReturnRequestItemSize,
} from "../entities/types";
import {
  IsDateString,
  IsUrl,
  IsEnum,
  IsBoolean,
  IsOptional,
  ValidateNested,
  IsNotEmpty,
  IsNotEmptyObject,
  ArrayNotEmpty,
} from "class-validator";
import { Type } from "class-transformer";

class NewReturnRequestReqItemDto {
  @IsBoolean()
  hasOriginalPackaging: boolean;

  @IsBoolean()
  needShippingBox: boolean;

  @IsEnum(ReturnRequestItemSize)
  productSize: ReturnRequestItemSize;

  @IsUrl()
  @IsOptional()
  productUrl: string;

  @IsEnum(Retailer)
  retailer: Retailer;
}

export class NewReturnRequestBaseDto {
  @IsOptional()
  id: string;

  @IsDateString()
  pickupDate: Date;

  @IsEnum(PickupTimeSlot)
  pickupTimeSlot: PickupTimeSlot;

  @ValidateNested()
  @ArrayNotEmpty()
  @Type(() => NewReturnRequestReqItemDto)
  items: NewReturnRequestReqItemDto[];

  @IsOptional()
  userNote: string;
}

export class NewReturnRequestReqDto extends NewReturnRequestBaseDto {}

export class NewReturnRequestResDto extends NewReturnRequestBaseDto {
  created_at: string;
}
