import { Injectable } from "@nestjs/common";
import { NewJiraTicketQueueMessage } from "liiinx-utils/dist/jira/types";
import { ConfigurationService } from "src/configuration/configuration.service";
import JiraClient from "jira-client";

@Injectable()
export class ServiceDeskService {
  private jiraClient: JiraClient;

  constructor(private readonly config: ConfigurationService) {
    this.initJiraClient();
  }

  async createJiraTicket(ticketInfo: NewJiraTicketQueueMessage) {
    console.log("ticket info received:", ticketInfo);
    // const newIssue = await this.jiraClient.addNewIssue({});
    // console.log("newIssue", newIssue);
  }

  private initJiraClient() {
    if (this.jiraClient) return this.jiraClient;
    const { apiVersion, host, protocol, strictSSL, token, username } =
      this.config.getJiraConfig();
    this.jiraClient = new JiraClient({
      password: token,
      username,
      host,
      protocol,
      apiVersion,
      strictSSL,
    });
  }
}
