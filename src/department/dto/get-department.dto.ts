import { Department } from '@prisma/client';
import { DepartmentEmployees } from './update-department.dto';

export class GetAllDepartmentsResponseDto {
  id: number;
  name: string;
  createdAt: Date;
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
