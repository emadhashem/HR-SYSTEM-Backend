import { ApiProperty } from '@nestjs/swagger';
import { EmployeeStatus, GroupType, PayFrequency } from '@prisma/client';

export class GetEmployeeProfileResponseDto {
  @ApiProperty({
    example: 1,
  })
  id: number;
  @ApiProperty({
    example: 'John Doe',
  })
  name: string;
  @ApiProperty({
    example: 'john.doe@example.com',
  })
  email: string;
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
    example: 1,
  })
  departmentId: number;
  @ApiProperty({
    example: 'Active',
    enum: EmployeeStatus,
  })
  employeeStatus: EmployeeStatus;
  @ApiProperty({
    example: 'IT',
  })
  departmentName: string | null;
  @ApiProperty({
    example: [
      {
        amount: 50000,
        updatedAt: '2021-07-01T00:00:00.000Z',
        effectiveDate: '2021-07-01T00:00:00.000Z',
        payFrequency: 'Monthly',
      },
    ],
  })
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
