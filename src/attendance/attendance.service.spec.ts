import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceService } from './attendance.service';
import { AttendanceStatus, PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaService } from '../shared/services/prisma.service';
import {
  CreateAttendanceRequestDto,
  CreateAttendanceResponseDto,
} from './dto/create-attendance.dto';
import { BadRequestException } from '@nestjs/common';
import {
  UpdateAttendanceRequestDto,
  UpdateAttendanceResponseDto,
} from './dto/update-attendance.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { FindAttendanceByDateResponseDto } from './dto/find-attendance.dto';

jest.mock('../shared/services/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    attendance: mockDeep<PrismaClient['attendance']>(),
  })),
}));

describe('AttendanceService', () => {
  let service: AttendanceService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttendanceService, PrismaService],
    }).compile();

    service = module.get<AttendanceService>(AttendanceService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
  });

  describe('createAttendance', () => {
    it('should create an attendance record', async () => {
      const createAttendanceDto: CreateAttendanceRequestDto = {
        employeeId: 1,
        date: '2025-01-10',
        status: AttendanceStatus.Absent,
      };

      const mockAttendance = {
        id: 1,
        ...createAttendanceDto,
        createdAt: new Date(),
        updatedAt: new Date(),
        employee: {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
        },
      };
      prisma.attendance.create.mockResolvedValue(mockAttendance);

      const result = await service.createAttendance(createAttendanceDto);

      expect(prisma.attendance.create).toHaveBeenCalledWith({
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
      expect(result).toEqual(
        CreateAttendanceResponseDto.fromEntity(mockAttendance),
      );
    });

    it('should throw BadRequestException for duplicate entry (P2002)', async () => {
      const createAttendanceDto: CreateAttendanceRequestDto = {
        employeeId: 1,
        date: '2025-01-10',
        status: 'Present',
      };
      const prismaError = { code: 'P2002' };
      prisma.attendance.create.mockRejectedValue(prismaError);

      await expect(
        service.createAttendance(createAttendanceDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for other errors', async () => {
      const createAttendanceDto: CreateAttendanceRequestDto = {
        employeeId: 1,
        date: '2025-01-10',
        status: 'Present',
      };
      const prismaError = new Error('Some other error');
      prisma.attendance.create.mockRejectedValue(prismaError);

      await expect(
        service.createAttendance(createAttendanceDto),
      ).rejects.toThrow(BadRequestException);
    });
  });
  describe('updateAttendance', () => {
    it('should update an attendance record', async () => {
      const id = 1;
      const updateAttendanceDto: UpdateAttendanceRequestDto = {
        status: 'Absent',
      };
      const mockUpdatedAttendance = {
        id,
        employeeId: 1,
        date: '2025-01-10',
        status: AttendanceStatus.Absent,
        createdAt: new Date(),
        updatedAt: new Date(),
        employee: { name: 'test', email: 'test@test.com', id: 1 },
      };
      prisma.attendance.update.mockResolvedValue(mockUpdatedAttendance);

      const result = await service.updateAttendance(id, updateAttendanceDto);

      expect(prisma.attendance.update).toHaveBeenCalledWith({
        where: { id },
        data: { status: updateAttendanceDto.status },
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
      expect(result).toEqual(
        UpdateAttendanceResponseDto.fromEntity(mockUpdatedAttendance),
      );
    });

    it('should throw BadRequestException if attendance record not found (P2025)', async () => {
      const id = 1;
      const updateAttendanceDto: UpdateAttendanceRequestDto = {
        status: 'Absent',
      };
      const prismaError = new PrismaClientKnownRequestError(
        'An operation failed because it depends on one or more records that were required but not found.',
        { code: 'P2025', clientVersion: '' },
      );
      prisma.attendance.update.mockRejectedValue(prismaError);

      await expect(
        service.updateAttendance(id, updateAttendanceDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for other errors', async () => {
      const id = 1;
      const updateAttendanceDto: UpdateAttendanceRequestDto = {
        status: 'Absent',
      };
      const prismaError = new Error('Some other database error');
      prisma.attendance.update.mockRejectedValue(prismaError);

      await expect(
        service.updateAttendance(id, updateAttendanceDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAttendanceByDate', () => {
    it('should find attendance records with pagination', async () => {
      const date = '2025-01-10';
      const page = 2;
      const perPage = 10;
      const totalElements = 25;
      const mockAttendanceData = [
        {
          id: 1,
          date,
          employeeId: 1,
          status: AttendanceStatus.Absent,
          createdAt: new Date(),
          updatedAt: new Date(),
          employee: { name: 'John Doe', email: 'john.doe@example.com', id: 1 },
        },
      ];
      prisma.attendance.count.mockResolvedValue(totalElements);
      prisma.attendance.findMany.mockResolvedValue(mockAttendanceData);

      const result = await service.findAttendanceByDate(date, page, perPage);

      expect(prisma.attendance.count).toHaveBeenCalledWith({ where: { date } });
      expect(prisma.attendance.findMany).toHaveBeenCalledWith({
        where: { date },
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
        skip: (page - 1) * perPage,
        take: perPage,
      });
      expect(result).toEqual({
        data: mockAttendanceData.map(
          FindAttendanceByDateResponseDto.fromEntity,
        ),
        meta: { totalPages: Math.ceil(totalElements / perPage) },
      });
    });

    it('should find attendance records without pagination (page and perPage not provided)', async () => {
      const date = '2025-01-10';
      const mockAttendanceData = [
        {
          id: 1,
          date,
          employeeId: 1,
          status: AttendanceStatus.Absent,
          createdAt: new Date(),
          updatedAt: new Date(),
          employee: { name: 'John Doe', email: 'john.doe@example.com', id: 1 },
        },
      ];
      prisma.attendance.count.mockResolvedValue(mockAttendanceData.length);
      prisma.attendance.findMany.mockResolvedValue(mockAttendanceData);

      const result = await service.findAttendanceByDate(
        date,
        undefined,
        undefined,
      );

      expect(prisma.attendance.count).toHaveBeenCalledWith({ where: { date } });
      expect(prisma.attendance.findMany).toHaveBeenCalledWith({
        where: { date },
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
      expect(result).toEqual({
        data: mockAttendanceData.map(
          FindAttendanceByDateResponseDto.fromEntity,
        ),
        meta: { totalPages: 1 },
      });
    });

    it('should throw BadRequestException for other errors during findMany', async () => {
      const date = '2025-01-10';
      const prismaError = new Error('Some other findMany error');
      prisma.attendance.count.mockResolvedValue(10);
      prisma.attendance.findMany.mockRejectedValue(prismaError);

      await expect(service.findAttendanceByDate(date, 1, 10)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
