import { PayFrequency, Salary } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { CreateSalaryResponseDto } from './create-salary.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSalaryRequestDto {
  @IsEnum(PayFrequency)
  @IsOptional()
  @ApiProperty({
    description: 'The pay frequency of the salary',
    example: 'MONTHLY',
    enum: PayFrequency,
  })
  payFrequency?: PayFrequency;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    description: 'The effective date of the salary',
    example: '2021-01-01',
  })
  effectiveDate?: Date;
}

export class UpdateSalaryResponseDto extends CreateSalaryResponseDto {
  static fromEntity(entity: Salary): UpdateSalaryResponseDto {
    const dto = new UpdateSalaryResponseDto();
    dto.amount = entity.amount.toNumber();
    dto.payFrequency = entity.payFrequency;
    dto.employeeId = entity.employeeId;
    dto.effectiveDate = entity.effectiveDate;
    dto.id = entity.id;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }
}
