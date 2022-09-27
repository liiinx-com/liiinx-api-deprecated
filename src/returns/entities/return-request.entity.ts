import {
  ReturnRequestItemSize,
  ReturnRequestItemStatus,
  ReturnRequestStatus,
} from "./types";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";

@Entity()
export class ReturnRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @OneToMany(() => ReturnRequestItem, (item) => item.request)
  items: ReturnRequestItem[];

  @Column({ type: "date" })
  pickupDate: string;

  @Column()
  pickupTimeSlotCode: string;

  //TODO: Check for auto generated DATE columns

  //TODO: how to have comments here
  //  @Column("simple-json")
  //   userComment: { timestamp: number; message: string };

  @Column({ nullable: true })
  crmTicketUrl: string;

  @Column({
    type: "enum",
    enum: ReturnRequestStatus,
    default: ReturnRequestStatus.PROCESSING,
  })
  status: ReturnRequestStatus;
}

@Entity()
export class ReturnRequestItem {
  @PrimaryGeneratedColumn()
  id: number;

  //TODO: Separate entity
  @Column() // "AMAZON, WALMART, ..."
  retailer: string;

  @Column({ nullable: true })
  productUrl: string;

  @Column({
    type: "enum",
    enum: ReturnRequestItemSize,
    default: ReturnRequestItemSize.UNKNOWN,
  })
  productSize: ReturnRequestItemSize;

  @Column({ nullable: true })
  userComment: string;

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
