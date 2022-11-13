import { InternalServerErrorException } from "@nestjs/common";
import {
  NewReturnRequestReqDto,
  NewReturnRequestReqItemDto,
} from "./dtos/return-request";
import {
  Retailer,
  ReturnRequestItemProductType,
  ReturnRequestItemSize,
  ReturnRequestItemStatus,
} from "./entities/types";
import { ReturnRequestResDto } from "./dtos/return-request";
import { NewJiraTicketQueueMessage } from "src/shared/utils/jira/types";
import { jira, dateHelper } from "src/shared/utils";
import {
  NewOrder,
  Order,
  OrderLineItem,
  OrderMetaData,
  ProductType,
} from "src/woo-commerce/types";
import { plainToClass } from "class-transformer";
import {
  ReturnRequest,
  ReturnRequestItem,
  ReturnRequestShippingBox,
} from "./entities/return-request.entity";

export enum ReturnOrderMetadata {}

export enum ReturnPackageItemMetadata {
  USER_NOTE = "Note",
  PICKUP_DATE = "Pickup Date",
  PICKUP_TIME_SLOT = "Pickup Time",
  PRODUCT_URL = "Product URL",
  NEED_SHIPPING_BOX = "Need Shipping Box",
}

export class ReturnsUtils {
  public static readonly PACKAGE_RETURN_AMAZON_SMALL_PRODUCT_ID = 85;
  public static readonly PACKAGE_RETURN_WALMART_SMALL_PRODUCT_ID = 86;
  public static readonly PACKAGE_RETURN_BOX_SMALL_PRODUCT_ID = 95;

  static getComplementaryProductIdFor(
    item: NewReturnRequestReqItemDto,
  ): number {
    const { productSize, needShippingBox } = item;
    if (needShippingBox && productSize === ReturnRequestItemSize.SMALL)
      return this.PACKAGE_RETURN_BOX_SMALL_PRODUCT_ID;
  }

  private static shippingBoxMapper(i: OrderLineItem): ReturnRequestShippingBox {
    return {
      productId: i.productId,
      price: i.price,
      quantity: i.quantity,
      productSize: ReturnsUtils.getShippingBoxSizeFromProductId(i.productId),
      productType: ReturnRequestItemProductType.ShippingBox,
    } as ReturnRequestShippingBox;
  }

  private static returnPackageMapper(i: OrderLineItem): ReturnRequestItem {
    const [productSize, retailer] =
      ReturnsUtils.getSizeAndRetailerFromProductId(i.productId);
    return {
      productId: i.productId,
      productType: ReturnsUtils.getProductTypeFromId(i.productId),
      needShippingBox: ReturnsUtils.extractFromMetadataList(
        i.metaData,
        ReturnPackageItemMetadata.NEED_SHIPPING_BOX,
      ),
      productUrl: ReturnsUtils.extractFromMetadataList(
        i.metaData,
        ReturnPackageItemMetadata.PRODUCT_URL,
      ),
      retailer,
      status: ReturnRequestItemStatus.NOT_SET,
      productSize,
      userNote: ReturnsUtils.extractFromMetadataList(
        i.metaData,
        ReturnPackageItemMetadata.USER_NOTE,
      ),
      price: i.price,
      quantity: i.quantity,
    } as ReturnRequestItem;
  }

  static getProductIdFor(item: NewReturnRequestReqItemDto): number {
    const { productSize, retailer } = item;
    if (
      productSize === ReturnRequestItemSize.SMALL &&
      retailer === Retailer.AMAZON
    )
      return ReturnsUtils.PACKAGE_RETURN_AMAZON_SMALL_PRODUCT_ID;

    if (
      productSize === ReturnRequestItemSize.SMALL &&
      retailer === Retailer.WALMART
    )
      return ReturnsUtils.PACKAGE_RETURN_WALMART_SMALL_PRODUCT_ID;

    throw new InternalServerErrorException("product_variation_error");
  }

  static toServiceDeskMessage(
    request: ReturnRequestResDto,
  ): NewJiraTicketQueueMessage {
    const { id, items } = request;

    return jira.helper.getServiceDeskMessage({
      description: `Request id: ${id}`,
      title: `${items.length} items has been received`,
    });
  }

  static mapReturnRequestToNewOrder(
    returnRequest: NewReturnRequestReqDto,
  ): NewOrder {
    const { items, pickupDate, pickupTimeSlot, userNote, couponCode } =
      returnRequest;

    const result = new NewOrder();
    result.userNote = userNote;
    if (couponCode) result.couponCodes = [couponCode.toUpperCase()];

    // order metaData
    // nothing for now

    // lineItems > main items
    const lineItems = items.map((i) => {
      const item = new OrderLineItem();
      item.productId = this.getProductIdFor(i);
      item.metaData.push(
        {
          key: ReturnPackageItemMetadata.NEED_SHIPPING_BOX,
          value: i.needShippingBox ? "YES" : "NO",
        },
        {
          key: ReturnPackageItemMetadata.PICKUP_DATE,
          value: dateHelper.jsDateToString(pickupDate),
        },
        {
          key: ReturnPackageItemMetadata.PICKUP_TIME_SLOT,
          value: pickupTimeSlot,
        },
      );
      if (i.userNote) {
        item.metaData.push({
          key: ReturnPackageItemMetadata.USER_NOTE,
          value: i.userNote,
        });
      }
      if (i.productUrl) {
        item.metaData.push({
          key: ReturnPackageItemMetadata.PRODUCT_URL,
          value: i.productUrl,
        });
      }
      return item;
    });

    // lineItems > complementary items > shipping box
    const complementaryShippingBoxItems = items
      .filter((i) => i.needShippingBox)
      .map((i) => {
        const item = new OrderLineItem();
        item.productId = ReturnsUtils.getComplementaryProductIdFor(i);
        return item;
      });

    // lineItems
    result.lineItems = [...lineItems, ...complementaryShippingBoxItems];

    return result;
  }

  static getSizeAndRetailerFromProductId(productId: number) {
    if (productId === ReturnsUtils.PACKAGE_RETURN_AMAZON_SMALL_PRODUCT_ID)
      return [ReturnRequestItemSize.SMALL, Retailer.AMAZON];

    if (productId === ReturnsUtils.PACKAGE_RETURN_WALMART_SMALL_PRODUCT_ID)
      return [ReturnRequestItemSize.SMALL, Retailer.WALMART];

    return [ReturnRequestItemSize.NOT_SET, Retailer.NOT_SET];
  }

  static getShippingBoxSizeFromProductId(productId: number) {
    if (productId === ReturnsUtils.PACKAGE_RETURN_BOX_SMALL_PRODUCT_ID)
      return ReturnRequestItemSize.SMALL;

    return [ReturnRequestItemSize.NOT_SET];
  }

  static getProductTypeFromId(productId: number): ReturnRequestItemProductType {
    const packageReturnServiceProductIds = [
      ReturnsUtils.PACKAGE_RETURN_AMAZON_SMALL_PRODUCT_ID,
      ReturnsUtils.PACKAGE_RETURN_WALMART_SMALL_PRODUCT_ID,
    ];
    const boxProductIds = [ReturnsUtils.PACKAGE_RETURN_BOX_SMALL_PRODUCT_ID];

    if (packageReturnServiceProductIds.includes(productId))
      return ReturnRequestItemProductType.ReturnPackage;
    if (boxProductIds.includes(productId))
      return ReturnRequestItemProductType.ShippingBox;
    return ReturnRequestItemProductType.NOT_SET;
  }

  static mapOrderToReturnRequest(order: Order): ReturnRequest {
    const result = plainToClass(ReturnRequest, order, {
      excludeExtraneousValues: true,
    });
    console.log("order", order);

    result.items = order.lineItems
      .filter((i) => i.productType === ProductType.PACKAGE_RETURNS)
      .map((i: OrderLineItem) => {
        const productType = ReturnsUtils.getProductTypeFromId(i.productId);
        const mappers = {
          returnPackage: ReturnsUtils.returnPackageMapper,
          shippingBox: ReturnsUtils.shippingBoxMapper,
        };
        return mappers[productType](i);
      });

    return result;
  }

  private static extractFromMetadataList(
    metadata: OrderMetaData[],
    key: string,
    defaultValue?: any,
  ): any {
    const item: { key: string; value: string } = metadata.find(
      ({ key: k }) => k === key,
    );
    if (item) return item.value;
    return defaultValue ? defaultValue : null;
  }
}
