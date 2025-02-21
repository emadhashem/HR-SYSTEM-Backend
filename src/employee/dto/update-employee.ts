import { Employee, EmployeeStatus, GroupType } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateEmployeeRequestDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @MinLength(4)
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
  @IsOptional()
  @IsEnum(GroupType)
  groupType?: GroupType;
}

export class UpdateEmployeeResponseDto {
  name: string;
  email: string;
  id: number;
  groupType: GroupType;
  createdAt: Date;
  updatedAt: Date;
  employeeStatus: EmployeeStatus;
  department: {
    name: string;
  };
  static fromEntity(
    employee: Employee & {
      department: {
        name: string;
      };
    },
  ) {
    const response = new UpdateEmployeeResponseDto();
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
      name: employee.department.name,
    };
    return response;
  }
}

export class AssignDepartmentToEmployeeResponseDto {
  updatedAt: Date;
  name: string;
  email: string;
  id: number;
  groupType: GroupType;
  departmentId: number;
  static fromEntity(employee: Employee) {
    const response = new AssignDepartmentToEmployeeResponseDto();
    response.name = employee.name;
    response.email = employee.email;
    response.groupType = employee.groupType;
    response.id = employee.id;
    response.updatedAt = employee.updatedAt;
    response.departmentId = employee.departmentId;
    return response;
  }
}
