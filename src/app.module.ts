import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './auth/guards/jwt.guard';
import { ConfigModule } from '@nestjs/config';
import { GroupsModule } from './groups/groups.module';
import { PrismaService } from './prisma.service';
import { InvitationModule } from './invitation/invitation.module';
import { QueuesModule } from './queues/queues.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    GroupsModule,
    InvitationModule,
    QueuesModule,
  ],
  controllers: [AuthController],
  providers: [
    PrismaService,

    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}
