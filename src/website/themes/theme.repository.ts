import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { STATUS_LIST } from "../contants";
// import { Theme } from "../entities";

@Injectable()
export class ThemesRepository {
  constructor() // @InjectRepository(Theme)
  // private themesRepository: Repository<Theme>,
  {}
}
