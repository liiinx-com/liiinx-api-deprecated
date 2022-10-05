import { Injectable } from "@nestjs/common";
import { NewJiraTicketQueueMessage } from "liiinx-utils/dist/jira/types";
import { ConfigurationService } from "src/configuration/configuration.service";
import JiraClient from "jira-client";
import { JiraUtils } from "./service-desk.utils";
import { ServiceDeskPriority, WorkManagementIssueType } from "./constants";

@Injectable()
export class ServiceDeskService {
  private jiraClient: JiraClient;

  constructor(private readonly config: ConfigurationService) {
    this.initJiraClient();
  }

  async createJiraTicket(ticketInfo: NewJiraTicketQueueMessage) {
    console.log("ticket info received:", ticketInfo);
    const { description, title } = ticketInfo;

    const params = JiraUtils.getIssue({
      description,
      summary: title,
      isSubTask: false,
      issueTypeId: WorkManagementIssueType.TASK,
      assigneeId: "631f6d48ce3e476e42ac13f2",
      labels: ["Label_1"],
      priorityId: ServiceDeskPriority.MEDIUM,
      projectKey: "TEST",
      reportedId: "631f6d48ce3e476e42ac13f2",
    });
    const newIssue = await this.jiraClient.addNewIssue(params);
    console.log("newIssue", newIssue);
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
