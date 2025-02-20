import { Employee, GroupType } from '@prisma/client';
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
  departmentId: number | null;

  static fromEntity(employee: Employee) {
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
    response.departmentId = employee.departmentId;
    return response;
  }
}
