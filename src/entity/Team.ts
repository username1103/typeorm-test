import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Director } from "./Director";

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToOne(() => Director, {
    lazy: true,
    cascade: ["insert"],
  })
  @JoinColumn({ name: " director_id" })
  director: Promise<Director>;
}
