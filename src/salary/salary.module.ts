import { Module } from '@nestjs/common';
import { SalaryService } from './salary.service';
import { SalaryController } from './salary.controller';
import { PrismaService } from 'src/shared/services/prisma.service';

@Module({
  providers: [SalaryService, PrismaService],
  controllers: [SalaryController],
})
export class SalaryModule {}
