import { Injectable } from "@nestjs/common";
import {
  ReturnRequest,
  ReturnRequestItem,
} from "./entities/return-request.entity";
import { Not } from "typeorm";
import { ReturnRequestItemStatus, ReturnRequestStatus } from "./entities/types";
import {
  NewReturnRequestReqDto,
  ReturnRequestResDto,
  UpdateReturnRequestReqItemDto,
  UpdateReturnsRequestReqDto,
} from "./dtos/return-request";
import { ReturnsUtils } from "./returns.utils";
import { Queue } from "bull";
import { InjectQueue } from "@nestjs/bull";
import { queueHelper } from "liiinx-utils";
import { ReturnsItemService } from "./return-item.service";
import { WooCommerceService } from "src/woo-commerce/woo-commerce.service";

// TODO: move this types to Utils
import { NewOrder, Order } from "src/woo-commerce/types";

@Injectable()
export class ReturnsDomainService {
  constructor(
    private readonly returnItemService: ReturnsItemService,
    private readonly wooCommerceService: WooCommerceService,
    @InjectQueue(queueHelper.getQueueConfig().helpDesk.queueName)
    private readonly helpDeskQueue: Queue,
    @InjectQueue(queueHelper.getQueueConfig().notification.queueName) //TODO: this is for test: remove this later
    private readonly notificationQueue: Queue,
  ) {}

  async getRequestsByUserId(userId: number): Promise<ReturnRequest[]> {
    const orders: Order[] = await this.wooCommerceService.getOrdersByCustomerId(
      userId,
    );
    return orders.map(ReturnsUtils.mapOrderToReturnRequest);
  }

  async getRequestItemById(id: number): Promise<ReturnRequestItem> {
    return this.returnItemService.getRequestById(id, {
      where: { status: Not(ReturnRequestItemStatus.DELETED) },
    });
  }

  async getDetailedActiveRequests(): Promise<ReturnRequest[]> {
    // return this.returnsService.getRequests({
    //   relations: { items: true },
    //   where: { status: Not(ReturnRequestStatus.DELETED) },
    // });
    return null;
  }

  // async updateRequest(
  //   id: string,
  //   validatedRequest: UpdateReturnsRequestReqDto,
  // ): Promise<ReturnRequest> {
  //   // return this.returnsService.update(id, validatedRequest);
  //   return null;
  // }

  // async updateRequestItem(
  //   id: string,
  //   validatedRequest: UpdateReturnRequestReqItemDto,
  // ): Promise<ReturnRequestItem> {
  //   return this.returnItemService.update(id, validatedRequest);
  // }

  async getActiveDetailedRequestById(id: number): Promise<ReturnRequest> {
    const order = await this.wooCommerceService.getOrderById(id);
    return ReturnsUtils.mapOrderToReturnRequest(order);
  }

  async newRequest(userId: number, validatedRequest: NewReturnRequestReqDto) {
    // validate coupon if sent
    if (validatedRequest.couponCode) {
      const coupon = await this.wooCommerceService.getCouponByCode(
        validatedRequest.couponCode,
      );
      console.log("coupon", coupon);
    }

    const customer = await this.wooCommerceService.getCustomerById(userId);
    const newOrder: NewOrder =
      ReturnsUtils.getNewOrderFromReturnRequest(validatedRequest);
    newOrder.userId = userId;
    newOrder.shippingInfo = customer.shipping;

    // 1. send order
    const saveOrder = await this.wooCommerceService.newOrder(newOrder);

    return saveOrder;

    // 2. add order tags and persist it using saveOrder.id

    // 3. create service-desk ticket via queue
    // const serviceDeskMessage = ReturnsUtils.toServiceDeskMessage({
    //   ...validatedRequest,
    //   id: newRequest.id,
    // });
    // this.helpDeskQueue.add(
    //   queueHelper.getQueueConfig().helpDesk.keys.createTicket,
    //   serviceDeskMessage,
    // );
  }
}
