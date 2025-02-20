import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GroupType } from '@prisma/client';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { CreateSalaryRequestDto } from './dto/create-salary.dto';
import { SalaryService } from './salary.service';
import { UpdateSalaryRequestDto } from './dto/update-salary.dto';

@Controller('salary')
export class SalaryController {
  constructor(private readonly salaryService: SalaryService) {}

  @Post('/create')
  @UseGuards(RolesGuard)
  @Roles([GroupType.HR])
  async createSalary(@Body() createSalaryDto: CreateSalaryRequestDto) {
    return await this.salaryService.createSalary(createSalaryDto);
  }

  @Patch('/update/:id')
  @UseGuards(RolesGuard)
  @Roles([GroupType.HR])
  async updateSalary(
    @Body() updateSalaryDto: UpdateSalaryRequestDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.salaryService.updateSalary(id, updateSalaryDto);
  }

  @Delete('/delete/:id')
  @UseGuards(RolesGuard)
  @Roles([GroupType.HR])
  async deleteSalary(@Param('id', ParseIntPipe) id: number) {
    return await this.salaryService.deleteSalary(id);
  }

  @Get('/history/:emp_id')
  @UseGuards(RolesGuard)
  @Roles([GroupType.HR])
  async getSalaryHistoryByEmployee(
    @Param('emp_id', ParseIntPipe) empId: number,
  ) {
    return await this.salaryService.getSalaryHistoryByEmployee(empId);
  }

  @Get('/current/:emp_id')
  @UseGuards(RolesGuard)
  @Roles([GroupType.HR])
  async getCurrentSalaryByEmployee(
    @Param('emp_id', ParseIntPipe) empId: number,
  ) {
    return await this.salaryService.getCurrentSalaryByEmployee(empId);
  }
}
