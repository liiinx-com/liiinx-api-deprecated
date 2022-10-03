import { dateHelper } from "liiinx-utils";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";
import { NewReturnRequestReqDto } from "./dtos/return-request";
import {
  ReturnRequest,
  ReturnRequestItem,
} from "./entities/return-request.entity";
import { ReturnRequestItemSize, ReturnRequestStatus } from "./entities/types";

@Injectable()
export class ReturnsService {
  constructor(
    @InjectRepository(ReturnRequest)
    private readonly returnRequestsRepository: Repository<ReturnRequest>,
    @InjectRepository(ReturnRequestItem)
    private readonly returnReqItemRepository: Repository<ReturnRequestItem>,
  ) {}

  async getRequests(params?: FindManyOptions): Promise<ReturnRequest[]> {
    return this.returnRequestsRepository.find({
      relations: params.relations,
      where: params.where,
    });
  }

  async getRequestById(
    id: string,
    params: FindOneOptions<ReturnRequest>,
  ): Promise<ReturnRequest> {
    return this.returnRequestsRepository.findOne({
      ...params,
      where: { ...params.where, id },
    });
  }

  async createRequest(
    userId: string,
    validatedRequest: NewReturnRequestReqDto,
  ): Promise<ReturnRequest> {
    const { items, pickupDate, pickupTimeSlot, userNote } = validatedRequest;

    const newReq = new ReturnRequest();

    newReq.pickupDate = dateHelper.toDateString(
      dateHelper.toJsDate(pickupDate),
    ); // TODO: check the value in db and consider TimeZone

    newReq.pickupTimeSlot = pickupTimeSlot;
    newReq.userId = userId;
    newReq.userNote = userNote;
    const newRequest = await this.returnRequestsRepository.save(newReq);

    const newRequestItems = items.map(
      ({
        hasOriginalPackaging,
        needShippingBox,
        productSize,
        productUrl,
        retailer,
      }) =>
        this.returnReqItemRepository.create({
          hasOriginalPackaging,
          needShippingBox,
          productSize,
          productUrl,
          retailer,
          request: newRequest,
        }),
    );

    this.returnReqItemRepository
      .createQueryBuilder()
      .insert()
      .values(newRequestItems)
      .execute();

    return newRequest;
  }

  // async create(requests: ReturnRequest[]) {}

  // private async update(request: ReturnRequest) {}

  // async updateStatusTo(
  //   request: ReturnRequest,
  //   newStatus: ReturnRequestStatus,
  // ) {}

  // async seedAdd() {
  //   const newReq = new ReturnRequest();
  //   newReq.pickupDate = new Date().toISOString();
  //   newReq.pickupTimeSlot = "TIME-SLOT-1";
  //   newReq.userId = "11557";
  //   const res = await this.returnRequestsRepository.save(newReq);

  //   const reqItem = new ReturnRequestItem();
  //   reqItem.hasOriginalPackaging = true;
  //   reqItem.needShippingBox = true;
  //   reqItem.productSize = ReturnRequestItemSize.SMALL;
  //   reqItem.productUrl = "https://amazon.com/my-product";
  //   reqItem.retailer = "AMAZON";
  //   reqItem.request = newReq;
  //   // this.returnReqItemRepository.save(reqItem);
  //   this.returnReqItemRepository
  //     .createQueryBuilder()
  //     .insert()
  //     .values([reqItem])
  //     .execute();

  //   console.log("res", res);
  // }
}
