import "reflect-metadata";
import { DataSource } from "typeorm";
import { Director } from "./entity/Director";
import { Team } from "./entity/Team";
import { TeamNoRelation } from "./entity/TeamNoRelation";
import { User } from "./entity/User";
import { UserEntity } from "./entity/UserEntity";
import { UserNoRelation } from "./entity/UserNoRelation";
import { UserRemoveCascade } from "./entity/UserRemoveCascade";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "test",
  password: "test",
  database: "test",
  synchronize: true,
  logging: false,
  dropSchema: true,
  entities: [
    User,
    Team,
    UserRemoveCascade,
    Director,
    UserNoRelation,
    TeamNoRelation,
    UserEntity,
  ],
  migrations: [],
  subscribers: [],
  // cache: {
  //   type: "redis",
  //   options: {
  //     host: "localhost",
  //     port: 6379,
  //   },
  //   ignoreErrors: true,
  // },
});
