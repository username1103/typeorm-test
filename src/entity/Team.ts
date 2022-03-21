import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Director } from "./Director";

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToOne(() => Director, { lazy: true, cascade: ["insert"] })
  director: Promise<Director>;
}
