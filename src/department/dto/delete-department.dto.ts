import { IsNotEmpty, IsPositive } from 'class-validator';

export class DeleteDepartmentRequestDto {
  @IsNotEmpty()
  @IsPositive()
  id: number;
}
