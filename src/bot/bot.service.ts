import { firstValueFrom } from "rxjs";
import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { IncomingMessage } from "./bot.type";
import intents from "./flows/intents.json";
import { IntentManager } from "./bot.intent-manager";
import { IntentService } from "./bot-intent.service";

const TOKEN =
  "EAAPYZCJH2zBwBAAI3tZBU4RaQZAXJ4Moe3mVximkYBxgxNFvAi50xBz6sKHfzapKCe9npqNxDVVCuiYrKZCBxuJWCZBx1kIeaLGNAyD9veZBgYSTGamh7losqgnXtraJCuVfxd7H47sjWfgbkZCVD9EBX1kVZBpBoHdhtaBS1nDZAOXZBwHsI9ZCOI8GH6awb5EmQDfUT5AcsOUHBNDpWyJJTRP";

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

  async textMessageHandler(userId: number, receivedMessage: IncomingMessage) {
    const {
      message: {
        text: { body: receivedInput },
      },
      customer: {
        profile: { name },
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
    } = await this.intentManager.validateInputForStep(
      activeStepId,
      receivedInput,
    );
    console.log("[i] validation result", validationOk);

    const messageGeneratorParams = { name };

    if (!validationOk) {
      const [question, options] = await this.intentManager.getMenuItemFor(
        activeStepId,
        messageGeneratorParams,
      );
      return this.getTextMessageFrom({
        text: question + "\n \n" + options,
        to: receivedMessage.customer.phoneNumber,
        replyingMessageId: receivedMessage.message.id,
      });
    }

    await this.intentService.updateActiveIntentFor(userId, {
      changes: validatedResponse,
    });

    let responseText: string;
    let nextStepId: string;
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
      const [question, options] = await this.intentManager.getMenuItemFor(
        nextStepId,
        messageGeneratorParams,
      );
      responseText = question + "\n \n" + options;
    } else {
      console.log("------------next", nextStep.id);
      nextStepId = nextStep.id;
      const [question, options] = await this.intentManager.getMenuItemFor(
        nextStep.id,
        messageGeneratorParams,
      );
      responseText = question + "\n \n" + options;
    }
    await this.intentService.updateActiveIntentFor(userId, {
      stepId: nextStepId,
    });

    const response = this.getTextMessageFrom({
      text: responseText,
      to: receivedMessage.customer.phoneNumber,
      replyingMessageId: receivedMessage.message.id,
    });

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
