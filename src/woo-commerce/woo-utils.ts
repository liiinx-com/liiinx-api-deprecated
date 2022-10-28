import { ConflictException, NotFoundException } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import {
  HandleFindOneResponseOptions,
  Order,
  OrderLineItem,
  OrderStatus,
} from "./types";

export class WooUtils {
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

    return result;
  }

  static enrichOrder(order: Order): Order {
    const result = {
      ...order,
      total: order.currencySymbol + order.total,
    } as Order;

    return result;
  }
}
