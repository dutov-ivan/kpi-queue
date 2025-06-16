import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class InvitationService {
  private readonly logger = new Logger(InvitationService.name);
  sendInvitationToGroup(content: string, email: string) {
    this.logger.log(`Sending invitation to ${email} with content: ${content}`);
  }
}
