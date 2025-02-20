import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import {
  CreateSalaryRequestDto,
  CreateSalaryResponseDto,
} from './dto/create-salary.dto';
import {
  UpdateSalaryRequestDto,
  UpdateSalaryResponseDto,
} from './dto/update-salary.dto';
import { GetCurrentSalaryResponse } from './dto/get-salary.dto';

@Injectable()
export class SalaryService {
  constructor(private readonly prisma: PrismaService) {}

  async createSalary(data: CreateSalaryRequestDto) {
    try {
      const salary = await this.prisma.salary.create({
        data: {
          amount: data.amount,
          payFrequency: data.payFrequency,
          employeeId: data.employeeId,
          effectiveDate: new Date(data.effectiveDate),
        },
      });
      return CreateSalaryResponseDto.fromEntity(salary);
    } catch (error) {
      if (error.message.includes('foreign key')) {
        throw new BadRequestException('Employee not found');
      }
      throw new BadRequestException(
        'Error while creating new Salary' + error.message,
      );
    }
  }

  async updateSalary(id: number, data: UpdateSalaryRequestDto) {
    try {
      const salary = await this.prisma.salary.update({
        where: { id },
        data: {
          ...(data.payFrequency && { payFrequency: data.payFrequency }),
          ...(data.effectiveDate && {
            effectiveDate: new Date(data.effectiveDate),
          }),
        },
      });
      if (!salary) {
        throw new Error('Salary not found');
      }
      return UpdateSalaryResponseDto.fromEntity(salary);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException('Salary not found');
      }
      throw new BadRequestException(
        'Error while updating Salary' + error.message,
      );
    }
  }

  async deleteSalary(id: number) {
    try {
      const salary = await this.prisma.salary.delete({
        where: { id },
      });
      if (!salary) {
        throw new BadRequestException('Salary not found');
      }
      return 'Salary deleted Successfully';
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException('Salary not found');
      }
      throw new BadRequestException(
        'Error while deleting Salary' + error.message,
      );
    }
  }

  async getSalaryHistoryByEmployee(empId: number) {
    try {
      const salary = await this.prisma.salary.findMany({
        where: { employeeId: empId },
        orderBy: { effectiveDate: 'desc' },
      });
      if (!salary) {
        throw new Error('Salary not found');
      }
      return salary.map((salary) =>
        GetCurrentSalaryResponse.fromEntity(salary),
      );
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException('Salary not found');
      }
      throw new BadRequestException(
        'Error while getting Salary' + error.message,
      );
    }
  }

  async getCurrentSalaryByEmployee(empId: number) {
    try {
      const salary = await this.prisma.salary.findFirst({
        where: { employeeId: empId },
        orderBy: { effectiveDate: 'desc' },
      });
      if (!salary) {
        throw new Error('Salary not found');
      }
      return GetCurrentSalaryResponse.fromEntity(salary);
    } catch (error) {
      if (error.message.includes('not found')) {
        throw new BadRequestException('Salary not found');
      }
      throw new BadRequestException(
        'Error while getting Salary' + error.message,
      );
    }
  }
}
