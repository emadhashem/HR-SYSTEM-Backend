import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class EmployeeService {
  constructor(private readonly prisma: PrismaService) {}

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
