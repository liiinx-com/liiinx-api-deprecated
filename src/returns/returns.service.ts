import { dateHelper } from "liiinx-utils";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";
import {
  NewReturnRequestReqDto,
  UpdateReturnsRequestReqDto,
} from "./dtos/return-request";
import {
  ReturnRequest,
  ReturnRequestItem,
} from "./entities/return-request.entity";

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
    params?: FindOneOptions<ReturnRequest>,
  ): Promise<ReturnRequest> {
    return this.returnRequestsRepository.findOne({
      ...(params ? params : {}),
      where: { ...(params?.where ? params.where : {}), id },
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

    await this.returnReqItemRepository
      .createQueryBuilder()
      .insert()
      .values(newRequestItems)
      .execute();

    return newRequest;
  }

  async update(
    id: string,
    validatedRequest: UpdateReturnsRequestReqDto,
  ): Promise<ReturnRequest> {
    const { pickupDate, pickupTimeSlot, userNote } = validatedRequest;

    const updateResult = await this.returnRequestsRepository.update(id, {
      pickupDate: dateHelper.toDateString(dateHelper.toJsDate(pickupDate)),
      pickupTimeSlot,
      userNote,
    });
    if (updateResult) return this.getRequestById(id);
    return null;
  }
}
