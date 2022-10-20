import { ConflictException, NotFoundException } from "@nestjs/common";
import { OrderStatus } from "./types";

export class WooUtils {
  static getValidOrderStatusList() {
    return [
      OrderStatus.CANCELLED,
      OrderStatus.COMPLETED,
      OrderStatus.PROCESSING,
      OrderStatus.REFUNDED,
    ];
  }

  static handleFindOneResponse(body: Array<any>) {
    if (body.length > 1) {
      throw new ConflictException("already_exists");
    }
    if (body.length === 0) {
      throw new NotFoundException();
    }
    return body[0];
  }
}
