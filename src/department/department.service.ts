import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/services/prisma.service';
import {
  CreateDepartmentRequestDto,
  CreateDepartmentResponseDto,
} from './dto/create-department.dto';
import {
  UpdateDepartmentRequestDto,
  UpdateDepartmentResponseDto,
} from './dto/update-department.dto';
import { Employee } from '@prisma/client';
import {
  GetAllDepartmentsResponseDto,
  GetAllDepartmentsWithEmployeesResponseDto,
} from './dto/get-department.dto';

@Injectable()
export class DepartmentService {
  constructor(private readonly prisma: PrismaService) {}

  async createDepartment(data: CreateDepartmentRequestDto) {
    try {
      const newDept = await this.prisma.department.create({
        data: {
          name: data.name,
        },
      });
      return CreateDepartmentResponseDto.fromEntity(newDept);
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Department already exists');
      }
      throw new BadRequestException(
        'Something went wrong while creating new department' + error.message,
      );
    }
  }

  async updateDepartment(id: number, data: UpdateDepartmentRequestDto) {
    try {
      const dept = await this.prisma.department.update({
        where: {
          id: id,
        },
        data: {
          ...(data.name && {
            name: data.name,
          }),
          ...(data.employees && {
            employees: {
              set: data.employees.map((employeeId) => ({ id: employeeId })),
            },
          }),
        },
        select: {
          name: true,
          id: true,
          createdAt: true,
          updatedAt: true,
          employees: {
            select: {
              name: true,
              email: true,
              id: true,
              groupType: true,
            },
          },
        },
      });
      if (!dept) {
        throw new Error('Department not found');
      }
      const employees = dept.employees as Employee[];
      return UpdateDepartmentResponseDto.fromEntity({ ...dept, employees });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Department already exists');
      }
      if (error.code === 'P2025') {
        throw new BadRequestException('Department not found');
      }
      throw new BadRequestException(
        'Something went wrong while updating department' + error.message,
      );
    }
  }

  async deleteDepartment(id: number) {
    try {
      const dept = await this.prisma.department.delete({
        where: {
          id: id,
        },
      });
      if (!dept) {
        throw new Error('Department not found');
      }
      return 'Department deleted';
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new BadRequestException('Department not found');
      }
      throw new BadRequestException(
        'Something went wrong while deleting department' + error.message,
      );
    }
  }

  async getAllDepartments(): Promise<GetAllDepartmentsResponseDto[]> {
    try {
      const depts = await this.prisma.department.findMany({
        select: {
          name: true,
          id: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return depts;
    } catch (error: any) {
      throw new BadRequestException(
        'Something went wrong while fetching departments' + error.message,
      );
    }
  }

  async getAllDepartmentsWithEmployees(): Promise<
    GetAllDepartmentsWithEmployeesResponseDto[]
  > {
    try {
      const depts = await this.prisma.department.findMany({
        select: {
          name: true,
          id: true,
          createdAt: true,
          updatedAt: true,
          employees: {
            select: {
              name: true,
              email: true,
              id: true,
              groupType: true,
              updatedAt: true,
              createdAt: true,
            },
          },
        },
      });
      return depts.map((dept) =>
        GetAllDepartmentsWithEmployeesResponseDto.fromEntity(dept),
      );
    } catch (error: any) {
      throw new BadRequestException(
        'Something went wrong while fetching departments' + error.message,
      );
    }
  }
}
