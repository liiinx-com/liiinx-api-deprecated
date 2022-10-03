import { Injectable } from "@nestjs/common";
import { ReturnRequest } from "./entities/return-request.entity";
import { ReturnsService } from "./returns.service";
import { Not } from "typeorm";
import { ReturnRequestStatus } from "./entities/types";
import { NewReturnRequestReqDto } from "./dtos/return-request";
import { ReturnsUtils } from "./returns.utils";

@Injectable()
export class ReturnsDomainService {
  constructor(private readonly returnsService: ReturnsService) {}

  async getActiveRequests(): Promise<ReturnRequest[]> {
    return this.returnsService.getRequests({
      where: { status: Not(ReturnRequestStatus.DELETED) },
    });
  }

  async getDetailedActiveRequests(): Promise<ReturnRequest[]> {
    return this.returnsService.getRequests({
      relations: { items: true },
      where: { status: Not(ReturnRequestStatus.DELETED) },
    });
  }

  async getActiveDetailedRequestById(id: string): Promise<ReturnRequest> {
    return this.returnsService.getRequestById(id, {
      relations: { items: true },
      where: { status: Not(ReturnRequestStatus.DELETED) },
    });
  }

  async createRequest(
    userId: string,
    validatedRequest: NewReturnRequestReqDto,
  ) {
    // 1.persist request
    const newRequest = await this.returnsService.createRequest(
      userId,
      validatedRequest,
    );

    // 2.create service-desk ticket via queue
    const serviceDeskMessage = ReturnsUtils.toServiceDeskMessage({
      ...validatedRequest,
      id: newRequest.id,
    });

    // 3.create order via ordering queue
  }
}
