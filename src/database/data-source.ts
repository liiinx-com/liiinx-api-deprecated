import { DataSource, DataSourceOptions } from "typeorm";
import { SeederOptions, runSeeders } from "typeorm-extension";
import { User } from "../user/entities/user.entity";

const options: DataSourceOptions & SeederOptions = {
  type: "postgres",
  database: "lnx_api",
  host: "localhost",
  port: 5432,
  password: "root",
  username: "root",
  // entities: [User],
  entities: ["src/**/*.entity{.ts,.js}"],

  seeds: ["src/database/seeds/**/*{.ts,.js}"],
  factories: ["src/database/factories/**/*{.ts,.js}"],
};

export const dataSource = new DataSource(options);
(async () => {
  const dataSource = new DataSource(options);
  await dataSource.initialize();

  console.log("000000000000000000000");

  runSeeders(dataSource, {
    seeds: ["src/database/seeds/**/*{.ts,.js}"],
  });
})();
