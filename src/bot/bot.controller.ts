import { Controller, Get, Query, HttpException } from "@nestjs/common";
import { ConfigurationService } from "../configuration/configuration.service";

@Controller("bot")
export class BotController {
  constructor(private readonly config: ConfigurationService) {}

  @Get()
  root(): string {
    return `bot works`;
  }

  @Get("webhook")
  get(
    @Query("hub.mode") mode: string,
    @Query("hub.verify_token") token: string,
    @Query("hub.challenge") challenge: string,
  ) {
    const { verifyToken } = this.config.getBotCredentials();
    console.log(
      "here",
      verifyToken,
      token,
      mode,
      mode === "subscribe" && token === verifyToken,
    );
    if (mode && token) {
      if (mode === "subscribe" && token === verifyToken) {
        return challenge;
      }
    }
    throw new HttpException("INVALID_VERIFY_TOKEN", 403);
  }
}
