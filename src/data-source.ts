import "reflect-metadata";
import { DataSource } from "typeorm";
import { Director } from "./entity/Director";
import { Team } from "./entity/Team";
import { User } from "./entity/User";
import { UserRemoveCascade } from "./entity/UserRemoveCascade";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "test",
  password: "test",
  database: "test",
  synchronize: true,
  logging: true,
  dropSchema: true,
  entities: [User, Team, UserRemoveCascade, Director],
  migrations: [],
  subscribers: [],
  cache: {
    type: "redis",
    options: {
      host: "localhost",
      port: 6379,
    },
    ignoreErrors: true,
  },
});
