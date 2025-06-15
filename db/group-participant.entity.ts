import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Group } from './group.entity';
import { Queue } from './queue.entity';
import { QueueParticipant } from './queue-participant.entity';

@Entity()
@Unique(['user', 'group'])
export class GroupParticipant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ['Admin', 'Participant'] })
  role: string;

  @ManyToOne(() => User, (user) => user.groupParticipantAccounts)
  user: Relation<User>;

  @ManyToOne(() => Group, (group) => group.groupParticipants)
  group: Group;

  @ManyToMany(() => Queue, (queue) => queue.invited)
  invitations: Queue[];

  @ManyToMany(() => Queue, (queue) => queue.declined)
  declinedFrom: Queue[];

  @OneToMany(
    () => QueueParticipant,
    (queueParticipant) => queueParticipant.groupParticipant,
  )
  queueParticipants: QueueParticipant[];
}
