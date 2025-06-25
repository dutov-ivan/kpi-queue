import { IsBoolean } from 'class-validator';

export class SendOptionsDto {
  @IsBoolean()
  shouldThrowOnAlreadyParticipant: boolean;

  @IsBoolean()
  shouldThrowOnAlreadyInvited: boolean;
}
