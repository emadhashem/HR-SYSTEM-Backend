import { Employee, GroupType } from '@prisma/client';
import { Exclude } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateEmployeeRequestDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @MinLength(4)
  name: string;
  @IsEmail()
  email: string;
  @IsOptional()
  @MinLength(4)
  password?: string;
  @IsEnum(GroupType)
  groupType: GroupType;
}

export class CreateEmployeeResponseDto {
  name: string;
  email: string;
  id: number;
  groupType: GroupType;
  createdAt: Date;
  updatedAt: Date | null;
  @Exclude()
  passwordHash: string | null;

  constructor(partial: Partial<Employee>) {
    Object.assign(this, partial);
  }

  static fromEntity(employee: Employee) {
    return new CreateEmployeeResponseDto({
      ...employee,
    });
  }
}
