import {
  Controller,
  NotFoundException,
  Req,
  Post,
  Get,
  Query,
  HttpException,
} from "@nestjs/common";
import { Request } from "express";
import { ConfigurationService } from "../configuration/configuration.service";
import { BotUtils } from "./bot.utils";
import { BotService } from "./bot.service";

@Controller("bot")
export class BotController {
  constructor(
    private readonly config: ConfigurationService,
    private readonly botService: BotService,
  ) {}

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
    if (mode && mode === "subscribe" && token && token === verifyToken) {
      return challenge;
    }
    throw new HttpException("INVALID_VERIFY_TOKEN", 403);
  }

  @Post("webhook")
  async post(@Req() req: Request) {
    const body: any = req.body;
    if (!body.object) throw new NotFoundException();
    if (body.object !== "whatsapp_business_account") return "NOT_SUPPORTED";
    // if (!this.validator.validateIncomingWebhook(body).ok)
    //   return "INVALID_WEBHOOK";

    const messages = BotUtils.getMessagesFromWebhook(body);
    const response = await Promise.all(
      messages.map((msg) => this.botService.handleMessage(msg)),
    );
    console.log("==>", response);
    return response;
  }
}
