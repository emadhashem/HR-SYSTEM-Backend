import { ApiProperty } from '@nestjs/swagger';
import { Employee, EmployeeStatus, GroupType } from '@prisma/client';
import { IsOptional, IsPositive, IsString } from 'class-validator';

export class FindEmployeeRequestDto {
  @IsOptional()
  @IsPositive()
  @ApiProperty({
    example: 1,
  })
  page?: number;

  @IsOptional()
  @IsPositive()
  @ApiProperty({
    example: 10,
  })
  perPage?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'John Doe',
  })
  search?: string;
}

export class FindEmployeeResponseDto {
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
