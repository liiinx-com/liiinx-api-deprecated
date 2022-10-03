import { NewReturnRequestReqDto } from "./dtos/return-request";
import { JiraQueueMessage } from "liiinx-utils/dist/jira/types";

export class ReturnsUtils {
  static toServiceDeskMessage(
    request: NewReturnRequestReqDto,
  ): JiraQueueMessage {
    const { id } = request;
    return { description: "", title: "" };
  }
}
