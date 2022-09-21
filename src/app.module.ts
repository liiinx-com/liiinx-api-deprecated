import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bull";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { ConfigurationModule } from "./configuration/configuration.module";
import { ConfigurationService } from "./configuration/configuration.service";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
  ],
  controllers: [AppController],
})
export class AppModule {}
