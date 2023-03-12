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

  async getByHandle(
    handle: string,
    status = STATUS_LIST.Active,
  ): Promise<Website> {
    return this.websitesRepository.findOneBy({ handle, status });
  }
}
