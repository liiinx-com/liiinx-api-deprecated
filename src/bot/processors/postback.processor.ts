import { Job, Queue } from "bull";
import { Logger } from "@nestjs/common";
import { InjectQueue, Process, Processor } from "@nestjs/bull";
import { REDIS_MESSENGER_QUEUE } from "src/configuration/constants";

@Processor(REDIS_MESSENGER_QUEUE.name)
export class MessageProcessor {
  constructor() // @InjectQueue(REDIS_MESSENGER_QUEUE.name)
  // private readonly messengerQueue: Queue,
  {}

  private readonly logger = new Logger(MessageProcessor.name);

  @Process(REDIS_MESSENGER_QUEUE.keys.postbackReceived)
  handlePostback(job: Job) {
    this.logger.debug("[p] postbackReceived data = ", JSON.stringify(job.data));
  }
}
