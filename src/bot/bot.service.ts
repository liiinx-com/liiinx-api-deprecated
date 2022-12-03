import { firstValueFrom } from "rxjs";
import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { IncomingMessage } from "./bot.type";
import assets from "./assets";
import { IntentService } from "./bot-intent.service";
import { IntentManager } from "./intent-manager";

const TOKEN = "";

@Injectable()
export class BotService {
  private static baseUrl = "https://graph.facebook.com/v15.0/";

  constructor(
    private readonly intentManager: IntentManager,
    private readonly intentService: IntentService,
    private readonly http: HttpService,
  ) {
    this.intentManager.loadAssets({ intentsObject: assets.intents });
  }

  async textMessageHandler(
    userId: number,
    receivedMessage: IncomingMessage,
  ): Promise<any> {
    const {
      customer: { profile },
      message: {
        text: { body: receivedInput },
      },
      customer: {
        profile: { name },
      },
    } = receivedMessage;

    const responses = await this.intentManager.processTextMessageForUserV2(
      userId,
      {
        user: { id: userId, name: profile.name },
        text: receivedInput,
      },
    );

    console.log("--responses");

    return responses.map((r: any) =>
      this.getTextMessageFrom({
        text: r.response,
        to: receivedMessage.customer.phoneNumber,
        replyingMessageId: receivedMessage.message.id,
      }),
    );
  }

  getTextMessageFrom({
    to,
    text,
    replyingMessageId = null,
    previewUrl = false,
  }): any {
    const result: any = {
      type: "text",
      to,
      text: { body: text, preview_url: previewUrl },
    };
    if (replyingMessageId) result.context = { message_id: replyingMessageId };
    return result;
  }

  async handleMessage(receivedMessage: IncomingMessage) {
    const {
      customer: { phoneNumber },
      business: { phoneNumberId },
      message: { type },
    } = receivedMessage;

    const { id: userId } = await this.intentService.getUserByPhone(phoneNumber);

    let responses: any[];
    if (type === "text")
      responses = await this.textMessageHandler(userId, receivedMessage);
    // console.log("via", responses);
    if (responses) {
      return this.send(
        responses.map(
          (r: any) =>
            ({
              data: r,
              phoneNumberId,
            } as WhatsappResponse),
        ),
      );
    }

    return Promise.resolve("NOT_SUPPORTED_MESSAGE_TYPE");
  }

  private getUrl({ phoneNumberId }) {
    return BotService.baseUrl + phoneNumberId + "/messages";
  }

  private getHeaders() {
    return {
      Authorization: "Bearer " + TOKEN,
    };
  }

  async send(responses: WhatsappResponse[]) {
    const headers = this.getHeaders();
    const result = [];

    for (const response of responses) {
      const { data, phoneNumberId, recipient_type } = response;
      const updatedPayload = {
        ...data,
        recipient_type,
        messaging_product: "whatsapp",
      };

      console.log("sending => ", JSON.stringify(updatedPayload, null, 2));
      result.push(
        firstValueFrom(
          this.http.post(this.getUrl({ phoneNumberId }), updatedPayload, {
            headers,
          }),
        ),
      );
    }
    return result;
  }
}

export class WhatsappResponse {
  data: object;
  recipient_type?: string = "individual";
  phoneNumberId: string;
}
