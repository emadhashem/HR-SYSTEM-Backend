import { AttendanceStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';
import { CreateAttendanceResponseDto } from './create-attendance.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAttendanceRequestDto {
  @IsEnum(AttendanceStatus)
  @ApiProperty({
    enum: AttendanceStatus,
    example: 'Late',
  })
  status: AttendanceStatus;
}

export class UpdateAttendanceResponseDto extends CreateAttendanceResponseDto {}
