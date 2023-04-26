import { Injectable } from "@nestjs/common";
import { PagesRepository } from "./pages.repository";
import { PageTypes } from "../entities/section-props";

@Injectable()
export class PagesService {
  constructor(private readonly pagesRepository: PagesRepository) {}
  async getBy(pageType: PageTypes, variant: string) {
    return this.pagesRepository.getBy(pageType, variant);
  }
}
