import {
  Controller,
  Post,
  Get,
  Param,
  ParseUUIDPipe,
  ParseIntPipe,
  Body,
  UseGuards,
  Put,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common";
import {
  NewReturnRequestReqDto,
  ReturnRequestResDto,
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
import { plainToClass } from "class-transformer";

@Controller("returns")
export class ReturnsController {
  user = { id: 4 };

  constructor(private readonly returnsDomainService: ReturnsDomainService) {}

  // @UseGuards(JwtAuthGuard)
  @Get()
  // async getAll(@User() user: RequestUser): Promise<ReturnRequest[]> {
  async getUserRequests(@User() user: RequestUser) {
    console.log("user==>", this.user.id);
    return this.returnsDomainService.getRequestsByUserId(this.user.id);
  }

  @Get(":id")
  async getByUserRequestById(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<ReturnRequest> {
    //TODO check for the owner
    return this.returnsDomainService.getActiveDetailedRequestById(id);
  }

  @Post()
  async newReturnRequest(
    @Body() returnRequestDto: NewReturnRequestReqDto,
    @User() user: RequestUser,
  ): Promise<ReturnRequestResDto> {
    const newRequest = await this.returnsDomainService.newRequest(
      this.user.id,
      returnRequestDto,
    );

    return plainToClass(ReturnRequestResDto, newRequest, {
      excludeExtraneousValues: true,
    });
  }

  //TODO: just by ADMIN
  // @Put(":id")
  // async updateReturnRequest(
  //   @Param("id", ParseUUIDPipe) id: string,
  //   @User() user: RequestUser,
  //   @Body() returnRequestDto: UpdateReturnsRequestReqDto,
  // ): Promise<ReturnRequest> {
  //   const updatingRequest =
  //     await this.returnsDomainService.getActiveDetailedRequestById(id);
  //   if (!updatingRequest) throw new NotFoundException();
  //   const updateResult = await this.returnsDomainService.updateRequest(
  //     id,
  //     returnRequestDto,
  //   );
  //   if (!updateResult) throw new InternalServerErrorException();
  //   return this.returnsDomainService.getActiveDetailedRequestById(id);
  // }

  //TODO: Add proper authorization
  // TODO: check if item is available
  // @Put("items/:itemId")
  // async updateReturnRequestItemStatus(
  //   @Param("itemId", ParseUUIDPipe) itemId: string,
  //   @User() user: RequestUser,
  //   @Body() returnRequestDto: UpdateReturnRequestReqItemDto,
  // ): Promise<ReturnRequestItem> {
  //   const updatingRequestItem =
  //     await this.returnsDomainService.getRequestItemById(itemId);
  //   if (!updatingRequestItem) throw new NotFoundException();

  //   return this.returnsDomainService.updateRequestItem(
  //     itemId,
  //     returnRequestDto,
  //   );
  // }
}
