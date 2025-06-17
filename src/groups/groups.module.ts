import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { PrismaService } from 'src/prisma.service';
import { GroupsController } from './groups.controller';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [],
  controllers: [GroupsController],
  providers: [PrismaService, UserService, GroupsService],
  exports: [GroupsService],
})
export class GroupsModule {}
