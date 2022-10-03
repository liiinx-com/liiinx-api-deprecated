import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
  ReturnRequest,
  ReturnRequestItem,
} from "./entities/return-request.entity";
import { ReturnsController } from "./returns.controller";
import { ReturnsService } from "./returns.service";
import { ReturnsDomainService } from "./returns.domain.service";

@Module({
  imports: [TypeOrmModule.forFeature([ReturnRequest, ReturnRequestItem])],
  controllers: [ReturnsController],
  providers: [ReturnsService, ReturnsDomainService],
})
export class ReturnsModule {}
