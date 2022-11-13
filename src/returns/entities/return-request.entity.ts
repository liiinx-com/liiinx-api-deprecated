import {
  PickupTimeSlot,
  Retailer,
  ReturnRequestItemProductType,
  ReturnRequestItemSize,
  ReturnRequestItemStatus,
  ReturnRequestStatus,
} from "./types";
import { BaseEntity } from "src/shared/base.entity";
import { Expose } from "class-transformer";

export class ReturnRequest {
  @Expose()
  id: number;

  @Expose()
  userId: string;

  items: ReturnRequestItem[] | ReturnRequestShippingBox[];

  @Expose()
  pickupDate: string;

  pickupTimeSlot: PickupTimeSlot;

  @Expose()
  userNote: string;

  @Expose()
  itemsTotal: string;

  @Expose()
  total: string;

  @Expose()
  totalTax: string;

  serviceDeskTicketUrl: string;

  @Expose()
  createdAt: Date;

  @Expose()
  status: ReturnRequestStatus;
}

class ReturnRequestItemBase {
  productId: number;
  productType: ReturnRequestItemProductType;
  price: string;
  quantity: number;
}

export class ReturnRequestShippingBox extends ReturnRequestItemBase {
  productSize: ReturnRequestItemSize;
}

export class ReturnRequestItem extends ReturnRequestItemBase {
  retailer: Retailer;
  productUrl?: string;
  productSize: ReturnRequestItemSize;
  userNote?: string;
  needShippingBox: boolean;
  status: ReturnRequestItemStatus;
}
