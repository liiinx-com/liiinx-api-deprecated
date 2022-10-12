import { NewReturnRequestReqDto } from "./dtos/return-request";
import { NewJiraTicketQueueMessage } from "liiinx-utils/dist/jira/types";
import { jiraHelper } from "liiinx-utils";

export class ReturnsUtils {
  static toServiceDeskMessage(
    request: NewReturnRequestReqDto,
  ): NewJiraTicketQueueMessage {
    const { id, items } = request;

    return jiraHelper.getServiceDeskMessage({
      description: `Request id: ${id}`,
      title: `${items.length} items has been received`,
    });
  }
}
