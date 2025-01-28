import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  CreateEmployeeRequestDto,
  CreateEmployeeResponseDto,
} from './dto/create-employee.dto';
import { EmployeeService } from './employee.service';
import { Roles } from '../shared/decorators/roles.decorator';
import { GroupType } from '@prisma/client';
import { RolesGuard } from '../shared/guards/roles.guard';
import {
  UpdateEmployeeRequestDto,
  UpdateEmployeeResponseDto,
} from './dto/update-employee';
import { FindEmployeeResponseDto } from './dto/find-employees.dto';
import { PaginatedOutputDto } from '../shared/types/paginated-output.dto';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post('/create')
  @UseGuards(RolesGuard)
  @Roles([GroupType.HR])
  @UseInterceptors(ClassSerializerInterceptor)
  async createEmployee(
    @Body() createEmployeeDto: CreateEmployeeRequestDto,
  ): Promise<CreateEmployeeResponseDto> {
    return this.employeeService.createEmployee(createEmployeeDto);
  }

  @Patch('/update/:id')
  @UseGuards(RolesGuard)
  @Roles([GroupType.HR])
  @UseInterceptors(ClassSerializerInterceptor)
  async updateEmployee(
    @Body() createEmployeeDto: UpdateEmployeeRequestDto,
    @Param('id') id: number,
  ): Promise<UpdateEmployeeResponseDto> {
    return this.employeeService.updateEmployee(id, createEmployeeDto);
  }

  @Delete('/delete/:id')
  @UseGuards(RolesGuard)
  @Roles([GroupType.HR])
  @UseInterceptors(ClassSerializerInterceptor)
  async deleteEmployee(@Param('id') id: number): Promise<{ message: string }> {
    return { message: await this.employeeService.deleteEmployee(id) };
  }

  @Get('/get-all')
  @UseGuards(RolesGuard)
  @Roles([GroupType.HR])
  @UseInterceptors(ClassSerializerInterceptor)
  async getEmployees(
    @Query('page') page: number = 1,
    @Query('perPage') perPage: number = 10,
    @Query('search') search: string = '',
  ): Promise<PaginatedOutputDto<FindEmployeeResponseDto>> {
    return this.employeeService.getEmployees({
      page,
      perPage,
      search,
    });
  }
}
