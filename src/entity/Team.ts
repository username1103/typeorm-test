import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Director } from "./Director";
import { User } from "./User";

@Entity()
export class Team {
  @PrimaryGeneratedColumn({ name: "team_id" })
  id: number;

  @Column()
  name: string;

  @OneToOne(() => Director, {
    lazy: true,
    cascade: ["insert"],
  })
  @JoinColumn({ name: " director_id" })
  director: Promise<Director>;

  @OneToMany(() => User, (user) => user.team, { lazy: true })
  user: Promise<User[]>;
}
