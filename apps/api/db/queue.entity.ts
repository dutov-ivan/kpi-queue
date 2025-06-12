import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GroupParticipant } from './group-participant.entity';
import { QueueParticipant } from './queue-participant.entity';

@Entity()
export class Queue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ['Time', 'FIFO', 'Manual'] })
  strategy: string;

  @ManyToMany(() => GroupParticipant, (groupRole) => groupRole.invitations)
  @JoinTable()
  invited: GroupParticipant[];

  @ManyToMany(() => GroupParticipant, (groupRole) => groupRole.declinedFrom)
  @JoinTable()
  declined: GroupParticipant[];

  @OneToMany(
    () => QueueParticipant,
    (queueParticipant) => queueParticipant.queue,
  )
  participants: QueueParticipant[];
}
