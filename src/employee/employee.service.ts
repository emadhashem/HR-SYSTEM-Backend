import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/services/prisma.service';
import {
  CreateEmployeeRequestDto,
  CreateEmployeeResponseDto,
} from './dto/create-employee.dto';
import {
  AssignDepartmentToEmployeeResponseDto,
  UpdateEmployeeRequestDto,
  UpdateEmployeeResponseDto,
} from './dto/update-employee';

import {
  FindEmployeeRequestDto,
  FindEmployeeResponseDto,
} from './dto/find-employees.dto';

import { PaginatedOutputDto } from '../shared/types/paginated-output.dto';
import { GetEmployeeProfileResponseDto } from './dto/employee-profile';
import { Bcrypt } from '../shared/utils/bcrypt';

@Injectable()
export class EmployeeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bcrypt: Bcrypt,
  ) {}

  async createEmployee(createEmployeeDto: CreateEmployeeRequestDto) {
    let passwordHash: string | null = null;
    if (createEmployeeDto.groupType == 'HR' && !createEmployeeDto.password)
      throw new BadRequestException('Password is required!');
    if (createEmployeeDto.groupType == 'HR')
      passwordHash = await this.bcrypt.hash(createEmployeeDto.password, 10);
    try {
      const employee = await this.prisma.employee.create({
        data: {
          name: createEmployeeDto.name,
          email: createEmployeeDto.email,
          passwordHash,
          groupType: createEmployeeDto.groupType,
        },
      });

      return CreateEmployeeResponseDto.fromEntity(employee);
    } catch (error) {
      if (error.code == 'P2002') {
        throw new BadRequestException('Email already exists!');
      }
      throw new BadRequestException(error.message);
    }
  }

  async validateEmployee(email: string, password: string) {
    const employee = await this.prisma.employee.findFirst({
      where: {
        email,
      },
    });

    if (!employee || employee.groupType == 'Normal_Employee') {
      throw new BadRequestException(
        'HR Employee with these Email And Password not Found!',
      );
    }

    const isPasswordMatch = await this.bcrypt.compare(
      password,
      employee.passwordHash,
    );

    if (!isPasswordMatch) {
      throw new BadRequestException(
        'User with these Email And Password not Found!',
      );
    }
    return employee;
  }

  async updateEmployee(
    id: number,
    updateEmployeeDto: UpdateEmployeeRequestDto,
  ) {
    try {
      const employee = await this.prisma.employee.update({
        where: {
          id,
        },
        data: {
          ...(updateEmployeeDto.name && {
            name: updateEmployeeDto.name,
          }),
          ...(updateEmployeeDto.email !== undefined && {
            email: updateEmployeeDto.email,
          }),
          ...(updateEmployeeDto.groupType !== undefined && {
            groupType: updateEmployeeDto.groupType,
          }),
        },
        select: {
          id: true,
          name: true,
          email: true,
          groupType: true,
          createdAt: true,
          updatedAt: true,
          departmentId: true,
          passwordHash: true,
          employeeStatus: true,
          department: {
            select: {
              name: true,
            },
          },
        },
      });
      return UpdateEmployeeResponseDto.fromEntity(employee);
    } catch (error) {
      if (error.code == 'P2002') {
        throw new BadRequestException('Email already exists!');
      }
      if (error.code == 'P2025') {
        throw new BadRequestException('Employee not found!');
      }
      throw new BadRequestException(error.message);
    }
  }

  async deleteEmployee(id: number) {
    try {
      await this.prisma.employee.delete({
        where: {
          id,
        },
      });

      return 'Employee Deleted SuccessFully!';
    } catch (error) {
      if (error.code == 'P2025') {
        throw new BadRequestException('Employee not found!');
      }
      throw new BadRequestException(error.message);
    }
  }

  async getEmployees(
    filters: FindEmployeeRequestDto,
  ): Promise<PaginatedOutputDto<FindEmployeeResponseDto>> {
    const _filters = {};
    if (filters.page && filters.perPage) {
      _filters['skip'] = (filters.page - 1) * filters.perPage;
      _filters['take'] = filters.perPage;
    }
    const totalElements = await this.prisma.employee.count({
      where: {
        OR: [
          {
            email: {
              contains: filters.search,
            },
          },
          {
            name: {
              contains: filters.search,
            },
          },
        ],
      },
    });
    let totalPages = 1;
    if (filters.perPage) {
      totalPages = Math.ceil(totalElements / filters.perPage);
    }
    const items = await this.prisma.employee.findMany({
      where: {
        OR: [
          {
            email: {
              contains: filters.search,
            },
          },
          {
            name: {
              contains: filters.search,
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        groupType: true,
        createdAt: true,
        updatedAt: true,
        departmentId: true,
        passwordHash: true,
        employeeStatus: true,
        department: {
          select: {
            name: true,
          },
        },
      },
      ..._filters,
    });

    const data = items.map((item) => FindEmployeeResponseDto.fromEntity(item));
    return {
      data,
      meta: {
        totalPages,
      },
    };
  }

  async assignDepartmentToEmployee(employeeId: number, departmentId: number) {
    try {
      const employee = await this.prisma.employee.update({
        where: {
          id: employeeId,
        },
        data: {
          departmentId,
        },
      });
      if (!employee) {
        throw new Error('Employee not found!');
      }
      return AssignDepartmentToEmployeeResponseDto.fromEntity(employee);
    } catch (error) {
      if (error.code == 'P2025') {
        throw new BadRequestException('Employee not found!');
      }
      throw new BadRequestException(error.message);
    }
  }

  async getEmployeeProfileById(
    id: number,
  ): Promise<GetEmployeeProfileResponseDto> {
    const employeeProfile = await this.prisma.employee.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        groupType: true,
        createdAt: true,
        updatedAt: true,
        departmentId: true,
        employeeStatus: true,
        department: {
          select: {
            name: true,
          },
        },
        salaryHistory: {
          select: {
            amount: true,
            updatedAt: true,
            effectiveDate: true,
            payFrequency: true,
          },
        },
      },
    });
    if (!employeeProfile) {
      throw new BadRequestException('Employee not found!');
    }
    return GetEmployeeProfileResponseDto.fromEntity(employeeProfile);
  }
}
