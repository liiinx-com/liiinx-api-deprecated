import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  ApiInfo,
  BotCredentials,
  RedisConfig,
} from "./configuration.interface";
import {
  FACEBOOK_PAGE_ACCESS_TOKEN,
  API_NAME,
  API_VERSION,
  VERIFY_TOKEN,
  REDIS_URL,
  POSTGRES_URL,
} from "./constants";

@Injectable()
export class ConfigurationService {
  constructor(private readonly configService: ConfigService) {}

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
}