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
