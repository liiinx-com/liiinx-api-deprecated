import { Module } from "@nestjs/common";
import { UserModule } from "src/user/user.module";
import { AuthService } from "./auth.service";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./local.strategy";
import { JwtModule } from "@nestjs/jwt";

import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./jwt.strategy";
import { ConfigurationModule } from "src/configuration/configuration.module";
import { ConfigurationService } from "src/configuration/configuration.service";

@Module({
  imports: [
    UserModule,
    PassportModule,
    ConfigurationModule,
    JwtModule.registerAsync({
      imports: [ConfigurationModule],
      inject: [ConfigurationService],
      useFactory: async (configurationService: ConfigurationService) => {
        const { expiresIn, secret } = configurationService.getJwtConfig();
        return {
          secret,
          signOptions: {
            expiresIn,
          },
        };
      },
    }),
  ], //TODO: separate this or not
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
