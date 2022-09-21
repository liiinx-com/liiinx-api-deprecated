import { Controller, Get } from "@nestjs/common";
import pkg from "../package.json";

@Controller()
export class AppController {
  @Get()
  root(): string {
    return `${pkg.name} ${pkg.version}`;
  }
}
