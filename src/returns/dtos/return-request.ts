import {
  PickupTimeSlot,
  Retailer,
  ReturnRequestItemSize,
  ReturnRequestItemStatus,
} from "../entities/types";
import {
  IsDateString,
  IsUrl,
  IsEnum,
  IsBoolean,
  IsOptional,
  ValidateNested,
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

export class UpdateReturnRequestReqItemDto {
  @IsBoolean()
  @IsOptional()
  hasOriginalPackaging?: boolean;

  @IsBoolean()
  @IsOptional()
  needShippingBox?: boolean;

  @IsEnum(ReturnRequestItemSize)
  @IsOptional()
  productSize?: ReturnRequestItemSize;

  @IsUrl()
  @IsOptional()
  productUrl?: string;

  @IsEnum(Retailer)
  @IsOptional()
  retailer?: Retailer;

  @IsEnum(ReturnRequestItemStatus)
  @IsOptional()
  status?: ReturnRequestItemStatus;
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

export class UpdateReturnsRequestReqDto {
  @IsOptional()
  @IsDateString()
  pickupDate?: Date;

  @IsEnum(PickupTimeSlot)
  @IsOptional()
  pickupTimeSlot?: PickupTimeSlot;

  @IsOptional()
  userNote?: string;
}
