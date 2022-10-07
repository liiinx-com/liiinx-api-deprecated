import { Job, Queue } from "bull";
import { Logger } from "@nestjs/common";
import { queueHelper } from "liiinx-utils";
// import { NewJiraTicketQueueMessage } from "liiinx-utils/dist/jira/types";
import { Process, Processor } from "@nestjs/bull";
import { NotificationService } from "./notification.service";
import { SendEmailDto } from "./dtos/send-mail";

@Processor(queueHelper.getQueueConfig().notification.queueName)
export class NotificationProcessor {
  constructor(private readonly notificationService: NotificationService) {}
  private readonly logger = new Logger(NotificationProcessor.name);

  @Process(queueHelper.getQueueConfig().notification.keys.sendEmail)
  async handleMessage(job: Job) {
    console.log("[c] send email job has been received", job.data);

    const mailDto = new SendEmailDto();
    mailDto.to = ["am1hosseinzadeh@gmail.com"];
    mailDto.subject = "Vika is here";
    mailDto.templateData = { fullName: "Amir Zad" };
    mailDto.templateName = "welcome";

    this.notificationService.sendMail(mailDto);
  }
}
