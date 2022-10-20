import { Module } from "@nestjs/common";
import { ConfigurationModule } from "src/configuration/configuration.module";
import { WooCommerceService } from "./woo-commerce.service";

@Module({
  imports: [ConfigurationModule],
  providers: [WooCommerceService],
  exports: [WooCommerceService],
})
export class WooCommerceModule {}
