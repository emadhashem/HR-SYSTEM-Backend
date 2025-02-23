import { ApiProperty } from '@nestjs/swagger';
import { PayFrequency, Salary } from '@prisma/client';
import { IsDateString, IsEnum, IsPositive } from 'class-validator';

export class CreateSalaryRequestDto {
  @IsPositive()
  @ApiProperty({
    description: 'The amount of the salary',
    example: 100000,
  })
  amount: number;
  @IsEnum(PayFrequency)
  @ApiProperty({
    description: 'The pay frequency of the salary',
    example: 'MONTHLY',
    enum: PayFrequency,
  })
  payFrequency: PayFrequency;
  @IsPositive()
  @ApiProperty({
    description: 'The employee ID of the salary',
    example: 1,
  })
  employeeId: number;
  @IsDateString()
  @ApiProperty({
    description: 'The effective date of the salary',
    example: '2021-01-01',
  })
  effectiveDate: Date;
}

export class CreateSalaryResponseDto {
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
    description: 'The employee ID of the salary',
    example: 1,
  })
  employeeId: number;
  @ApiProperty({
    description: 'The effective date of the salary',
    example: '2021-01-01',
  })
  effectiveDate: Date;
  @ApiProperty({
    description: 'The created date of the salary',
    example: '2021-01-01',
  })
  createdAt: Date;
  @ApiProperty({
    description: 'The updated date of the salary',
    example: '2021-01-01',
  })
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
