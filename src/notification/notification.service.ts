import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { SendEmailDto } from "./dtos/send-mail";
import { ConfigurationService } from "src/configuration/configuration.service";

@Injectable()
export class NotificationService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configurationService: ConfigurationService,
  ) {}

  sendMail({
    templateName,
    templateData,
    to,
    bcc,
    from = this.configurationService.getMailConfig().defaultSender,
    subject,
  }: SendEmailDto): Promise<any> {
    return this.mailerService.sendMail({
      to,
      bcc,
      from,
      subject,
      template: templateName,
      context: templateData,
    });
  }
}
