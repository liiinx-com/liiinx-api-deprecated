import { firstValueFrom } from "rxjs";
import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { IncomingMessage } from "./bot.type";
import intents from "./flows/intents.json";
import messageIntentMap from "./flows/message-intent.json";
import { IntentManager } from "./bot.intent-manager";

const TOKEN =
  "EAAPYZCJH2zBwBAMYlfBszP9ZBbOQYlOWEZArXZBPgZADR9PzZAzMm3ChDv0Sj4fCnDeJhLGwL5kW5SjzR2AO6bbb0B9w6CaybZBtZCmXZB93smbB8m768luWyhGg7TaE1R8YiZAtBSuDZBmvnR3fULNzgRHgZBzRobOXHzSLy6UIJsZBVKAqJiRW1sXMPary02XZCyQxcLvZBZCZAz79d6c9WK8Qm3NGZB";

const getOptions = (buttons) => {
  return [{ id: "someGivenId", key: "back", value: "Back" }];
};
let output = {};

@Injectable()
export class BotService {
  private static baseUrl = "https://graph.facebook.com/v15.0/";

  constructor(
    private readonly intentManager: IntentManager,
    private readonly http: HttpService,
  ) {
    this.intentManager.loadAssets({ intents, messageIntentMap });
  }

  async getMessageFromStep(step) {
    let result = "";
    result += step.question;
    result += "\n";
    result += step.options
      .map((option) => `${option.displayValue}. ${option.value}`)
      .join("\n");
    return result;
  }

  async textMessageHandler(receivedMessage: IncomingMessage) {
    const {
      message: {
        text: { body: lastStepInput },
      },
    } = receivedMessage;

    let intent;
    if (!this.intentManager.lastStepKey) {
      intent = this.intentManager.getIntentByMessage(lastStepInput);
      this.intentManager.lastStepKey = intent.firstStepId;
      // console.log("set too ", this.intentManager.lastStepKey);
    } else {
      console.log("  now here to run intent ", this.intentManager.lastStepKey);
      intent = this.intentManager.getIntent(
        this.intentManager.getIntentKeyFromStepKey(
          this.intentManager.lastStepKey,
        ),
      );
    }

    let responseText;
    const validation = this.intentManager.validateResponseForStepId(
      this.intentManager.lastStepKey,
      lastStepInput,
    );
    if (!validation.ok) responseText = "[!] " + validation.errorCode;
    else {
      this.intentManager.lastStepKey = validation.nextStepId;
      output = { ...output, ...validation.response };
    }

    const [question, options] = this.intentManager.run(
      intent,
      this.intentManager.lastStepKey
        ? this.intentManager.lastStepKey
        : intent.firstStepId,
    );
    responseText = question + "\n \n" + options;

    const response = this.getTextMessageFrom({
      text: responseText,
      // text: "1. for a joke " + receivedMessage.customer.profile.name,
      to: receivedMessage.customer.phoneNumber,
      replyingMessageId: receivedMessage.message.id,
    });

    // console.log("00->", response);
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
    //return this.send(getNotSupportedResponse(), {phoneNumberId})

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
  }
}
