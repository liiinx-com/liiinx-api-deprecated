import { ConflictException, NotFoundException } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import {
  HandleFindOneResponseOptions,
  Order,
  OrderLineItem,
  OrderStatus,
  ProductType,
} from "./types";

export class WooUtils {
  static getProductTypeByLineItemId(lineItemId: number): ProductType {
    const packageReturnProductIds = [85, 86, 95]; // from WooCommerce

    if (packageReturnProductIds.includes(lineItemId))
      return ProductType.PACKAGE_RETURNS;
    return ProductType.UNKNOWN;
  }

  static getValidOrderStatusList() {
    return [
      OrderStatus.CANCELLED,
      OrderStatus.COMPLETED,
      OrderStatus.PROCESSING,
      OrderStatus.REFUNDED,
      OrderStatus.PENDING,
    ];
  }

  static handleFindOneResponse(
    body: Array<any>,
    options?: HandleFindOneResponseOptions,
  ) {
    if (body.length > 1) {
      throw new ConflictException("already_exists");
    }
    if (body.length === 0) {
      throw new NotFoundException(
        options.notFoundMsg ? options.notFoundMsg : undefined,
      );
    }
    return body[0];
  }

  static mapWooOrderToOrder(wooOrder: any): Order {
    const result = WooUtils.enrichOrder(
      plainToClass(Order, wooOrder, {
        excludeExtraneousValues: true,
      }),
    );

    result.lineItems = result.lineItems.map(
      (i) =>
        ({
          ...i,
          productType: WooUtils.getProductTypeByLineItemId(i.productId),
        } as OrderLineItem),
    );

    return result;
  }

  static enrichOrder(order: Order): Order {
    const result = {
      ...order,
      total: order.currencySymbol + order.total,
      itemsTotal:
        order.currencySymbol +
        (Number(order.total) - Number(order.totalTax)).toString(),
      totalTax: order.currencySymbol + order.totalTax,
    } as Order;

    return result;
  }
}
