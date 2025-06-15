import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'db/user.entity';
import { UserService } from './user.service';
import { GroupParticipant } from 'db/group-participant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, GroupParticipant])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
