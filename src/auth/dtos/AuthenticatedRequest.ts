import { ApiProperty } from '@nestjs/swagger';

export class AuthenticatedUser {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;
}

export class AuthenticatedRequest {
  @ApiProperty({ type: AuthenticatedUser })
  user: AuthenticatedUser;
}
