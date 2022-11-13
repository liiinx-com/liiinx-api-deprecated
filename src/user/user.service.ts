import { Injectable } from "@nestjs/common";
import { WooCommerceService } from "src/woo-commerce/woo-commerce.service";

export type User = any; // TODO: maybe change interfaces to type

@Injectable()
export class UserService {
  constructor(private readonly wooCommerceService: WooCommerceService) {}

  private readonly users = [
    {
      userId: 1,
      username: "amir.zad@liiinx.com",
      password: "PASS",
    },
    {
      userId: 2,
      username: "maria",
      password: "guess",
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    // const user = this.wooCommerceService.getCustomerByEmail()
    return this.users.find((user) => user.username === username);
  }
}
