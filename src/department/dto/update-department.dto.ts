import { Department, Employee, GroupType } from '@prisma/client';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateDepartmentRequestDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @MinLength(4)
  @IsOptional()
  name?: string;

  @IsArray()
  @IsPositive({ each: true })
  @ArrayNotEmpty()
  @IsOptional()
  employees?: number[];
}

export class DepartmentEmployees {
  name: string;
  email: string;
  id: number;
  groupType: GroupType;
  static fromEntity(employee: Employee) {
    const response = new DepartmentEmployees();
    response.name = employee.name;
    response.email = employee.email;
    response.id = employee.id;
    response.groupType = employee.groupType;
    return response;
  }
}

export class UpdateDepartmentResponseDto {
  name: string;
  id: number;
  updatedAt: Date;
  employees: DepartmentEmployees[];
  static fromEntity(entity: Department & { employees: Employee[] }) {
    const response = new UpdateDepartmentResponseDto();
    response.name = entity.name;
    response.id = entity.id;
    response.updatedAt = entity.updatedAt;
    response.employees = entity.employees.map((employee) =>
      DepartmentEmployees.fromEntity(employee),
    );
    return response;
  }
}
