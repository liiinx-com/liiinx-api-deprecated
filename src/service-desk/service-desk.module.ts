import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bull";
import { queueHelper } from "liiinx-utils";
import { ServiceDeskProcessor } from "./service-desk.processor";
import { ServiceDeskService } from "./service-desk.service";
import { ConfigurationModule } from "src/configuration/configuration.module";

@Module({
  imports: [
    ConfigurationModule,
    BullModule.registerQueue({
      name: queueHelper.getQueueConfig().helpDesk.queueName,
    }),
  ],
  providers: [ServiceDeskProcessor, ServiceDeskService],
  // exports: [ServiceDeskService],
})
export class ServiceDeskModule {}
