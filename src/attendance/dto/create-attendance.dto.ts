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
  employeeId: number;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date must be in YYYY-MM-DD format',
  })
  date: string;

  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;
}

export class CreateAttendanceResponseDto {
  employeeId: number;
  date: string;
  status: AttendanceStatus;
  id: number;
  createdAt: Date;
  updatedAt: Date;
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
