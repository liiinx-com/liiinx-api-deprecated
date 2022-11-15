import { Injectable } from "@nestjs/common";
import { ConfigurationService } from "src/configuration/configuration.service";
import { IncomingMessage } from "./bot.type";

@Injectable()
export class BotService {
  constructor(private readonly configurationService: ConfigurationService) {}

  async textMessageHandler(receivedMessage: IncomingMessage) {
    const supportedMessages: string[] = [];

    return receivedMessage.customer.profile.name;
  }

  async handleMessage(receivedMessage: IncomingMessage) {
    const type = receivedMessage.message.type;
    if (type === "text") {
      return this.textMessageHandler(receivedMessage);
    }

    return Promise.reject("NOT_SUPPORTED_MESSAGE_TYPE");
  }

  async sendWhatsappResponse(senderPsid: string, response: any) {
    // The page access token we have generated in your app settings
    const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

    // Construct the message body
    const requestBody = {
      recipient: {
        id: senderPsid,
      },
      message: response,
    };

    // Send the HTTP request to the Messenger Platform
    request(
      {
        uri: "https://graph.facebook.com/v2.6/me/messages",
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: "POST",
        json: requestBody,
      },
      (err, _res, _body) => {
        if (!err) {
          console.log("Message sent!");
        } else {
          console.error("Unable to send message:" + err);
        }
      },
    );
  }
}
