import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TeamNoRelation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
