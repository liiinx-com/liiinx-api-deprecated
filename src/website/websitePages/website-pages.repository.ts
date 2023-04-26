import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { STATUS_LIST } from "../contants";
import { WebsitePage } from "../entities";

@Injectable()
export class WebsitePagesRepository {
  constructor(
    @InjectRepository(WebsitePage)
    private wPagesRepository: Repository<WebsitePage>,
  ) {}

  private async getOnePage(
    wPageCondition: string,
    wPageParams: object,
    handle: string,
    status = STATUS_LIST.ACTIVE,
  ): Promise<WebsitePage> {
    return this.wPagesRepository
      .createQueryBuilder("wPage")
      .innerJoinAndSelect(
        "wPage.website",
        "website",
        "website.handle = :handle",
        { handle },
      )
      .innerJoinAndSelect("wPage.parentPage", "parentPage")
      .where(`wPage.status = :status AND ${wPageCondition}`, {
        status,
        ...wPageParams,
      })
      .getOne();
  }

  async newPage(websitePage: Partial<WebsitePage>): Promise<WebsitePage> {
    return this.wPagesRepository.save(websitePage);
  }

  async getLayout(
    handle: string,
    status = STATUS_LIST.ACTIVE,
  ): Promise<WebsitePage> {
    return this.getOnePage(
      "parentPage.page_type = 'LAYOUT'",
      {},
      handle,
      status,
    );
  }

  async getPage(
    handle: string,
    slug: string,
    status = STATUS_LIST.ACTIVE,
  ): Promise<WebsitePage> {
    return this.getOnePage("wPage.slug = :slug", { slug }, handle, status);
  }
}
