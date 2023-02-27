import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WebsiteService } from "./website.service";
import { WebsiteController } from "./website.controller";

@Module({
  // imports: [TypeOrmModule.forFeature([Content])],
  providers: [WebsiteService],
  controllers: [WebsiteController],
})
export class WebsiteModule {}
