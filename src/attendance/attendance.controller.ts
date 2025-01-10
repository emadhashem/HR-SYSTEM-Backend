import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { GroupType } from '@prisma/client';
import {
  CreateAttendanceRequestDto,
  CreateAttendanceResponseDto,
} from './dto/create-attendance.dto';
import {
  UpdateAttendanceRequestDto,
  UpdateAttendanceResponseDto,
} from './dto/update-attendance.dto';
import { PaginatedOutputDto } from 'src/shared/types/paginated-output.dto';
import { FindAttendanceByDateResponseDto } from './dto/find-attendance.dto';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @UseGuards(RolesGuard)
  @Roles([GroupType.HR])
  @Post('/create')
  async createAttendance(
    @Body() createAttendanceRequestDto: CreateAttendanceRequestDto,
  ): Promise<CreateAttendanceResponseDto> {
    return this.attendanceService.createAttendance(createAttendanceRequestDto);
  }

  @UseGuards(RolesGuard)
  @Roles([GroupType.HR])
  @Patch('/update/:id')
  async updateAttendance(
    @Body() updateAttendanceRequestDto: UpdateAttendanceRequestDto,
    @Param('id') id: number,
  ): Promise<UpdateAttendanceResponseDto> {
    return this.attendanceService.updateAttendance(
      id,
      updateAttendanceRequestDto,
    );
  }

  @UseGuards(RolesGuard)
  @Roles([GroupType.HR])
  @Get('/get-by-date')
  async getAttendance(
    @Query('page') page: number = 1,
    @Query('perPage') perPage: number = 1000,
    @Query('date') date: string,
  ): Promise<PaginatedOutputDto<FindAttendanceByDateResponseDto>> {
    return this.attendanceService.findAttendanceByDate(date, page, perPage);
  }
}