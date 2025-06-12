import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { GroupParticipant } from './group-participant.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  avatar?: string;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @OneToMany(() => GroupParticipant, (groupRole) => groupRole.user)
  groupParticipantAccounts: GroupParticipant[];
}
