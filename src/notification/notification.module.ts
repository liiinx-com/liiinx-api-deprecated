import { Module } from "@nestjs/common";
import { ConfigurationModule } from "src/configuration/configuration.module";
import { NotificationProcessor } from "./notification.processor";
import { NotificationService } from "./notification.service";
import { MailerModule } from "@nestjs-modules/mailer";
import { ConfigurationService } from "src/configuration/configuration.service";
import { PugAdapter } from "@nestjs-modules/mailer/dist/adapters/pug.adapter";
import path from "path";
import { queueHelper } from "src/shared/utils";
import { BullModule } from "@nestjs/bull";

@Module({
  imports: [
    ConfigurationModule,
    // BullModule.registerQueue({
    //   name: queueHelper.getQueueConfig().notification.queueName,
    // }),

    MailerModule.forRootAsync({
      imports: [ConfigurationModule],
      inject: [ConfigurationService],
      useFactory: async (configurationService: ConfigurationService) => {
        const { host, password, username } =
          configurationService.getMailConfig();

        return {
          transport: {
            host,
            auth: {
              user: username,
              pass: password,
            },
          },
          template: {
            dir: path.join(__dirname, "templates"),
            adapter: new PugAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
  providers: [NotificationService, NotificationProcessor],
})
export class NotificationModule {}
