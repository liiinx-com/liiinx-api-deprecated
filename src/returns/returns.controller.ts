import { Controller, Get } from "@nestjs/common";

@Controller("returns")
export class ReturnsController {
  @Get()
  root(): string {
    return `this is`;
  }
}
