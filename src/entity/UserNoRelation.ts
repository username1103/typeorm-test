import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserNoRelation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  teamId: number;
}
