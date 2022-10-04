import {
  Controller,
  Post,
  Get,
  Param,
  ParseUUIDPipe,
  Body,
} from "@nestjs/common";
import { ServiceDeskService } from "src/service-desk/service-desk.service";
import {
  NewReturnRequestReqDto,
  NewReturnRequestResDto,
} from "./dtos/return-request";
import { ReturnRequest } from "./entities/return-request.entity";
import { ReturnsDomainService } from "./returns.domain.service";

@Controller("returns")
export class ReturnsController {
  constructor(
    private readonly returnsDomainService: ReturnsDomainService,
    private readonly serviceDeskService: ServiceDeskService,
  ) {}

  @Get()
  async getAll(): Promise<ReturnRequest[]> {
    return this.returnsDomainService.getActiveRequests();
  }

  @Get(":id")
  async getById(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<ReturnRequest> {
    const item = await this.returnsDomainService.getActiveDetailedRequestById(
      id,
    );
    this.serviceDeskService.createJiraTicket({
      title: item.id,
      description: item.id,
    });
    return item;
  }

  @Post()
  async placeReturnRequest(
    @Body() returnRequestDto: NewReturnRequestReqDto,
  ): Promise<NewReturnRequestResDto> {
    const userId = "11557";
    this.returnsDomainService.createRequest(userId, returnRequestDto);

    return { ...returnRequestDto, created_at: "dkdk" };
  }
}
