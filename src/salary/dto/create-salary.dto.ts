import { PayFrequency, Salary } from '@prisma/client';
import { IsDateString, IsEnum, IsPositive } from 'class-validator';

export class CreateSalaryRequestDto {
  @IsPositive()
  amount: number;
  @IsEnum(PayFrequency)
  payFrequency: PayFrequency;
  @IsPositive()
  employeeId: number;
  @IsDateString()
  effectiveDate: Date;
}

export class CreateSalaryResponseDto {
  id: number;
  amount: number;
  payFrequency: PayFrequency;
  employeeId: number;
  effectiveDate: Date;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(entity: Salary): CreateSalaryResponseDto {
    const dto = new CreateSalaryResponseDto();
    dto.id = entity.id;
    dto.amount = entity.amount.toNumber();
    dto.payFrequency = entity.payFrequency;
    dto.employeeId = entity.employeeId;
    dto.effectiveDate = entity.effectiveDate;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }
}
