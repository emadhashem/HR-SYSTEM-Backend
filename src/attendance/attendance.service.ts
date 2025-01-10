import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
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

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async createAttendance(
    createAttendanceDto: CreateAttendanceRequestDto,
  ): Promise<CreateAttendanceResponseDto> {
    try {
      const result = await this.prisma.attendance.create({
        data: {
          employeeId: createAttendanceDto.employeeId,
          date: createAttendanceDto.date,
          status: createAttendanceDto.status,
        },
        select: {
          id: true,
          employeeId: true,
          date: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          employee: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      return CreateAttendanceResponseDto.fromEntity(result);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Attendance Record already Taken');
      }
      throw new BadRequestException('Failed to record attendance');
    }
  }

  async updateAttendance(
    id: number,
    updateAttendanceDto: UpdateAttendanceRequestDto,
  ): Promise<UpdateAttendanceResponseDto> {
    try {
      const result = await this.prisma.attendance.update({
        where: { id },
        data: {
          status: updateAttendanceDto.status,
        },
        select: {
          id: true,
          employeeId: true,
          date: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          employee: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });
      console.log(result);
      return UpdateAttendanceResponseDto.fromEntity(result);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException('Attendance Record not found');
      }
      throw new BadRequestException('Failed to update attendance');
    }
  }

  async findAttendanceByDate(
    date: string,
    page: number,
    perPage: number,
  ): Promise<PaginatedOutputDto<FindAttendanceByDateResponseDto>> {
    try {
      const filters = {};
      if (page && perPage) {
        filters['skip'] = (page - 1) * perPage;
        filters['take'] = perPage;
      }
      const totalElements = await this.prisma.attendance.count({
        where: {
          date: date,
        },
      });
      let totalPages = 1
      if (perPage) {
        totalPages = Math.ceil(totalElements / perPage);
      }
      const result = await this.prisma.attendance.findMany({
        where: {
          date: date,
        },
        select: {
          id: true,
          employeeId: true,
          date: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          employee: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        ...filters,
      });
      return {
        data: result.map((item) =>
          FindAttendanceByDateResponseDto.fromEntity(item),
        ),
        meta: {
          totalPages: totalPages,
        },
      };
    } catch (error) {
      
      throw new BadRequestException('Failed to find attendance');
    }
  }
}
