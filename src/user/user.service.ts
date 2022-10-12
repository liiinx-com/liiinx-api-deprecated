import { Injectable } from "@nestjs/common";

export type User = any; // TODO: maybe change interfaces to type

@Injectable()
export class UserService {
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
    return this.users.find((user) => user.username === username);
  }
}
