import { Injectable } from "@nestjs/common";
import { Website } from "../entities";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { STATUS_LIST } from "../contants";

@Injectable()
export class WebsitesRepository {
  constructor(
    @InjectRepository(Website)
    private websitesRepository: Repository<Website>,
  ) {}

  async newWebsite(website: Partial<Website>): Promise<Website> {
    return this.websitesRepository.save(website);
  }

  async getByHandle(
    handle: string,
    status = STATUS_LIST.ACTIVE,
  ): Promise<Website> {
    return this.websitesRepository.findOneBy({ handle, status });
  }
}
