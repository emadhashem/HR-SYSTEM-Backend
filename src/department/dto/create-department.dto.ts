import { Department } from '@prisma/client';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateDepartmentRequestDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @MinLength(4)
  name: string;
}

export class CreateDepartmentResponseDto {
  name: string;
  id: number;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(entity: Department) {
    const response = new CreateDepartmentResponseDto();
    response.name = entity.name;
    response.id = entity.id;
    response.createdAt = entity.createdAt;
    response.updatedAt = entity.updatedAt;
    return response;
  }
}
