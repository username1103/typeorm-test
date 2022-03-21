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

@Entity()
@Index("idx_user_1", ["team"])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  age: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Team, { lazy: true, cascade: true })
  @JoinColumn({ name: "team_id", referencedColumnName: "id" })
  team: Promise<Team>;
}
