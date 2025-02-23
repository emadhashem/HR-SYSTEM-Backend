import { Department } from '@prisma/client';
import { DepartmentEmployees } from './update-department.dto';
import { ApiProperty } from '@nestjs/swagger';

export class GetAllDepartmentsResponseDto {
  @ApiProperty({
    example: '1',
  })
  id: number;
  @ApiProperty({
    example: 'IT',
  })
  name: string;
  @ApiProperty({
    example: '2021-07-01T00:00:00.000Z',
  })
  createdAt: Date;
  @ApiProperty({
    example: '2021-07-01T00:00:00.000Z',
  })
  updatedAt: Date;
  static fromEntity(entity: Department) {
    const response = new GetAllDepartmentsResponseDto();
    response.id = entity.id;
    response.name = entity.name;
    response.createdAt = entity.createdAt;
    response.updatedAt = entity.updatedAt;
    return response;
  }
}

export class GetAllDepartmentsWithEmployeesResponseDto extends GetAllDepartmentsResponseDto {
  @ApiProperty({
    example: [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        groupType: 'ADMIN',
      },
    ],
  })
  employees: DepartmentEmployees[];
  static fromEntity(entity: Department & { employees: any[] }) {
    const response = new GetAllDepartmentsWithEmployeesResponseDto();
    response.id = entity.id;
    response.name = entity.name;
    response.createdAt = entity.createdAt;
    response.updatedAt = entity.updatedAt;
    response.employees = entity.employees.map((employee) =>
      DepartmentEmployees.fromEntity(employee),
    );
    return response;
  }
}
