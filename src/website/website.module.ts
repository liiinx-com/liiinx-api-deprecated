import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WebsiteController } from "./website.controller";
import { Website, Page, WebsitePage } from "./entities";
import { ThemesRepository, ThemesService } from "./themes/";
import { PagesService } from "./pages/";
import { WebsitesRepository, WebsitesService } from "./websites/";
import { WebsitePagesRepository, WebsitePagesService } from "./websitePages";
import { WebsiteService } from "./website.service";
import { WebsiteDataService } from "./websiteData";
import { WebsiteSectionFactory } from "./websitePages/website-sections.factory";
import { PagesRepository } from "./pages/pages.repository";

@Module({
  imports: [TypeOrmModule.forFeature([Website, Page, WebsitePage])],
  providers: [
    WebsitesService,
    WebsitesRepository,
    WebsitesService,
    ThemesRepository,
    ThemesService,
    PagesRepository,
    PagesService,
    WebsitePagesRepository,
    WebsitePagesService,
    WebsiteSectionFactory,
    WebsiteService,
    WebsiteDataService,
  ],
  controllers: [WebsiteController],
})
export class WebsiteModule {}
