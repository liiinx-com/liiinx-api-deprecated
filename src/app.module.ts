import * as path from "path";
import { Module } from "@nestjs/common";
import { I18nModule } from "nestjs-i18n";
import { BullModule } from "@nestjs/bull";
import { BotModule } from "./bot/bot.module";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { ConfigurationModule } from "./configuration/configuration.module";
import { ConfigurationService } from "./configuration/configuration.service";
import { ReturnsModule } from "./returns/returns.module";
import { UserModule } from "./user/user.module";
import { User } from "./user/entities/user.entity";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigurationModule],
      inject: [ConfigurationService],
      useFactory: async (configurationService: ConfigurationService) => ({
        type: "postgres",
        entities: ["dist/**/*.entity{.ts,.js}"],
        url: configurationService.getPostgresConfig().url,
        synchronize: true,
      }),
    }),
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
          url: configurationService.getRedisConfig().url,
        };
      },
      inject: [ConfigurationService],
    }),
    ConfigurationModule,
    BotModule,
    ReturnsModule,
    UserModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
