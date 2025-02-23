import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive } from 'class-validator';

export class DeleteDepartmentRequestDto {
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty({
    example: 1,
  })
  id: number;
}
