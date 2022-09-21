import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { MessengerClient } from "messaging-api-messenger";
import { ConfigurationService } from "src/configuration/configuration.service";

@Injectable()
export class BotService {
  private readonly messengerClient: MessengerClient = new MessengerClient({
    accessToken: this.configurationService.getBotCredentials().accessToken,
  });

  constructor(private readonly configurationService: ConfigurationService) {}

  getClient(): MessengerClient {
    if (!this.messengerClient)
      throw new HttpException(
        "MESSENGER_CLIENT_NOT_INITIALIZED",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    return this.messengerClient;
  }
}
