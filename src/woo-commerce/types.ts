export enum UserStatus {
  PUBLISH = "publish",
}

export enum OrderStatus {
  ANY = "any",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
  ON_HOLD = "on-hold",
  PROCESSING = "processing",
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
  shipping: BillingShippingInfo;
};

type OrderLineItem = {
  product_id: number;
  variation_id?: number;
  quantity: number;
};

type CouponLineItem = {
  code: string;
};

type OrderMetaData = {
  key: string;
  value: string;
};

export type WooOrder = {
  payment_method: string;
  payment_method_title: string;
  set_paid: boolean;
  billing: BillingShippingInfo;
  shipping: BillingShippingInfo;
  line_items: Array<OrderLineItem>;
  customer_id: number;
  customer_note?: string;
  coupon_lines?: Array<CouponLineItem>;
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

export type Order = {
  paymentMethod: string;
  paymentMethodTitle: string;
  setPaid: boolean;
  shipping: BillingShippingInfo;
  lineItems: Array<OrderLineItem>;
  customerId: number;
  couponCodes?: Array<string>;
  customerNote?: string;
  metaData?: Array<OrderMetaData>;
  status?: OrderStatus;
  //   shippingLines: [
  //     {
  //       method_id: 'flat_rate';
  //       method_title: 'Flat Rate';
  //       total: '10.00';
  //     },
  //   ];
};

export type WooCustomer = {
  email: string;
  first_name: string;
  last_name: string;
  username?: string;
  billing: BillingShippingInfo;
  shipping: BillingShippingInfo;
};

export type Service = {};
