import { Test, TestingModule } from '@nestjs/testing';
import { GroupInvitationSender } from './group-invitation.sender';

describe('GroupInvitationSenderService', () => {
  let service: GroupInvitationSender;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupInvitationSender],
    }).compile();

    service = module.get<GroupInvitationSender>(GroupInvitationSender);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
