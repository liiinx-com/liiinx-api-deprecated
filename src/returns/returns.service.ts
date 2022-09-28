import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  ReturnRequest,
  ReturnRequestItem,
} from "./entities/return-request.entity";
import { ReturnRequestItemSize } from "./entities/types";

@Injectable()
export class ReturnsService {
  constructor() {} // private readonly returnRequestsRepository: Repository<ReturnRequest>, // @InjectRepository(ReturnRequest)

  seedAdd() {
    const newReq = new ReturnRequest();

    const reqItem = new ReturnRequestItem();
    reqItem.hasOriginalPackaging = true;
    reqItem.needShippingBox = true;
    reqItem.productSize = ReturnRequestItemSize.SMALL;
    reqItem.productUrl = "https://amazon.com/my-product";
    reqItem.retailer = "AMAZON";

    newReq.items = [reqItem];
    newReq.pickupDate = new Date().toISOString();
    newReq.pickupTimeSlotCode = "MORNING";

    // this.returnRequestsRepository.save(newReq);
  }
}
