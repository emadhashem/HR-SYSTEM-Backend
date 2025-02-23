import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
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
  AssignDepartmentToEmployeeResponseDto,
  UpdateEmployeeRequestDto,
  UpdateEmployeeResponseDto,
} from './dto/update-employee';
import { FindEmployeeResponseDto } from './dto/find-employees.dto';
import { PaginatedOutputDto } from '../shared/types/paginated-output.dto';
import { ApiResponse } from '@nestjs/swagger';
import { GetEmployeeProfileResponseDto } from './dto/employee-profile';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post('/create')
  @UseGuards(RolesGuard)
  @Roles([GroupType.HR])
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({
    status: 201,
    description: 'The employee has been successfully created.',
    type: CreateEmployeeResponseDto,
  })
  async createEmployee(
    @Body() createEmployeeDto: CreateEmployeeRequestDto,
  ): Promise<CreateEmployeeResponseDto> {
    return this.employeeService.createEmployee(createEmployeeDto);
  }

  @Patch('/update/:id')
  @UseGuards(RolesGuard)
  @Roles([GroupType.HR])
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({
    status: 200,
    description: 'The employee has been successfully updated.',
    type: UpdateEmployeeResponseDto,
  })
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
  @ApiResponse({
    status: 200,
    description: 'The employee has been successfully deleted.',
  })
  async deleteEmployee(@Param('id') id: number): Promise<{ message: string }> {
    return { message: await this.employeeService.deleteEmployee(id) };
  }

  @Get('/get-all')
  @UseGuards(RolesGuard)
  @Roles([GroupType.HR])
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({
    status: 200,
    description: 'All employees have been successfully retrieved.',
    type: FindEmployeeResponseDto,
    isArray: true,
  })
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

  @Patch('/assign-department/:employeeId/:departmentId')
  @UseGuards(RolesGuard)
  @Roles([GroupType.HR])
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({
    status: 200,
    description:
      'The department has been successfully assigned to the employee.',
    type: AssignDepartmentToEmployeeResponseDto,
  })
  async assignDepartmentToEmployee(
    @Param('employeeId', ParseIntPipe) employeeId: number,
    @Param('departmentId', ParseIntPipe) departmentId: number,
  ) {
    return await this.employeeService.assignDepartmentToEmployee(
      employeeId,
      departmentId,
    );
  }

  @Get('/profile/:id')
  @UseGuards(RolesGuard)
  @Roles([GroupType.HR])
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({
    status: 200,
    description: 'The employee profile has been successfully retrieved.',
    type: GetEmployeeProfileResponseDto,
  })
  async getEmployeeProfile(@Param('id', ParseIntPipe) id: number) {
    return await this.employeeService.getEmployeeProfileById(id);
  }
}
