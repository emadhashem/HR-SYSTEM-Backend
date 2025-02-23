import { ApiProperty } from '@nestjs/swagger';
import { PayFrequency, Salary } from '@prisma/client';

export class GetCurrentSalaryResponse {
  @ApiProperty({
    description: 'The ID of the salary',
    example: 1,
  })
  id: number;
  @ApiProperty({
    description: 'The amount of the salary',
    example: 100000,
  })
  amount: number;
  @ApiProperty({
    description: 'The pay frequency of the salary',
    example: 'MONTHLY',
    enum: PayFrequency,
  })
  payFrequency: PayFrequency;
  @ApiProperty({
    description: 'The effective date of the salary',
    example: '2021-01-01',
  })
  effectiveDate: Date;
  @ApiProperty({
    description: 'The updated date of the salary',
    example: '2021-01-01',
  })
  updatedAt: Date;
  @ApiProperty({
    description: 'The employee ID of the salary',
    example: 1,
  })
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

export class GetSalaryHistoryResponseDto {
  @ApiProperty({
    description: 'The ID of the salary',
    example: 1,
  })
  id: number;
  @ApiProperty({
    description: 'The amount of the salary',
    example: 100000,
  })
  amount: number;
  @ApiProperty({
    description: 'The pay frequency of the salary',
    example: 'MONTHLY',
    enum: PayFrequency,
  })
  payFrequency: PayFrequency;
  @ApiProperty({
    description: 'The effective date of the salary',
    example: '2021-01-01',
  })
  effectiveDate: Date;
  @ApiProperty({
    description: 'The updated date of the salary',
    example: '2021-01-01',
  })
  updatedAt: Date;
  @ApiProperty({
    description: 'The employee ID of the salary',
    example: 1,
  })
  employeeId: number;

  static fromEntity(entity: Salary): GetSalaryHistoryResponseDto {
    const dto = new GetSalaryHistoryResponseDto();
    dto.id = entity.id;
    dto.amount = entity.amount.toNumber();
    dto.payFrequency = entity.payFrequency;
    dto.effectiveDate = entity.effectiveDate;
    dto.updatedAt = entity.updatedAt;
    dto.employeeId = entity.employeeId;
    return dto;
  }
}

export class GetSalaryHistoryOfEmployeeResponse extends GetCurrentSalaryResponse {}
