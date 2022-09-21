import { Job, Queue } from "bull";
import { Logger } from "@nestjs/common";
import { InjectQueue, Process, Processor } from "@nestjs/bull";
import { REDIS_MESSENGER_QUEUE } from "src/configuration/constants";

@Processor(REDIS_MESSENGER_QUEUE.name)
export class MessageProcessor {
  constructor() // @InjectQueue(REDIS_MESSENGER_QUEUE.name) // private readonly messengerService: MessengerService,
  // private readonly messengerQueue: Queue,
  {}

  private readonly logger = new Logger(MessageProcessor.name);

  @Process(REDIS_MESSENGER_QUEUE.keys.messageReceived)
  async handleMessage(job: Job) {
    this.logger.debug("[m] messageReceived data = ", JSON.stringify(job.data));
  }
}
