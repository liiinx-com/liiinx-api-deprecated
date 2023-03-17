import { User } from "../user/entities/user.entity";
import { Page, Website, WebsitePage } from "../website/entities";
import { DataSource, DataSourceOptions } from "typeorm";
import { SeederOptions, runSeeders } from "typeorm-extension";

const options: DataSourceOptions & SeederOptions = {
  type: "postgres",
  // database: "lnx_api",
  // host: "192.168.2.15",
  database: "db_test4",
  host: "DA-WS-04.iiroc.ca",
  port: 5432,
  password: "root",
  username: "root",
  // entities: ["src/**/*.entity.ts"],
  // entities: ["dist/**/*.entity.js"],
  entities: [User, Page, Website, WebsitePage],
};

export const dataSource = new DataSource(options);
