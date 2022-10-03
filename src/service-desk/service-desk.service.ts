import { Injectable } from "@nestjs/common";
import { NewJiraTicketQueueMessage } from "liiinx-utils/dist/jira/types";
import { ConfigurationService } from "src/configuration/configuration.service";
const JiraClient = require("jira-client");

@Injectable()
export class ServiceDeskService {
  private jiraClient: any;

  constructor(private readonly config: ConfigurationService) {
    console.log("c", config.getApiInfo().name);
  }

  async createJiraTicket(ticketInfo: NewJiraTicketQueueMessage) {
    console.log("ticket info received:", ticketInfo);
  }

  private initJiraClient() {
    if (this.jiraClient) return this.jiraClient;

    // this.jiraClient = new JiraClient({
    //   username: agentUsername,
    //   password: agentPassword,
    //   host,
    //   protocol,
    //   apiVersion,
    //   strictSSL,
    // });
    // };
  }
}
