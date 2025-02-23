import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    example: 'John Doe',
  })
  name?: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({
    example: 'john.doe@example.com',
  })
  email?: string;
  @IsOptional()
  @IsEnum(GroupType)
  @ApiProperty({
    example: 'Admin',
    enum: GroupType,
  })
  groupType?: GroupType;
}

export class UpdateEmployeeResponseDto {
  @ApiProperty({
    example: 'John Doe',
  })
  name: string;
  @ApiProperty({
    example: 'john.doe@example.com',
  })
  email: string;
  @ApiProperty({
    example: 1,
  })
  id: number;
  @ApiProperty({
    example: 'Admin',
    enum: GroupType,
  })
  groupType: GroupType;
  @ApiProperty({
    example: '2021-07-01T00:00:00.000Z',
  })
  createdAt: Date;
  @ApiProperty({
    example: '2021-07-01T00:00:00.000Z',
  })
  updatedAt: Date;
  @ApiProperty({
    example: 'Active',
    enum: EmployeeStatus,
  })
  employeeStatus: EmployeeStatus;
  @ApiProperty({
    example: {
      name: 'IT',
    },
  })
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
  @ApiProperty({
    example: '2021-07-01T00:00:00.000Z',
  })
  updatedAt: Date;
  @ApiProperty({
    example: 'John Doe',
  })
  name: string;
  @ApiProperty({
    example: 'john.doe@example.com',
  })
  email: string;
  @ApiProperty({
    example: 1,
  })
  id: number;
  @ApiProperty({
    example: 'Admin',
    enum: GroupType,
  })
  groupType: GroupType;
  @ApiProperty({
    example: 1,
  })
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
