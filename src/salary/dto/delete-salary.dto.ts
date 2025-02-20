import { IsPositive } from 'class-validator';

export class DeleteSalaryRequestDto {
  @IsPositive()
  id: number;
}
