import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  ApiInfo,
  BotCredentials,
  JiraConfig,
  JwtConfig,
  MailConfig,
  RedisConfig,
} from "./configuration.interface";
import {
  FACEBOOK_PAGE_ACCESS_TOKEN,
  API_NAME,
  API_VERSION,
  VERIFY_TOKEN,
  REDIS_URL,
  POSTGRES_URL,
  JIRA_CONFIG,
  JWT_SECRET,
  MAIL_CONFIG,
} from "./constants";

@Injectable()
export class ConfigurationService {
  constructor(private readonly configService: ConfigService) {}

  getJwtConfig(): JwtConfig {
    return {
      secret: this.configService.get<string>(JWT_SECRET),
      expiresIn: "15m",
    };
  }

  getApiInfo(): ApiInfo {
    return {
      name: this.configService.get<string>(API_NAME),
      version: this.configService.get<string>(API_VERSION),
    };
  }

  getBotCredentials(): BotCredentials {
    return {
      verifyToken: this.configService.get<string>(VERIFY_TOKEN),
      accessToken: this.configService.get<string>(FACEBOOK_PAGE_ACCESS_TOKEN),
    };
  }

  getRedisConfig(): RedisConfig {
    return { url: this.configService.get<string>(REDIS_URL) };
  }

  getPostgresConfig(): RedisConfig {
    return { url: this.configService.get<string>(POSTGRES_URL) };
  }

  getJiraConfig(): JiraConfig {
    return {
      token: this.configService.get<string>(JIRA_CONFIG.TOKEN),
      username: this.configService.get<string>(JIRA_CONFIG.USERNAME),
      host: this.configService.get<string>(JIRA_CONFIG.HOST),
      apiVersion: "2",
      protocol: "https",
      strictSSL: true,
    };
  }

  getMailConfig(): MailConfig {
    return {
      host: this.configService.get<string>(MAIL_CONFIG.HOST),
      password: this.configService.get<string>(MAIL_CONFIG.PASSWORD),
      username: this.configService.get<string>(MAIL_CONFIG.USERNAME),
      defaultSender: this.configService.get<string>(MAIL_CONFIG.DEFAULT_SENDER),
    };
  }
}
