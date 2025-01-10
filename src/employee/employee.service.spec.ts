import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeService } from './employee.service';
import { PrismaService } from '../shared/services/prisma.service';
import { Employee, GroupType, PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import {
  CreateEmployeeRequestDto,
  CreateEmployeeResponseDto,
} from './dto/create-employee.dto';
import { BadRequestException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {
  UpdateEmployeeRequestDto,
  UpdateEmployeeResponseDto,
} from './dto/update-employee';
import {
  FindEmployeeRequestDto,
  FindEmployeeResponseDto,
} from './dto/find-employees.dto';

jest.mock('../shared/services/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    employee: mockDeep<PrismaClient['employee']>(),
  })),
}));
jest.mock('bcrypt');

describe('EmployeeService', () => {
  let employeeService: EmployeeService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeeService, PrismaService],
    }).compile();

    employeeService = module.get<EmployeeService>(EmployeeService);
    prisma = module.get(PrismaService);
  });

  describe('create employee', () => {
    it('Should be defined', () => {
      expect(employeeService).toBeDefined();
      expect(prisma).toBeDefined();
    });

    it('should create an employee (HR) with a hashed password', async () => {
      const createEmployeeDto: CreateEmployeeRequestDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'secret123',
        groupType: 'HR',
      };
      prisma.employee.create.mockResolvedValueOnce({
        ...createEmployeeDto,
        id: 1,
        passwordHash: expect.any(String),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const employee = await employeeService.createEmployee(createEmployeeDto);
      expect(employee).toBeInstanceOf(CreateEmployeeResponseDto);
      expect(prisma.employee.create).toHaveBeenCalledWith({
        data: {
          name: createEmployeeDto.name,
          email: createEmployeeDto.email,
          groupType: createEmployeeDto.groupType,
        },
      });
    });

    it('should throw BadRequestException if password is missing for HR employee', async () => {
      const createEmployeeDto: CreateEmployeeRequestDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        groupType: 'HR',
      };

      await expect(
        employeeService.createEmployee(createEmployeeDto),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should throw BadRequestException on Prisma error (P2002 - email exists)', async () => {
      const createEmployeeDto: CreateEmployeeRequestDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'secret123',
        groupType: 'HR',
      };
      const prismaError = new PrismaClientKnownRequestError(
        'Field name violation',
        { code: 'P2002', clientVersion: '' },
      );
      prisma.employee.create.mockRejectedValueOnce(prismaError);

      await expect(
        employeeService.createEmployee(createEmployeeDto),
      ).rejects.toThrow(BadRequestException);
      try {
        await employeeService.createEmployee(createEmployeeDto);
      } catch (error) {
        expect(error.message).toEqual('Email already exists!');
      }
    });
  });

  describe('updateEmployee', () => {
    it('should update an employee', async () => {
      const updateEmployeeDto: UpdateEmployeeRequestDto = {
        name: 'Updated Name',
        email: 'updated.email@example.com',
        groupType: 'Normal_Employee',
      };
      const mockUpdatedEmployee = {
        id: 1,
        name: updateEmployeeDto.name,
        email: updateEmployeeDto.email,
        groupType: updateEmployeeDto.groupType,
        passwordHash: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.employee.update.mockResolvedValue(mockUpdatedEmployee);

      const updatedEmployee = await employeeService.updateEmployee(
        1,
        updateEmployeeDto,
      );

      expect(updatedEmployee).toBeInstanceOf(UpdateEmployeeResponseDto);
      expect(prisma.employee.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          name: updateEmployeeDto.name,
          email: updateEmployeeDto.email,
          groupType: updateEmployeeDto.groupType,
        },
      });
    });

    it('should handle partial updates', async () => {
      const updateEmployeeDto: Partial<UpdateEmployeeRequestDto> = {
        name: 'Updated Name',
      };
      const mockUpdatedEmployee = {
        id: 1,
        name: 'Updated Name',
        email: 'test@test.com',
        groupType: GroupType.HR,
        passwordHash: 'test',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      prisma.employee.update.mockResolvedValue(mockUpdatedEmployee);

      const updatedEmployee = await employeeService.updateEmployee(
        1,
        updateEmployeeDto as UpdateEmployeeRequestDto,
      );

      expect(updatedEmployee).toBeInstanceOf(UpdateEmployeeResponseDto);
      expect(prisma.employee.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          name: updateEmployeeDto.name,
        },
      });
    });

    it('should throw BadRequestException on Prisma error (P2002 - email exists)', async () => {
      const updateEmployeeDto: UpdateEmployeeRequestDto = {
        email: 'duplicate.email@example.com',
        name: 'test',
      };
      const prismaError = new PrismaClientKnownRequestError(
        'Unique constraint failed on the fields: (`email`)',
        { code: 'P2002', clientVersion: '' },
      );
      prisma.employee.update.mockRejectedValueOnce(prismaError);

      await expect(
        employeeService.updateEmployee(1, updateEmployeeDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException on Prisma error (P2025 - Not found)', async () => {
      const updateEmployeeDto: UpdateEmployeeRequestDto = {
        email: 'duplicate.email@example.com',
        name: 'test',
      };
      const prismaError = new PrismaClientKnownRequestError(
        'An operation failed because it depends on one or more records that were required but not found.',
        { code: 'P2025', clientVersion: '' },
      );
      prisma.employee.update.mockRejectedValueOnce(prismaError);

      await expect(
        employeeService.updateEmployee(1, updateEmployeeDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteEmployee', () => {
    it('should delete an employee successfully', async () => {
      const employeeId = 1;
      const createEmployeeDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        groupType: GroupType.HR,
        id: employeeId,
        createdAt: new Date(),
        updatedAt: new Date(),
        passwordHash: 'test',
      };
      prisma.employee.delete.mockResolvedValueOnce(createEmployeeDto);

      const result = await employeeService.deleteEmployee(employeeId);

      expect(prisma.employee.delete).toHaveBeenCalledWith({
        where: { id: employeeId },
      });
      expect(result).toEqual('Employee Deleted SuccessFully!');
    });

    it('should throw BadRequestException if employee not found (P2025)', async () => {
      const employeeId = 999;
      const prismaError = new PrismaClientKnownRequestError(
        'An operation failed because it depends on one or more records that were required but not found.',
        { code: 'P2025', clientVersion: '' },
      );
      prisma.employee.delete.mockRejectedValueOnce(prismaError);

      await expect(employeeService.deleteEmployee(employeeId)).rejects.toThrow(
        BadRequestException,
      );
      try {
        await employeeService.deleteEmployee(employeeId);
      } catch (error) {
        expect(error.message).toEqual('Employee not found!');
      }
    });

    it('should throw BadRequestException for other Prisma errors', async () => {
      const employeeId = 1;
      const prismaError = new PrismaClientKnownRequestError(
        'Some other database error',
        { code: 'P1234', clientVersion: '' },
      );
      prisma.employee.delete.mockRejectedValueOnce(prismaError);

      await expect(employeeService.deleteEmployee(employeeId)).rejects.toThrow(
        BadRequestException,
      );
      try {
        await employeeService.deleteEmployee(employeeId);
      } catch (error) {
        expect(error.message).toEqual('Some other database error');
      }
    });
  });

  describe('getEmployees', () => {
    it('should return all employees without filters', async () => {
      const mockEmployees: Employee[] = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
          passwordHash: 'test',
          groupType: GroupType.HR,
        },
        {
          id: 2,
          name: 'John Doe',
          email: 'john.doe@example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
          passwordHash: 'test',
          groupType: GroupType.HR,
        },
      ];
      const expectedData = mockEmployees.map(
        FindEmployeeResponseDto.fromEntity,
      );

      prisma.employee.count.mockResolvedValueOnce(mockEmployees.length);
      prisma.employee.findMany.mockResolvedValueOnce(mockEmployees);
      const result = await employeeService.getEmployees({});

      expect(result).toEqual({
        data: expectedData,
        meta: {
          totalPages: 1,
        },
      });
      const whereClause = {
        OR: [
          {
            email: {
              contains: undefined,
            },
          },
          {
            name: {
              contains: undefined,
            },
          },
        ],
      };
      expect(prisma.employee.count).toHaveBeenCalledTimes(1);
      expect(prisma.employee.findMany).toHaveBeenCalledWith({
        where: whereClause,
      });
    });

    it('should filter and paginate employees with filters', async () => {
      const filters: FindEmployeeRequestDto = {
        search: 'doe',
        page: 2,
        perPage: 10,
      };
      const mockEmployees = [
        {
          id: 3,
          name: 'John Doe',
          email: 'john.doe@example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
          passwordHash: 'test',
          groupType: GroupType.HR,
        },
        ,
      ];
      const expectedData = mockEmployees.map(
        FindEmployeeResponseDto.fromEntity,
      );
      const totalElements = 20;

      prisma.employee.count.mockResolvedValueOnce(totalElements);
      prisma.employee.findMany.mockResolvedValueOnce(mockEmployees);

      const result = await employeeService.getEmployees(filters);

      expect(result).toEqual({
        data: expectedData,
        meta: {
          totalPages: Math.ceil(totalElements / filters.perPage),
        },
      });
      expect(prisma.employee.count).toHaveBeenCalledWith({
        where: {
          OR: [
            { email: { contains: filters.search } },
            { name: { contains: filters.search } },
          ],
        },
      });
      expect(prisma.employee.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { email: { contains: filters.search } },
            { name: { contains: filters.search } },
          ],
        },
        skip: (filters.page - 1) * filters.perPage,
        take: filters.perPage,
      });
    });
  });
});
