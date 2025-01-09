import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { PrismaService } from 'src/shared/services/prisma.service';

@Module({
  providers: [EmployeeService, PrismaService],
  controllers: [EmployeeController],
  exports: [EmployeeService],
})
export class EmployeeModule {}
