import { Injectable } from "@nestjs/common";
import { Page } from "../entities";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { STATUS_LIST } from "../contants";

@Injectable()
export class PagesRepository {
  constructor(
    @InjectRepository(Page)
    private pagesRepository: Repository<Page>,
  ) {}

  async getByHandle(
    handle: string,
    status = STATUS_LIST.Active,
  ): Promise<Page> {
    return this.pagesRepository.findOneBy({ status });
  }
}
