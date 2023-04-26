import { Injectable } from "@nestjs/common";
import { Page } from "../entities";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { STATUS_LIST } from "../contants";
import { PageTypes } from "../entities/section-props";

@Injectable()
export class PagesRepository {
  constructor(
    @InjectRepository(Page)
    private pagesRepository: Repository<Page>,
  ) {}

  async getBy(
    type: PageTypes,
    frontendVariantKey: string,
    status = STATUS_LIST.ACTIVE,
  ): Promise<Page> {
    return this.pagesRepository.findOneBy({ type, status, frontendVariantKey });
  }
}
