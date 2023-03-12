import { Injectable } from "@nestjs/common";
import { PagesRepository } from "./pages.repository";

@Injectable()
export class PagesService {
  constructor(private readonly pagesRepository: PagesRepository) {}
}
