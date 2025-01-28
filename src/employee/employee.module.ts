import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { PrismaService } from '../shared/services/prisma.service';
import { Bcrypt } from '../shared/utils/bcrypt';

@Module({
  providers: [EmployeeService, PrismaService, Bcrypt],
  controllers: [EmployeeController],
  exports: [EmployeeService],
})
export class EmployeeModule {}
