import { GroupType } from '@prisma/client';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginRequestDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
export class LoginResponseDto {
  accessToken: string;
  type: string;
  employee: {
    id: number;
    name: string;
    email: string;
    role: GroupType;
  };
}
