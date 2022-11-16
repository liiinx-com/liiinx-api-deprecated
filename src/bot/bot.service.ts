import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { ConfigurationService } from "src/configuration/configuration.service";
import { IncomingMessage } from "./bot.type";

const TOKEN =
  "EAAPYZCJH2zBwBAIXaZBBBPBYmiZBuZAeRVCYTo3FWLzLlaFzXJrpxqkCWbC1QKAlvwOEPK51CmnmMggoNyLn0QoNWMTZAnpG78NNpzJZBapvMwJ4WoMNjT9TzN5kBPQHRuCOUhGM2v7QMaLSCuRFCA9ai5eugypfn2EWSuCWFO1MDBIrL5X6oQuYOIJGgluSpL3sJ3TpFBnIQmj69iVbaF";

@Injectable()
export class BotService {
  private static baseUrl = "https://graph.facebook.com/v15.0/";

  constructor(
    // private readonly configurationService: ConfigurationService,
    private readonly http: HttpService,
  ) {}

  async textMessageHandler(receivedMessage: IncomingMessage) {
    // const supportedMessages: string[] = [];
    const response = this.getTextMessageFrom({
      text: "Hi " + receivedMessage.customer.profile.name,
      to: receivedMessage.customer.phoneNumber,
      replyingMessageId: receivedMessage.message.id,
    });

    console.log("00->", response);
    return response;
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
      business: { phoneNumberId },
      message: { type },
    } = receivedMessage;

    let response: any;
    if (type === "text")
      response = await this.textMessageHandler(receivedMessage);
    if (response) return this.send(response, { phoneNumberId });

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

  async send(data: object, { phoneNumberId, recipient_type = "individual" }) {
    const updatedPayload = {
      ...data,
      recipient_type,
      messaging_product: "whatsapp",
    };

    console.log("sending => ", JSON.stringify(updatedPayload, null, 2));
    const headers = this.getHeaders();
    return firstValueFrom(
      this.http.post(this.getUrl({ phoneNumberId }), updatedPayload, {
        headers,
      }),
    );

    // console.log("----", res);
  }
}
