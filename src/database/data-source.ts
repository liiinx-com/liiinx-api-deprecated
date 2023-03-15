import { DataSource, DataSourceOptions } from "typeorm";
import { SeederOptions, runSeeders } from "typeorm-extension";

const options: DataSourceOptions & SeederOptions = {
  type: "postgres",
  // database: "lnx_api",
  // host: "192.168.2.15",
  database: "db_test2",
  host: "DA-WS-04.iiroc.ca",
  port: 5432,
  password: "root",
  username: "root",
  entities: ["dist/**/*.entity.js"],
};

export const dataSource = new DataSource(options);
