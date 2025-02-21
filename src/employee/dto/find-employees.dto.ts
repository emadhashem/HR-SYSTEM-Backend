import { Employee, EmployeeStatus, GroupType } from '@prisma/client';
import { IsOptional, IsPositive, IsString } from 'class-validator';

export class FindEmployeeRequestDto {
  @IsOptional()
  @IsPositive()
  page?: number;

  @IsOptional()
  @IsPositive()
  perPage?: number;

  @IsOptional()
  @IsString()
  search?: string;
}

export class FindEmployeeResponseDto {
  name: string;
  email: string;
  id: number;
  groupType: GroupType;
  createdAt: Date;
  updatedAt: Date;
  employeeStatus: EmployeeStatus;
  department?: {
    name: string;
  };
  static fromEntity(
    employee: Employee & {
      department: {
        name: string;
      };
    },
  ) {
    const response = new FindEmployeeResponseDto();
    if (!employee) {
      return null;
    }
    response.name = employee.name;
    response.email = employee.email;
    response.id = employee.id;
    response.groupType = employee.groupType;
    response.createdAt = employee.createdAt;
    response.updatedAt = employee.updatedAt;
    response.employeeStatus = employee.employeeStatus;
    response.department = {
      name: employee.department?.name ?? null,
    };
    return response;
  }
}
