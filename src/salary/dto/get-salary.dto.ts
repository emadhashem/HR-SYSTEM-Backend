import { PayFrequency, Salary } from '@prisma/client';

export class GetCurrentSalaryResponse {
  id: number;
  amount: number;
  payFrequency: PayFrequency;
  effectiveDate: Date;
  updatedAt: Date;
  employeeId: number;

  static fromEntity(entity: Salary): GetCurrentSalaryResponse {
    const dto = new GetCurrentSalaryResponse();
    dto.id = entity.id;
    dto.amount = entity.amount.toNumber();
    dto.payFrequency = entity.payFrequency;
    dto.effectiveDate = entity.effectiveDate;
    dto.updatedAt = entity.updatedAt;
    dto.employeeId = entity.employeeId;
    return dto;
  }
}

export type GetSalaryHistoryOfEmployeeResponse = GetCurrentSalaryResponse[];
