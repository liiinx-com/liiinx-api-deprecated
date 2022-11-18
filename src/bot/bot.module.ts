import { Module } from "@nestjs/common";
// import { BullModule } from "@nestjs/bull";
import { BotService } from "./bot.service";
import { HttpModule } from "@nestjs/axios";
import { MessageProcessor } from "./processors/message.processor";
// import { REDIS_MESSENGER_QUEUE } from "src/configuration/constants";
import { ConfigurationModule } from "src/configuration/configuration.module";
import { BotController } from "./bot.controller";
import { BotUtils } from "./bot.utils";
import { IntentManager } from "./bot.intent-manager";

@Module({
  imports: [
    ConfigurationModule,
    HttpModule,
    // BullModule.registerQueue({ name: REDIS_MESSENGER_QUEUE.name }),
  ],
  providers: [BotService, MessageProcessor, BotUtils, IntentManager],
  exports: [BotService],
  controllers: [BotController],
})
export class BotModule {}
