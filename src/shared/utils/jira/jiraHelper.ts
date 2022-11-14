import { NewJiraTicketQueueMessage, ServiceDeskMessageParam } from "./types";

export const getServiceDeskMessage = (
  params: ServiceDeskMessageParam,
): NewJiraTicketQueueMessage => {
  const { description, title } = params;
  return { description, title };
};
