import { ApiProperty } from '@nestjs/swagger';
import { GroupType } from '@prisma/client';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginRequestDto {
  @IsEmail()
  @ApiProperty({
    example: 'john.doe@example.com',
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    example: '12345678',
  })
  password: string;
}
export class LoginResponseDto {
  @ApiProperty()
  accessToken: string;
  @ApiProperty({
    example: 'Bearer',
  })
  type: string;
  @ApiProperty({
    example: {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'Admin',
    },
  })
  employee: {
    id: number;
    name: string;
    email: string;
    role: GroupType;
  };
}
