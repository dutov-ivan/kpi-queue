import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { GroupParticipant } from './group-participant.entity';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 250 })
  name: string;

  @OneToMany(() => GroupParticipant, (groupRole) => groupRole.group)
  groupParticipants: GroupParticipant[];
}
