import { ApiProperty } from '@nestjs/swagger';
import { Department, Employee, GroupType } from '@prisma/client';
import {
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
  @ApiProperty({
    example: 'IT',
  })
  name?: string;

  @IsArray()
  @IsPositive({ each: true })
  @IsOptional()
  @ApiProperty({
    example: [1, 2, 3],
  })
  employees?: number[];
}

export class DepartmentEmployees {
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
  })
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
  @ApiProperty({
    example: 'IT',
  })
  name: string;
  @ApiProperty({
    example: 1,
  })
  id: number;
  @ApiProperty({
    example: '2021-07-01T00:00:00.000Z',
  })
  updatedAt: Date;
  @ApiProperty({
    example: [
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        id: 1,
        groupType: 'Admin',
      },
    ],
  })
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
