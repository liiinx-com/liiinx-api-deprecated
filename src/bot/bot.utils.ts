import { Injectable } from "@nestjs/common";
import { IncomingMessage } from "./bot.type";

@Injectable()
export class BotUtils {
  static getMessagesFromWebhook(webhook: any): IncomingMessage[] {
    // console.log(JSON.stringify(webhook, null, 2));

    return webhook.entry
      .map(({ id, changes }) =>
        changes.map(
          ({ field, value: { contacts = [], messages = [], metadata } }) =>
            messages.map((message) => {
              const { wa_id, profile } = contacts[0];
              const {
                from,
                display_phone_number: phoneNumber,
                phone_number_id: phoneNumberId,
              } = metadata;

              return {
                id,
                business: {
                  phoneNumber,
                  phoneNumberId,
                },
                message,
                customer: {
                  phoneNumber: wa_id,
                  profile,
                },
              } as IncomingMessage;
            }),
        ),
      )
      .flat(2);
  }
}
