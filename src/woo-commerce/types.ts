import { Expose, Type } from "class-transformer";
import { IsArray } from "class-validator";

export enum UserStatus {
  PUBLISH = "publish",
}

export enum ProductType {
  UNKNOWN = "unknown",
  PACKAGE_RETURNS = "package-return",
}

export enum OrderStatus {
  ANY = "any",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
  ON_HOLD = "on-hold",
  PROCESSING = "processing",
  PENDING = "pending",
}

export enum UserRole {
  CUSTOMER = "customer",
}

type BillingShippingInfo = {
  first_name: string;
  last_name: string;
  company?: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email: string;
  phone: string;
};

export type Customer = {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  shipping: BillingShippingInfo;
};

type WooCouponLineItem = {
  code: string;
};

export type OrderMetaData = {
  key: string;
  value: string;
};

export class WooOrderLineItem {
  product_id: number;
  variation_id?: number;
  quantity: number;
  price: string;
  meta_data?: Array<OrderMetaData>;
}

export class OrderLineItem {
  constructor() {
    this.metaData = [];
  }
  @Expose({ name: "product_id" })
  productId: number;

  productType: ProductType;

  @Expose()
  variationId?: number;

  @Expose()
  price: string;

  @Expose()
  quantity: number;

  @Expose({ name: "meta_data" })
  metaData?: Array<OrderMetaData>;
}

export type WooOrder = {
  id?: number;
  payment_method?: string;
  payment_method_title?: string;
  set_paid?: boolean;
  billing?: BillingShippingInfo;
  shipping?: BillingShippingInfo;
  line_items: Array<WooOrderLineItem>;
  customer_id: number;
  customer_note?: string;
  coupon_lines?: Array<WooCouponLineItem>;
  meta_data?: Array<OrderMetaData>;
  status?: OrderStatus;
  //   shipping_lines: [
  //     {
  //       method_id: 'flat_rate';
  //       method_title: 'Flat Rate';
  //       total: '10.00';
  //     },
  //   ];
};

export class NewOrder {
  constructor() {
    this.metaData = [];
    this.lineItems = [];
    this.couponCodes = [];
  }
  shippingInfo: BillingShippingInfo;

  @Type(() => OrderLineItem)
  @IsArray()
  lineItems: Array<OrderLineItem>;

  userId: number;

  couponCodes?: Array<string>;

  userNote?: string;

  metaData?: Array<OrderMetaData>;

  status?: OrderStatus;
}

export class Order {
  @Expose()
  id: string;

  @Expose({ name: "payment_method" })
  paymentMethod?: string;
  @Expose({ name: "payment_method_title" })
  paymentMethodTitle?: string;
  setPaid?: boolean;
  shipping: BillingShippingInfo;

  @Expose({ name: "line_items" })
  @Type(() => OrderLineItem)
  lineItems: Array<OrderLineItem>;

  @Expose({ name: "customer_id" })
  userId: string;

  @Expose({ name: "date_created" })
  createdAt: Date;

  couponCodes?: Array<string>;
  @Expose({ name: "customer_note" })
  userNote?: string;

  @Expose({ name: "meta_data" })
  metaData?: Array<OrderMetaData>;

  @Expose()
  total: string;

  @Expose({ name: "total_tax" })
  totalTax: string;

  @Expose({ name: "currency_symbol" })
  currencySymbol: string;

  @Expose()
  status: OrderStatus;
}

export type WooCustomer = {
  email: string;
  first_name: string;
  last_name: string;
  username?: string;
  billing: BillingShippingInfo;
  shipping: BillingShippingInfo;
};

export type Service = {};

export type HandleFindOneResponseOptions = {
  notFoundMsg: string;
};
