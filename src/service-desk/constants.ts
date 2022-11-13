export enum WorkManagementIssueType {
  TASK = "10015",
  SUB_TASK = "10010",
  SUB_TASK_2 = "10016", //TODO: remove if other one works
}

export enum OrderCustomFields {
  pickupDate = "customfield_10049",
  orderUrl = "customfield_10050",
  pickupTimeSlot = "customfield_10051",
  userNote = "customfield_10052",
}

export enum OrderItemCustomFields {
  productSize = "customfield_10053",
  needShippingBox = "customfield_10055",
  retailer = "customfield_10056",
  productUrl = "customfield_10057",
}

export enum ServiceDeskPriority {
  HIGHEST = "1",
  HIGH = "2",
  MEDIUM = "3",
  LOW = "4",
  LOWEST = "5",
}
