// import { firstValueFrom } from "rxjs";
// import { HttpService } from "@nestjs/axios";
// import { Injectable } from "@nestjs/common";
// import { IncomingMessage } from "./bot.type";
// import intents from "./flows/intents.json";
// import messageIntentMap from "./flows/message-intent.json";
// import { IntentManager } from "./bot.intent-manager";

// const TOKEN =
//   "EAAPYZCJH2zBwBAKBZAdAyor9arSMonK57yW5g559qngKRNPrMM9OMzPwe18oux7nZCtORDcsNQaoSPfFo00p705eGeJm2DWSxUzIH5635RYTVkakOUagTdVFYFNIZAavL19623j6DT3E7RKajOCnTb0SZBWZBZCidaPtWTYAYzP0SDDUTWUu1ZCMXF4llj4gDmqfoSGmZB71kX0RcS06bV7ZB5";

// const getOptions = (buttons) => {
//   return [{ id: "someGivenId", key: "back", value: "Back" }];
// };

// //==========USER==========
// const db = {}


// const resetOutputValueFor = async (userId: string) => {
    
// }

// const getUserByPhoneNumber = async (phoneNumber: string) => { 
// return {
//   id: phoneNumber
// }
//  }

// //==========USER==========

// @Injectable()
// export class BotService {
//   private static baseUrl = "https://graph.facebook.com/v15.0/";

//   constructor(
//     // private readonly intentManager: IntentManager,
//     private readonly http: HttpService,
//   ) {
//     // this.intentManager.loadAssets({ intentsObject: intents });
//   }

//   async getMessageFromStep(step: any) {
//     let result = "";
//     result += step.question;
//     result += "\n";
//     result += step.options
//       .map((option) => `${option.displayValue}. ${option.value}`)
//       .join("\n");
//     return result;
//   }

//   async handleStepsCompleted({ intent, userId }) {
//     console.log(`[!] intent ${intent.id} completed!`);
//     // console.log("[!] here is the payload => ", payload);

//     // output = {};

//     return { type: "SWITCH_TO_STEP_ID", response: "new_return_order*1" };
//     // return "Namaki";
//   }

  

//   async textMessageHandler(receivedMessage: IncomingMessage) {
//     const {
//       customer:{phoneNumber},
//       message: {
//         text: { body: receivedInput },
//       },
//     } = receivedMessage;

    

//     // 0. Get active stepId for User
//     const {id: userId} = await getUserByPhoneNumber(phoneNumber)
//     const {activeStepId: userActiveStepId } = await this.intentManager.getUserIntentInfo(userId)
    

//     // 1. process the input based on the active step
//     const {
//       ok: validationOk,
//       nextStepId,
//       intent,
//       response: validatedResponse,
//       stepsCompleted,
//       errorCode,
//     } = this.intentManager.processResponseForStepId(
//       userActiveStepId,
//       receivedInput,
//     );
//     console.log("[i] validation result", validationOk);
//     if (validationOk) {
//       await this.intentManager.updateUserOutput(userId, userActiveStepId,validatedResponse )
//       console.log("[!] activeStepId = ", userActiveStepId);
//     }

//     let responseText = "";
//     if (stepsCompleted) {
//       const { type, response } = await this.handleStepsCompleted({
//         userId,
//         intent,
//       });

//       if (type === "SWITCH_TO_STEP_ID") {
//         // this.intentManager.activeStepId = response;
//         // const [question, options] = this.intentManager.getMenuItemFor(response);
//         // responseText = question + "\n \n" + options;
//       } else {
//         responseText = response;
//       }
//     } else {
//       //
//       const [question, options] = this.intentManager.getMenuItemFor(nextStepId);
//       responseText = question + "\n \n" + options;
//     }

//     const response = this.getTextMessageFrom({
//       text: responseText,
//       // text: "1. for a joke " + receivedMessage.customer.profile.name,
//       to: receivedMessage.customer.phoneNumber,
//       replyingMessageId: receivedMessage.message.id,
//     });

//     // console.log("00->", response);
//     return response;
//   }

//   getTextMessageFrom({
//     to,
//     text,
//     replyingMessageId = null,
//     previewUrl = false,
//   }): any {
//     const result: any = {
//       type: "text",
//       to,
//       text: { body: text, preview_url: previewUrl },
//     };
//     if (replyingMessageId) result.context = { message_id: replyingMessageId };
//     return result;
//   }

//   async handleMessage(receivedMessage: IncomingMessage) {
//     const {
//       business: { phoneNumberId },
//       message: { type },
//     } = receivedMessage;

//     // const messageHandlers = new Map()
//     // messageHandlers.set("text", this.textMessageHandler)
//     let response: any;
//     if (type === "text")
//       response = await this.textMessageHandler(receivedMessage);
//     if (response) return this.send(response, { phoneNumberId });
//     //return this.send(getNotSupportedResponse(), {phoneNumberId})

//     return Promise.resolve("NOT_SUPPORTED_MESSAGE_TYPE");
//   }

//   private getUrl({ phoneNumberId }) {
//     return BotService.baseUrl + phoneNumberId + "/messages";
//   }

//   private getHeaders() {
//     return {
//       Authorization: "Bearer " + TOKEN,
//     };
//   }

//   async send(data: object, { phoneNumberId, recipient_type = "individual" }) {
//     const updatedPayload = {
//       ...data,
//       recipient_type,
//       messaging_product: "whatsapp",
//     };

//     console.log("sending => ", JSON.stringify(updatedPayload, null, 2));
//     const headers = this.getHeaders();
//     return firstValueFrom(
//       this.http.post(this.getUrl({ phoneNumberId }), updatedPayload, {
//         headers,
//       }),
//     );
//   }
// }
