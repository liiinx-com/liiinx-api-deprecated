import {
  Controller,
  Post,
  Get,
  Param,
  ParseUUIDPipe,
  Body,
  Request,
  UseGuards,
} from "@nestjs/common";
import {
  NewReturnRequestReqDto,
  NewReturnRequestResDto,
} from "./dtos/return-request";
import { ReturnRequest } from "./entities/return-request.entity";
import { ReturnsDomainService } from "./returns.domain.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RequestUser, User } from "src/shared/user.decorator";

@Controller("returns")
export class ReturnsController {
  constructor(private readonly returnsDomainService: ReturnsDomainService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(@User() user: RequestUser): Promise<ReturnRequest[]> {
    console.log("req.user==>", user.id);
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
    @User() user: RequestUser,
  ): Promise<NewReturnRequestResDto> {
    this.returnsDomainService.createRequest(user.id, returnRequestDto);

    return { ...returnRequestDto, created_at: "dkdk" }; //TODO: create_at?!!
  }
}
