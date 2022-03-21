import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Team } from "./Team";

@Entity()
export class UserRemoveCascade {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Team, { lazy: true, cascade: ["remove"] })
  @JoinColumn({ name: "team_id", referencedColumnName: "id" })
  team: Promise<Team>;
}
