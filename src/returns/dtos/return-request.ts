import {
  PickupTimeSlot,
  Retailer,
  ReturnRequestItemSize,
  ReturnRequestItemStatus,
} from "../entities/types";
import {
  IsUrl,
  IsEnum,
  IsBoolean,
  IsOptional,
  ValidateNested,
  ArrayNotEmpty,
  IsDate,
  IsNumberString,
  IsString,
} from "class-validator";
import { Type } from "class-transformer";

export class NewReturnRequestReqItemDto {
  @IsBoolean()
  needShippingBox: boolean;

  @IsEnum(ReturnRequestItemSize)
  productSize: ReturnRequestItemSize;

  @IsUrl()
  @IsOptional()
  productUrl: string;

  @IsEnum(Retailer)
  retailer: Retailer;

  @IsOptional()
  userNote: string;
}

export class UpdateReturnRequestReqItemDto {
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

export class ReturnRequestBaseDto {
  constructor() {
    this.items = [];
  }

  @IsString()
  @IsOptional()
  couponCode?: string;

  @IsDate()
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

export class NewReturnRequestReqDto extends ReturnRequestBaseDto {
  constructor() {
    super();
  }
}

export class ReturnRequestResDto extends ReturnRequestBaseDto {
  @IsNumberString()
  id: string;
}

export class UpdateReturnsRequestReqDto extends ReturnRequestBaseDto {
  @IsNumberString()
  id: string;
}
