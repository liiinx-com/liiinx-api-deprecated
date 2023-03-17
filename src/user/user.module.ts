import { Module } from "@nestjs/common";
import { WooCommerceModule } from "src/woo-commerce/woo-commerce.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "./user.service";
import { User } from "./entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User]), WooCommerceModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
