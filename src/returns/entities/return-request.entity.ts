import {
  PickupTimeSlot,
  Retailer,
  ReturnRequestItemSize,
  ReturnRequestItemStatus,
  ReturnRequestStatus,
} from "./types";
import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "src/shared/base.entity";
import { Expose } from "class-transformer";

export class ReturnRequest {
  @Expose()
  userId: string;

  items: ReturnRequestItem[];

  @Expose()
  pickupDate: string;

  pickupTimeSlot: PickupTimeSlot;

  @Expose()
  userNote: string;

  @Expose()
  total: string;

  serviceDeskTicketUrl: string;

  @Expose()
  createdAt: Date;

  @Expose()
  status: ReturnRequestStatus;
}

export class ReturnRequestItem {
  retailer: Retailer;

  productUrl?: string;

  productSize: ReturnRequestItemSize;

  // userNote?: string;

  // attachments: [
  //   { dateTime: string; url: string; desc: string; by: "USER" | "EMPLOYEE" },
  // ];

  needShippingBox: boolean;

  // request: ReturnRequest;

  status: ReturnRequestItemStatus;
}
