import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { Team } from "./Team";

@Entity({ name: "user" })
@Index("idx_user_1", ["team"])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Team, (team) => team.user, {
    lazy: true,
    cascade: true,
  })
  @JoinColumn({ name: "team_id" })
  team: Promise<Team>;
}
