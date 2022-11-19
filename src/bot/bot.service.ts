import { firstValueFrom } from "rxjs";
import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { IncomingMessage } from "./bot.type";
import intents from "./flows/intents.json";
import messageIntentMap from "./flows/message-intent.json";
import { IntentManager } from "./bot.intent-manager";

const TOKEN =
  "EAAPYZCJH2zBwBAKBZAdAyor9arSMonK57yW5g559qngKRNPrMM9OMzPwe18oux7nZCtORDcsNQaoSPfFo00p705eGeJm2DWSxUzIH5635RYTVkakOUagTdVFYFNIZAavL19623j6DT3E7RKajOCnTb0SZBWZBZCidaPtWTYAYzP0SDDUTWUu1ZCMXF4llj4gDmqfoSGmZB71kX0RcS06bV7ZB5";

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
    this.intentManager.loadAssets({ intentsObject: intents });
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

  async handleStepsCompleted({ intent, payload }) {
    console.log(`[!] intent ${intent.id} completed`);
    console.log("[!] here is the payload => ", payload);

    output = {};

    return { type: "SWITCH_TO_STEP_ID", response: "new_return_order*1" };
    // return "Namaki";
  }

  async textMessageHandler(receivedMessage: IncomingMessage) {
    const {
      message: {
        text: { body: receivedInput },
      },
    } = receivedMessage;

    console.log("ACTIVE STEP ID = ", this.intentManager.activeStepId);

    // 1. process the input based on the active step
    const {
      ok: validationOk,
      nextStepId,
      intent,
      response: validatedResponse,
      stepsCompleted,
      errorCode,
    } = this.intentManager.processResponseForStepId(
      this.intentManager.activeStepId,
      receivedInput,
    );
    console.log("[i] validation result", validationOk);
    if (validationOk) {
      output = { ...output, ...validatedResponse };
      console.log("[!] activeStepId = ", this.intentManager.activeStepId);
    }

    let responseText;
    if (stepsCompleted) {
      const { type, response } = await this.handleStepsCompleted({
        intent,
        payload: output,
      });

      if (type === "SWITCH_TO_STEP_ID") {
        this.intentManager.activeStepId = response;
        const [question, options] = this.intentManager.getMenuItemFor(response);
        responseText = question + "\n \n" + options;
      } else {
        responseText = response;
      }
    } else {
      const [question, options] = this.intentManager.getMenuItemFor(nextStepId);
      responseText = question + "\n \n" + options;
    }

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
