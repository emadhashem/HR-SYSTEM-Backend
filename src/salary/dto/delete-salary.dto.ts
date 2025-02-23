import { ApiProperty } from '@nestjs/swagger';
import { IsPositive } from 'class-validator';

export class DeleteSalaryRequestDto {
  @IsPositive()
  @ApiProperty({
    description: 'The ID of the salary',
    example: 1,
  })
  id: number;
}
