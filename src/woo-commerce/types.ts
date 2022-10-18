export enum Resource {
  USER = "user",
  PRODUCT = "product",
}

export interface WooCommerceClient {
  getAsync(
    resource: Resource,
    data?: any,
    callback?: () => object,
  ): Promise<any>;
  postAsync(
    resource: Resource,
    data?: any,
    callback?: () => object,
  ): Promise<any>;
  putAsync(
    resource: Resource,
    data?: any,
    callback?: () => object,
  ): Promise<any>;
  deleteAsync(
    resource: Resource,
    data?: any,
    callback?: () => object,
  ): Promise<any>;
  optionsAsync(
    resource: Resource,
    data?: any,
    callback?: () => object,
  ): Promise<any>;
}
