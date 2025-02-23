import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    example: 'John Doe',
  })
  name: string;
  @IsEmail()
  @ApiProperty({
    example: 'john.doe@example.com',
  })
  email: string;
  @IsOptional()
  @MinLength(4)
  @ApiProperty({
    example: '12345678',
  })
  password?: string;
  @IsEnum(GroupType)
  @ApiProperty({
    example: 'Admin',
    enum: GroupType,
  })
  groupType: GroupType;
}

export class CreateEmployeeResponseDto {
  @ApiProperty({
    example: 'John Doe',
  })
  name: string;
  @ApiProperty({
    example: 'john.doe@example.com',
  })
  email: string;
  @ApiProperty({
    example: 1,
  })
  id: number;
  @ApiProperty({
    example: 'Admin',
    enum: GroupType,
  })
  groupType: GroupType;
  @ApiProperty({
    example: '2021-07-01T00:00:00.000Z',
  })
  createdAt: Date;
  @ApiProperty({
    example: '2021-07-01T00:00:00.000Z',
  })
  updatedAt: Date | null;
  @ApiProperty({
    example: null,
  })
  departmentId: number | null;
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
