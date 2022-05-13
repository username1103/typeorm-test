import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { TeamNoRelation } from "./TeamNoRelation";

@Entity()
export class UserNoRelation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  teamId: number;
}
