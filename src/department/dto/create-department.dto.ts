import { ApiProperty } from '@nestjs/swagger';
import { Department } from '@prisma/client';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateDepartmentRequestDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @MinLength(4)
  @ApiProperty({
    example: 'IT',
  })
  name: string;
}

export class CreateDepartmentResponseDto {
  @ApiProperty({
    example: 'IT',
  })
  name: string;
  @ApiProperty({
    example: 1,
  })
  id: number;
  @ApiProperty({
    example: '2021-07-01T00:00:00.000Z',
  })
  createdAt: Date;
  @ApiProperty({
    example: '2021-07-01T00:00:00.000Z',
  })
  updatedAt: Date;
  @ApiProperty({
    example: [],
  })
  employees = [];
  static fromEntity(entity: Department) {
    const response = new CreateDepartmentResponseDto();
    response.name = entity.name;
    response.id = entity.id;
    response.createdAt = entity.createdAt;
    response.updatedAt = entity.updatedAt;
    return response;
  }
}
