import { firstValueFrom } from "rxjs";
import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { IncomingMessage } from "./bot.type";
import intents from "./flows/intents.json";
import { IntentManager } from "./bot.intent-manager";
import { IntentService } from "./bot-intent.service";

const TOKEN =
  "EAAPYZCJH2zBwBAGbBS384iH2wDTmOTXOhZCcJ7AGMnJVJGFNDNo4ikpku4INhUZAu77YQSAnZABt34NeANkwfNArQB8r6Nx61P0XsHnpHyRwq2ZCJMbjmMlC00xaGlmW2M27lLY1LSF6kWoK2sLJdr5e1er8DWnmJt3AVJKojxR3xfmA2AZCIJcFhyZAwSDZAGZCePkGxCbg6y2Jq4ZAbXWnMA";

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

    const activeStepId = userStepId
      ? userStepId
      : this.intentManager.fallbackStepId;
    console.log(
      `User ${userId} active stepId = `,
      // this.intentManager.activeStepId,
      activeStepId,
    );

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

    let responseText;
    const { isIntentComplete, nextStep } =
      await this.intentManager.getNextStepFor(activeStepId);
    await this.intentService.updateActiveIntentFor(userId, {
      output: validatedResponse,
      stepId: nextStep.id,
    });

    if (isIntentComplete) {
      const { output } = await this.intentService.getUserActiveIntentInfo(
        userId,
      );
      const additionalParams = null;
      const { stepId } = await this.intentManager.processCompletedIntent(
        intent,
        output,
        additionalParams,
      );
      const [question, options] = this.intentManager.getMenuItemFor(stepId);
      responseText = question + "\n \n" + options;
    } else {
      const [question, options] = this.intentManager.getMenuItemFor(
        nextStep.id,
      );
      responseText = question + "\n \n" + options;
    }

    // .update user active step AND accumulated output
    // .if intent is completed

    // const [question, options] = this.intentManager.getMenuItemFor(nextStepId);
    // responseText = question + "\n \n" + options;

    // if (stepsCompleted) {
    //   const { type, response } = await this.handleStepsCompleted({
    //     intent,
    //     payload: output,
    //   });

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
