import { AttendanceStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';
import { CreateAttendanceResponseDto } from './create-attendance.dto';

export class UpdateAttendanceRequestDto {
  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;
}

export class UpdateAttendanceResponseDto extends CreateAttendanceResponseDto {}
