import { Module } from "@nestjs/common";
// import { I18nModule } from "nestjs-i18n";
// import { BullModule } from "@nestjs/bull";
// import { BotModule } from "./bot/bot.module";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { ConfigurationModule } from "./configuration/configuration.module";
import { ConfigurationService } from "./configuration/configuration.service";
import { UserModule } from "./user/user.module";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { AddOkToResponseInterceptor } from "./shared/response.interceptor";
// import { ServiceDeskModule } from "./service-desk/service-desk.module";
// import { AuthModule } from "./auth/auth.module";
// import { NotificationModule } from "./notification/notification.module";
import { UserInterceptor } from "./shared/user.interceptor";
// import { WooCommerceModule } from "./woo-commerce/woo-commerce.module";
import { WebsiteModule } from "./website/website.module";
import { Page, Website, WebsitePage } from "./website/entities";
import { User } from "./user/entities/user.entity";

// import { User } from "./user/entities/user.entity";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigurationModule],
      inject: [ConfigurationService],
      useFactory: async (configurationService: ConfigurationService) => ({
        type: "postgres",
        entities: [Website, WebsitePage, Page, User],
        // entities: ["dist/**/*.entity{.ts,.js}"],
        // entities: ["src/**/*.entity{.ts,.js}"], // TODO: src or dist?
        url: configurationService.getPostgresConfig().url,
        synchronize: true, // ! TODO: NO PROD,
        // autoLoadEntities: true,
      }),
    }),
    // I18nModule.forRoot({
    //   fallbackLanguage: "en",
    //   loaderOptions: {
    //     path: path.join(__dirname, "/i18n/"),
    //     watch: true,
    //   },
    // }),
    // BullModule.forRootAsync({
    //   imports: [ConfigurationModule],
    //   useFactory: async (configurationService: ConfigurationService) => {
    //     return {
    //       url: configurationService.getRedisConfig().url,
    //     };
    //   },
    //   inject: [ConfigurationService],
    // }),
    ConfigurationModule,
    // BotModule,
    UserModule,
    // ServiceDeskModule,
    // AuthModule,
    // NotificationModule,
    // WooCommerceModule,
    WebsiteModule,
  ],
  controllers: [AppController],
  providers: [
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: AddOkToResponseInterceptor,
    // },
    {
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor,
    },
  ],
})
export class AppModule {}
