import { Module } from "@nestjs/common";
import { WooCommerceModule } from "src/woo-commerce/woo-commerce.module";
import { UserService } from "./user.service";

@Module({
  imports: [WooCommerceModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
