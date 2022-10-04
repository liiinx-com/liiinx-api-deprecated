export interface ApiInfo {
  name: string;
  version: string;
}

export interface BotCredentials {
  verifyToken: string;
  accessToken: string;
}

export interface RedisConfig {
  url: string;
}

export interface JiraConfig {
  host: string;
  username: string;
  token: string;
  protocol: string;
  apiVersion: string;
  strictSSL: boolean;
}
