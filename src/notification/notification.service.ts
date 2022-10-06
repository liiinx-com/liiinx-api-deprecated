import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { SendEmailDto } from "./dtos/send-mail";

@Injectable()
export class NotificationService {
  constructor(private readonly mailerService: MailerService) {}

  sendMail(
    template: string,
    { to, bcc, from, subject }: SendEmailDto,
    templateData: object,
  ): Promise<any> {
    return this.mailerService.sendMail({
      to,
      bcc,
      from,
      subject,
      template,
      context: templateData,
    });
  }
}
