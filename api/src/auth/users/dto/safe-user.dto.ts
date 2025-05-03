import { ApiProperty } from '@nestjs/swagger';

export class SafeUserDto {
  @ApiProperty({ description: 'Unique identifier of the user' })
  id: string;

  @ApiProperty({ description: 'First name of the user' })
  firstName?: string;

  @ApiProperty({ description: 'Last name of the user' })
  lastName?: string;

  @ApiProperty({ description: 'Username of the user' })
  username?: string;

  @ApiProperty({ description: 'Email of the user' })
  email: string;

  @ApiProperty({ description: 'Indicates if the user is active' })
  isActive?: boolean;

  @ApiProperty({ description: 'Date when the user was created' })
  createdAt: Date;

  @ApiProperty({ description: 'Date when the user was last updated' })
  updatedAt: Date;
}
