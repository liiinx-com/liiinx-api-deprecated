export const API_VERSION = "API_VERSION";
export const API_NAME = "API_NAME";
export const JWT_SECRET = "JWT_SECRET";

export const VERIFY_TOKEN = "VERIFY_TOKEN";
export const FACEBOOK_PAGE_ACCESS_TOKEN = "FACEBOOK_PAGE_ACCESS_TOKEN";

export const POSTGRES_URL = "POSTGRES_URL";
export const REDIS_URL = "REDIS_URL";
export const REDIS_MESSENGER_QUEUE = {
  name: "MESSENGER_QUEUE",
  keys: {
    messageReceived: "message-received",
    postbackReceived: "postback-received",

    sendResponse: "send-response",
    sendSenderAction: "send-sender-action",
  },
};
export const JIRA_CONFIG = {
  HOST: "JIRA_HOST",
  USERNAME: "JIRA_USERNAME",
  TOKEN: "JIRA_TOKEN",
};
