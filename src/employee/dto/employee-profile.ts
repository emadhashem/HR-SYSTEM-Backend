import { EmployeeStatus, GroupType, PayFrequency } from '@prisma/client';

export class GetEmployeeProfileResponseDto {
  id: number;
  name: string;
  email: string;
  groupType: GroupType;
  createdAt: Date;
  updatedAt: Date;
  departmentId: number;
  employeeStatus: EmployeeStatus;
  departmentName: string | null;
  salaryHistory: {
    amount: number;
    updatedAt: Date;
    effectiveDate: Date;
    payFrequency: PayFrequency;
  }[];

  static fromEntity(entity: any): GetEmployeeProfileResponseDto {
    const dto = new GetEmployeeProfileResponseDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.email = entity.email;
    dto.groupType = entity.groupType;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    dto.departmentId = entity.departmentId;
    dto.employeeStatus = entity.employeeStatus;
    dto.departmentName = entity.department?.name ?? null;
    dto.salaryHistory = entity.salaryHistory.map((history: any) => ({
      amount: history.amount,
      updatedAt: history.updatedAt,
      effectiveDate: history.effectiveDate,
      payFrequency: history.payFrequency,
    }));
    return dto;
  }
}
