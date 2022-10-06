import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BullModule } from "@nestjs/bull";
import { queueHelper } from "liiinx-utils";
import {
  ReturnRequest,
  ReturnRequestItem,
} from "./entities/return-request.entity";
import { ReturnsController } from "./returns.controller";
import { ReturnsService } from "./returns.service";
import { ReturnsDomainService } from "./returns.domain.service";
import { ConfigurationModule } from "src/configuration/configuration.module";

@Module({
  imports: [
    ConfigurationModule,
    TypeOrmModule.forFeature([ReturnRequest, ReturnRequestItem]),
    BullModule.registerQueue(
      {
        name: queueHelper.getQueueConfig().returns.queueName,
      },
      {
        name: queueHelper.getQueueConfig().notification.queueName,
      },
      {
        name: queueHelper.getQueueConfig().helpDesk.queueName,
      },
    ),
  ],
  controllers: [ReturnsController],
  providers: [ReturnsService, ReturnsDomainService],
})
export class ReturnsModule {}
