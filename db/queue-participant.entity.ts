import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { Queue } from './queue.entity';
import { GroupParticipant } from './group-participant.entity';

@Entity()
export class QueueParticipant {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  acceptedAt: Date;

  @ManyToOne(() => Queue, (queue) => queue.participants)
  queue: Relation<Queue>;

  @ManyToOne(
    () => GroupParticipant,
    (groupParticipant) => groupParticipant.queueParticipants,
  )
  groupParticipant: Relation<GroupParticipant>;
}
