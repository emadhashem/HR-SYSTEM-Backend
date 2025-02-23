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
import {
  CreateSalaryRequestDto,
  CreateSalaryResponseDto,
} from './dto/create-salary.dto';
import { SalaryService } from './salary.service';
import {
  UpdateSalaryRequestDto,
  UpdateSalaryResponseDto,
} from './dto/update-salary.dto';
import { ApiResponse } from '@nestjs/swagger';
import {
  GetSalaryHistoryResponseDto,
  GetSalaryHistoryOfEmployeeResponse,
} from './dto/get-salary.dto';

@Controller('salary')
export class SalaryController {
  constructor(private readonly salaryService: SalaryService) {}

  @Post('/create')
  @UseGuards(RolesGuard)
  @Roles([GroupType.HR])
  @ApiResponse({
    status: 200,
    description: 'The salary created successfully',
    type: CreateSalaryResponseDto,
  })
  async createSalary(@Body() createSalaryDto: CreateSalaryRequestDto) {
    return await this.salaryService.createSalary(createSalaryDto);
  }

  @Patch('/update/:id')
  @UseGuards(RolesGuard)
  @Roles([GroupType.HR])
  @ApiResponse({
    status: 200,
    description: 'The salary updated successfully',
    type: UpdateSalaryResponseDto,
  })
  async updateSalary(
    @Body() updateSalaryDto: UpdateSalaryRequestDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.salaryService.updateSalary(id, updateSalaryDto);
  }

  @Delete('/delete/:id')
  @UseGuards(RolesGuard)
  @Roles([GroupType.HR])
  @ApiResponse({
    status: 200,
    description: 'The salary deleted successfully',
  })
  async deleteSalary(@Param('id', ParseIntPipe) id: number) {
    return await this.salaryService.deleteSalary(id);
  }

  @Get('/history')
  @UseGuards(RolesGuard)
  @Roles([GroupType.HR])
  @ApiResponse({
    status: 200,
    description: 'The salary history of the company',
    type: GetSalaryHistoryResponseDto,
    isArray: true,
  })
  async getSalaryHistory() {
    return await this.salaryService.getSalaryHistory();
  }

  @Get('/history/:emp_id')
  @UseGuards(RolesGuard)
  @Roles([GroupType.HR])
  @ApiResponse({
    status: 200,
    description: 'The salary history of the employee',
    type: GetSalaryHistoryOfEmployeeResponse,
    isArray: true,
  })
  async getSalaryHistoryByEmployee(
    @Param('emp_id', ParseIntPipe) empId: number,
  ) {
    return await this.salaryService.getSalaryHistoryByEmployee(empId);
  }
}
