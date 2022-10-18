import { Module } from "@nestjs/common";
import { ConfigurationModule } from "src/configuration/configuration.module";
import { WooCommerceUserService } from "./woo-commerce.user.service";

@Module({
  imports: [ConfigurationModule],
  providers: [WooCommerceUserService],
})
export class WooCommerceModule {}
