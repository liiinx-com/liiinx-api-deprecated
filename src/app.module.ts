import * as path from "path";
import { Module } from "@nestjs/common";
import { I18nModule } from "nestjs-i18n";
import { BullModule } from "@nestjs/bull";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { ConfigurationModule } from "./configuration/configuration.module";
import { ConfigurationService } from "./configuration/configuration.service";
import { BotModule } from './bot/bot.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    I18nModule.forRoot({
      fallbackLanguage: "en",
      loaderOptions: {
        path: path.join(__dirname, "/i18n/"),
        watch: true,
      },
    }),
    BullModule.forRootAsync({
      imports: [ConfigurationModule],
      useFactory: async (configurationService: ConfigurationService) => {
        return {
          url: configurationService.getRedisUrl().url,
        };
      },
      inject: [ConfigurationService],
    }),

    ConfigurationModule,

    BotModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
