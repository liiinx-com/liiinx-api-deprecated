import { Injectable } from "@nestjs/common";
import { IncomingMessage } from "./bot.type";

@Injectable()
export class BotUtils {
  static getMessagesFromWebhook(webhook: any): IncomingMessage[] {
    return webhook.entry
      .map(({ id, changes }) =>
        changes.map(({ field, value: { contacts, messages, metadata } }) =>
          messages.map((message) => {
            const { wa_id, profile } = contacts[0];
            const {
              display_phone_number: displayPhoneNumber,
              phone_number_id: phoneNumberId,
            } = metadata;

            return {
              id,
              business: {
                displayPhoneNumber,
                phoneNumberId,
              },
              message,
              customer: {
                customerWhatsappId: wa_id,
                profile,
              },
            } as IncomingMessage;
          }),
        ),
      )
      .flat(2);
  }
}
