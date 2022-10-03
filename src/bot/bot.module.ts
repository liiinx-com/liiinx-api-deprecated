import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bull";
import { BotService } from "./bot.service";
import { MessageProcessor } from "./processors/message.processor";
import { REDIS_MESSENGER_QUEUE } from "src/configuration/constants";
import { ConfigurationModule } from "src/configuration/configuration.module";

@Module({
  imports: [
    ConfigurationModule,
    BullModule.registerQueue({ name: REDIS_MESSENGER_QUEUE.name }),
  ],
  providers: [BotService, MessageProcessor],
  exports: [BotService],
})
export class BotModule {}