import { IsEmail } from 'class-validator';

export class InvitationDetailsDto {
  @IsEmail()
  email: string;
}
