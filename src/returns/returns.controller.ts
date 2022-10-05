import {
  Controller,
  Post,
  Get,
  Param,
  ParseUUIDPipe,
  Body,
  UseGuards,
} from "@nestjs/common";
import { ServiceDeskService } from "src/service-desk/service-desk.service";
import {
  NewReturnRequestReqDto,
  NewReturnRequestResDto,
} from "./dtos/return-request";
import { ReturnRequest } from "./entities/return-request.entity";
import { ReturnsDomainService } from "./returns.domain.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller("returns")
export class ReturnsController {
  constructor(private readonly returnsDomainService: ReturnsDomainService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(): Promise<ReturnRequest[]> {
    return this.returnsDomainService.getActiveRequests();
  }

  @Get(":id")
  async getById(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<ReturnRequest> {
    return this.returnsDomainService.getActiveDetailedRequestById(id);
  }

  @Post()
  async placeReturnRequest(
    @Body() returnRequestDto: NewReturnRequestReqDto,
  ): Promise<NewReturnRequestResDto> {
    const userId = "11557"; //TODO: fix this
    this.returnsDomainService.createRequest(userId, returnRequestDto);

    return { ...returnRequestDto, created_at: "dkdk" };
  }
}
