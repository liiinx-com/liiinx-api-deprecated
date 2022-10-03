export enum ReturnRequestItemStatus {
  PROCESSING = "PROCESSING",
  CONFIRMED = "CONFIRMED",
  ON_HOLD = "ON_HOLD",
  DELETED = "DELETED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export enum ReturnRequestStatus {
  PROCESSING = "PROCESSING",
  CONFIRMED = "CONFIRMED",
  ON_HOLD = "ON_HOLD",
  DELETED = "DELETED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",

  PARTIALLY_COMPLETED = "PARTIALLY_COMPLETED",
}

//TODO: define sizes
export enum ReturnRequestItemSize {
  NOT_SET = "NOT_SET",
  SMALL = "SMALL",
}

//TODO: define slots
export enum PickupTimeSlot {
  NOT_SET = "NOT_SET",
  SLOT_A = "SLOT_A",
  SLOT_B = "SLOT_B",
}

export enum Retailer {
  NOT_SET = "NOT_SET",
  AMAZON = "AMAZON",
  WALMART = "WALMART",
}
