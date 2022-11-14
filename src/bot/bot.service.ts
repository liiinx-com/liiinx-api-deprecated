import { Injectable } from "@nestjs/common";
import { ConfigurationService } from "src/configuration/configuration.service";
import { IncomingMessage } from "./bot.type";

@Injectable()
export class BotService {
  constructor(private readonly configurationService: ConfigurationService) {}

  async textMessageHandler(receivedMessage: IncomingMessage) {
    const supportedMessages: string[] = [];

    return receivedMessage.customer.profile.name;
  }

  async handleMessage(receivedMessage: IncomingMessage) {
    const type = receivedMessage.message.type;
    if (type === "text") {
      return this.textMessageHandler(receivedMessage);
    }

    return Promise.reject("NOT_SUPPORTED_MESSAGE_TYPE");
  }
}
