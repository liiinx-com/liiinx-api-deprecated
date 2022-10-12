import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, Repository } from "typeorm";
import { UpdateReturnRequestReqItemDto } from "./dtos/return-request";
import { ReturnRequestItem } from "./entities/return-request.entity";

@Injectable()
export class ReturnsItemService {
  constructor(
    @InjectRepository(ReturnRequestItem)
    private readonly returnReqItemRepository: Repository<ReturnRequestItem>,
  ) {}

  async getRequestById(
    id: string,
    params?: FindOneOptions<ReturnRequestItem>,
  ): Promise<ReturnRequestItem> {
    return this.returnReqItemRepository.findOne({
      ...(params ? params : {}),
      where: { ...(params?.where ? params.where : {}), id },
    });
  }

  async update(
    id: string,
    validatedRequest: UpdateReturnRequestReqItemDto,
  ): Promise<ReturnRequestItem> {
    const updateResult = await this.returnReqItemRepository.update(
      id,
      validatedRequest,
    );
    if (updateResult) return this.getRequestById(id);
    return null;
  }
}
