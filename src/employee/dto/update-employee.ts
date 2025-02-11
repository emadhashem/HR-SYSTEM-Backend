import { GroupType } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateEmployeeRequestDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @MinLength(4)
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
  @IsOptional()
  @IsEnum(GroupType)
  groupType?: GroupType;
}

export class UpdateEmployeeResponseDto {
  id: number;
  name: string;
  email: string;
  groupType: GroupType;
  updatedAt: Date;
  static fromEntity(employee: any) {
    const response = new UpdateEmployeeResponseDto();
    response.name = employee.name;
    response.email = employee.email;
    response.groupType = employee.groupType;
    response.id = employee.id;
    response.updatedAt = employee.updatedAt;
    return response;
  }
}
