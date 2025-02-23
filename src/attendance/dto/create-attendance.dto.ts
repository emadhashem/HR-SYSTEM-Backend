import { ApiProperty } from '@nestjs/swagger';
import { AttendanceStatus } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsPositive,
  IsString,
  Matches,
} from 'class-validator';

export class CreateAttendanceRequestDto {
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty()
  employeeId: number;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date must be in YYYY-MM-DD format',
  })
  @ApiProperty({
    example: '2024-03-01',
  })
  date: string;

  @IsEnum(AttendanceStatus)
  @ApiProperty({
    enum: AttendanceStatus,
    example: 'Present',
  })
  status: AttendanceStatus;
}

export class CreateAttendanceResponseDto {
  @ApiProperty()
  employeeId: number;
  @ApiProperty()
  date: string;
  @ApiProperty()
  status: AttendanceStatus;
  @ApiProperty()
  id: number;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty({
    example: {
      name: 'John Doe',
      email: 'john.doe@example.com',
    },
  })
  employee: {
    name: string;
    email: string;
  };

  static fromEntity(entity: any): CreateAttendanceResponseDto {
    const dto = new CreateAttendanceResponseDto();
    dto.employeeId = entity.employeeId;
    dto.date = entity.date;
    dto.status = entity.status;
    dto.id = entity.id;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    dto.employee = {
      name: entity.employee.name,
      email: entity.employee.email,
    };
    return dto;
  }
}
