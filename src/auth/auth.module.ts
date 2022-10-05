import { Module } from "@nestjs/common";
import { UserModule } from "src/user/user.module";
import { AuthService } from "./auth.service";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./local.strategy";
import { AuthController } from './auth.controller';

@Module({
  imports: [UserModule, PassportModule], //TODO: separate this or not
  providers: [AuthService, LocalStrategy], controllers: [AuthController],
})
export class AuthModule {}
