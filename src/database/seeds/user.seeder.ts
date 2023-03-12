import { User, UserRole, UserStatus } from "../../user/entities/user.entity";

import { Seeder } from "typeorm-extension";
import { DataSource } from "typeorm";

const mehdiSalamat = {
  email: "mahdi.salamat@gmail.com",
  firstName: "Mahdi",
  lastName: "Salamat",
  roles: [UserRole.USER],
  metadata: {},
  status: UserStatus.ACTIVE,
  timezone: "EST",
};

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(User);
    // await repository.insert([mehdiSalamat]);
  }
}
