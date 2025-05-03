import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'Email or username of the user' })
  emailOrUsername: string;

  @ApiProperty({ description: 'Password of the user' })
  password: string;
}
