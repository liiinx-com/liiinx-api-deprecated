import {
  Controller,
  Post,
  Get,
  Param,
  ParseUUIDPipe,
  Body,
  Request,
  UseGuards,
  Put,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common";
import {
  NewReturnRequestReqDto,
  NewReturnRequestResDto,
  UpdateReturnRequestReqItemDto,
  UpdateReturnsRequestReqDto,
} from "./dtos/return-request";
import {
  ReturnRequest,
  ReturnRequestItem,
} from "./entities/return-request.entity";
import { ReturnsDomainService } from "./returns.domain.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RequestUser, User } from "src/shared/decorators/user.decorator";
import { PickupTimeSlot } from "./entities/types";
import { WooCommerceService } from "src/woo-commerce/woo-commerce.service";

@Controller("returns")
export class ReturnsController {
  constructor(
    private readonly returnsDomainService: ReturnsDomainService,
    private readonly wooCommerceUserService: WooCommerceService,
  ) {}

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

  //TODO: just by ADMIN
  @Put(":id")
  async updateReturnRequest(
    @Param("id", ParseUUIDPipe) id: string,
    @User() user: RequestUser,
    @Body() returnRequestDto: UpdateReturnsRequestReqDto,
  ): Promise<ReturnRequest> {
    const updatingRequest =
      await this.returnsDomainService.getActiveDetailedRequestById(id);
    if (!updatingRequest) throw new NotFoundException();
    const updateResult = await this.returnsDomainService.updateRequest(
      id,
      returnRequestDto,
    );
    if (!updateResult) throw new InternalServerErrorException();
    return this.returnsDomainService.getActiveDetailedRequestById(id);
  }

  //TODO: Add proper authorization
  // TODO: check if item is available
  @Put("items/:itemId")
  async updateReturnRequestItemStatus(
    @Param("itemId", ParseUUIDPipe) itemId: string,
    @User() user: RequestUser,
    @Body() returnRequestDto: UpdateReturnRequestReqItemDto,
  ): Promise<ReturnRequestItem> {
    const updatingRequestItem =
      await this.returnsDomainService.getRequestItemById(itemId);
    if (!updatingRequestItem) throw new NotFoundException();

    return this.returnsDomainService.updateRequestItem(
      itemId,
      returnRequestDto,
    );
  }
}
