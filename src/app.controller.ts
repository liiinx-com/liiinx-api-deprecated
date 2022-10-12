import { Controller, Get } from "@nestjs/common";
import { ConfigurationService } from "./configuration/configuration.service";

@Controller()
export class AppController {
  constructor(private readonly configurationService: ConfigurationService) {}
  @Get()
  root(): string {
    const { name, version } = this.configurationService.getApiInfo();
    return `${name} ${version}`;
  }
}
