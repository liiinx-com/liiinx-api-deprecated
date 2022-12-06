import { catchError, firstValueFrom } from "rxjs";
import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { IncomingMessage } from "./bot.type";
import assets from "./assets";
import { IntentService } from "./bot-intent.service";
import { IntentManager } from "./intent-manager";

const TOKEN = "";

const listInteractiveObject = {
  type: "list",
  header: {
    type: "text",
    text: "Select the food item you would like",
  },
  body: {
    text: "You will be presented with a list of options to choose from",
  },
  footer: {
    text: "All of them are freshly packed",
  },
  action: {
    button: "Order",
    sections: [
      {
        title: "Section 1 - Fruit",
        rows: [
          {
            id: "1",
            title: "Apple",
            description: "Dozen",
          },
          {
            id: "2",
            title: "Orange",
            description: "Dozen",
          },
        ],
      },
      {
        title: "Section 2 - Vegetables",
        rows: [
          {
            id: "3",
            title: "Spinach",
            description: "1kg ",
          },
          {
            id: "2",
            title: "Broccoli",
            description: "1kg",
          },
        ],
      },
    ],
  },
};

const sampleInteractiveMsg = ({ to }) => ({
  to,
  type: "interactive",
  interactive: {
    type: "button",
    body: {
      text: "optional body text",
    },
    footer: {
      text: "optional footer text",
    },
    action: {
      buttons: [
        {
          type: "reply",
          reply: {
            id: "BUTTON_ID_1",
            title: "TITLE_1",
          },
        },
        {
          type: "reply",
          reply: {
            id: "BUTTON_ID_3",
            title: "TITLE_3",
          },
        },
        {
          type: "reply",
          reply: {
            id: "BUTTON_ID_2",
            title: "TITLE_2",
          },
        },
      ],
    },
  },
});

@Injectable()
export class BotService {
  private static baseUrl = "https://graph.facebook.com/v15.0/";
  private readonly logger = new Logger(BotService.name);

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

    return responses.map((r: any) =>
      this.getTextMessageFrom({
        text: r.response,
        to: receivedMessage.customer.phoneNumber,
        // replyingMessageId: receivedMessage.message.id, //TODO: replying to message
      }),
    );
  }

  getTextMessageFrom({
    to,
    text,
    replyingMessageId = null,
    previewUrl = false,
    interactiveMessage = true,
  }): any {
    if (interactiveMessage)
      return {
        to,
        type: "interactive",
        interactive: listInteractiveObject,
      };

    const result: any = {
      type: "text",
      to,
      text: {
        body: text,
        footer: "test footer",
        header: {
          type: "text",
          text: "header-content",
        },
        preview_url: previewUrl,
      },
    };
    if (replyingMessageId && false)
      result.context = { message_id: replyingMessageId };
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
            new WhatsappResponse({
              data: r,
              phoneNumberId,
            }),
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

      const { data: responseData } = await firstValueFrom(
        this.http
          .post(this.getUrl({ phoneNumberId }), updatedPayload, {
            headers,
          })
          .pipe(
            catchError((error: any) => {
              this.logger.error(error.response.data);
              throw "An error happened!";
            }),
          ),
      );
      result.push(responseData);
    }

    return result;
  }
}

export class WhatsappResponse {
  data: object;
  recipient_type: string;
  phoneNumberId: string;
  constructor(params) {
    const { data, phoneNumberId } = params;
    this.data = data;
    this.phoneNumberId = phoneNumberId;
    this.recipient_type = "individual";
  }
}
