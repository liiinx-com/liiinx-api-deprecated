export const getQueueConfig = () => {
  return {
    returns: {
      queueName: "returns-module",
      keys: {
        updateReturnsRequestServiceDeskTicketId:
          "update-returns-request-service-desk-ticket-id",
      },
    },
    helpDesk: {
      queueName: "help-desk",
      keys: {
        createTicket: "create-ticket",
      },
    },
    notification: {
      queueName: "notification",
      keys: {
        sendEmail: "send-email",
      },
    },
  };
};
