import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import * as bcrypt from 'bcrypt';
import {
  CreateEmployeeRequestDto,
  CreateEmployeeResponseDto,
} from './dto/create-employee.dto';
@Injectable()
export class EmployeeService {
  constructor(private readonly prisma: PrismaService) {}

  async createEmployee(createEmployeeDto: CreateEmployeeRequestDto) {
    let passwordHash: string | null = null;
    if (createEmployeeDto.groupType == 'HR')
      passwordHash = await bcrypt.hash(createEmployeeDto.password, 10);
    try {
      const employee = await this.prisma.employee.create({
        data: {
          name: createEmployeeDto.name,
          email: createEmployeeDto.email,
          passwordHash,
          groupType: createEmployeeDto.groupType,
        },
      });

      return CreateEmployeeResponseDto.fromEntity(employee);
    } catch (error) {
      if (error.code == 'P2002') {
        throw new BadRequestException('Email already exists!');
      }
      throw new BadRequestException(error.message);
    }
  }

  async validateEmployee(email: string, password: string) {
    const employee = await this.prisma.employee.findFirst({
      where: {
        email,
      },
    });
    const isPasswordMatch = await bcrypt.compare(
      password,
      employee.passwordHash,
    );
    if (!employee || !isPasswordMatch) {
      throw new BadRequestException(
        'User with these Email And Password not Found!',
      );
    }
    return employee;
  }
}
