import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WebsiteService } from "./website.service";
import { WebsiteController } from "./website.controller";
import { Website, Page, Theme, WebsitePage } from "./entities";

@Module({
  imports: [TypeOrmModule.forFeature([Website, Page, Theme, WebsitePage])],
  providers: [WebsiteService],
  controllers: [WebsiteController],
})
export class WebsiteModule {}
