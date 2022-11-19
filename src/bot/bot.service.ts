import { firstValueFrom } from "rxjs";
import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { IncomingMessage } from "./bot.type";
import intents from "./flows/intents.json";
import { IntentManager } from "./bot.intent-manager";
import { IntentService } from "./bot-intent.service";

const TOKEN =
  "EAAPYZCJH2zBwBABUtDnRlKbMXoJLUbPj5o7IarZCMxX3gVg8iK5AZCxLYfP8HKApeCv7OFb7Ne4nz5CKGMVuZBCnMngIWGmizGf03dBCHk3SB7Et0yZCuZAExPUmdvbBKXdYIqlMbDcqf8KRlu2ypZBqtrL4ZCdhCZBVTOb6CqXUzdrjitxCNCGRQlaxWsLkGxubrZBw938mr8uZAsiAQx6jeI8";

const getOptions = (buttons) => {
  return [{ id: "someGivenId", key: "back", value: "Back" }];
};
let output = {};

@Injectable()
export class BotService {
  private static baseUrl = "https://graph.facebook.com/v15.0/";

  constructor(
    private readonly intentManager: IntentManager,
    private readonly intentService: IntentService,
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

  async textMessageHandler(userId: number, receivedMessage: IncomingMessage) {
    const {
      message: {
        text: { body: receivedInput },
      },
    } = receivedMessage;

    const { stepId: userStepId } =
      await this.intentService.getUserActiveIntentInfo(userId);

    // 0. user active stepId
    const activeStepId = userStepId
      ? userStepId
      : this.intentManager.fallbackStepId;

    // 1. validate input for step regardless of user
    const {
      ok: validationOk,
      intent,
      response: validatedResponse,
      errorCode,
    } = await this.intentManager.validateInputForStepId(
      activeStepId,
      receivedInput,
    );
    console.log("[i] validation result", validationOk);

    if (!validationOk) {
      const [question, options] =
        this.intentManager.getMenuItemFor(activeStepId);
      return this.getTextMessageFrom({
        text: question + "\n \n" + options,
        to: receivedMessage.customer.phoneNumber,
        replyingMessageId: receivedMessage.message.id,
      });
    }

    await this.intentService.updateActiveIntentFor(userId, {
      changes: validatedResponse,
    });

    let responseText;
    let nextStepId;
    const { isIntentComplete, nextStep } =
      await this.intentManager.getNextStepFor(activeStepId);

    if (isIntentComplete) {
      const { output } = await this.intentService.getUserActiveIntentInfo(
        userId,
      );
      const additionalParams = null;
      console.log("----------output", output);
      const { stepId } = await this.intentManager.processCompletedIntent(
        intent,
        output,
        additionalParams,
      );
      nextStepId = stepId;
      await this.intentService.resetUserOutput(userId);
      await this.intentService.updateActiveIntentFor(userId, {
        stepId: nextStepId,
      });
      const [question, options] = this.intentManager.getMenuItemFor(nextStepId);
      responseText = question + "\n \n" + options;
    } else {
      console.log("------------next", nextStep);
      nextStepId = nextStep.id;
      const [question, options] = this.intentManager.getMenuItemFor(
        nextStep.id,
      );
      responseText = question + "\n \n" + options;
    }
    await this.intentService.updateActiveIntentFor(userId, {
      stepId: nextStepId,
    });

    //   if (type === "SWITCH_TO_STEP_ID") {
    //     this.intentManager.activeStepId = response;
    //     const [question, options] = this.intentManager.getMenuItemFor(response);
    //     responseText = question + "\n \n" + options;
    //   } else {
    //     responseText = response;
    //   }
    // } else {
    //   const [question, options] = this.intentManager.getMenuItemFor(nextStepId);
    //   responseText = question + "\n \n" + options;
    // }

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
      customer: { phoneNumber },
      business: { phoneNumberId },
      message: { type },
    } = receivedMessage;

    const { id: userId } = await this.intentService.getUserByPhone(phoneNumber);

    let response: any;
    if (type === "text")
      response = await this.textMessageHandler(userId, receivedMessage);
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
