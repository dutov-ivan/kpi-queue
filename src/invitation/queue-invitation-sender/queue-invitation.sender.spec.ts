import { Test, TestingModule } from '@nestjs/testing';
import { QueueInvitationSender } from './queue-invitation.sender';

describe('QueueInvitationSenderService', () => {
  let service: QueueInvitationSender;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QueueInvitationSender],
    }).compile();

    service = module.get<QueueInvitationSender>(QueueInvitationSender);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
