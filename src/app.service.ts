import { Injectable } from "@nestjs/common";
import pkg from "../package.json";

@Injectable()
export class AppService {
  getApiInfo(): string {
    return `${pkg.name} ${pkg.version}`;
  }
}
