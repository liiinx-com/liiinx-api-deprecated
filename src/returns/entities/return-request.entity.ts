import {
  PickupTimeSlot,
  Retailer,
  ReturnRequestItemSize,
  ReturnRequestItemStatus,
  ReturnRequestStatus,
} from "./types";
import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "src/shared/base.entity";

@Entity()
export class ReturnRequest extends BaseEntity {
  @Column()
  userId: string;

  @OneToMany(() => ReturnRequestItem, (item) => item.request)
  items: ReturnRequestItem[];

  @Column({ type: "date" })
  pickupDate: string;

  @Column({
    type: "enum",
    enum: PickupTimeSlot,
    default: PickupTimeSlot.NOT_SET,
  })
  pickupTimeSlot: string;

  @Column()
  userNote: string;

  @Column({ nullable: true })
  serviceDeskTicketUrl: string;

  @Column({
    type: "enum",
    enum: ReturnRequestStatus,
    default: ReturnRequestStatus.INHERIT_FROM_ITEM,
  })
  status: ReturnRequestStatus;
}

@Entity()
export class ReturnRequestItem extends BaseEntity {
  //TODO: Separate entity
  @Column({
    type: "enum",
    enum: Retailer,
    default: Retailer.NOT_SET,
  })
  retailer: string;

  @Column({ nullable: true })
  productUrl: string;

  @Column({
    type: "enum",
    enum: ReturnRequestItemSize,
    default: ReturnRequestItemSize.NOT_SET,
  })
  productSize: ReturnRequestItemSize;

  @Column({ nullable: true })
  userComment: string;

  @Column({ nullable: true })
  cancellationUserNote: string;

  @Column({ nullable: true })
  cancellationEmployeeNote: string;

  @Column({ type: "simple-json", nullable: true })
  attachments: [
    { dateTime: string; url: string; desc: string; by: "USER" | "EMPLOYEE" },
  ];

  @Column({ default: true })
  hasOriginalPackaging: boolean;

  @Column()
  needShippingBox: boolean;

  @ManyToOne(() => ReturnRequest, (request) => request.items)
  request: ReturnRequest;

  @Column({
    type: "enum",
    enum: ReturnRequestItemStatus,
    default: ReturnRequestItemStatus.PROCESSING,
  })
  status: ReturnRequestItemStatus;
}
