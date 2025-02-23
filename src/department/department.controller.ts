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
import {
  CreateDepartmentRequestDto,
  CreateDepartmentResponseDto,
} from './dto/create-department.dto';
import { RolesGuard } from '../shared/guards/roles.guard';
import { GroupType } from '@prisma/client';
import { Roles } from '../shared/decorators/roles.decorator';
import { DepartmentService } from './department.service';
import {
  UpdateDepartmentRequestDto,
  UpdateDepartmentResponseDto,
} from './dto/update-department.dto';
import { ApiResponse } from '@nestjs/swagger';
import {
  GetAllDepartmentsResponseDto,
  GetAllDepartmentsWithEmployeesResponseDto,
} from './dto/get-department.dto';

@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post('/create')
  @UseGuards(RolesGuard)
  @Roles([GroupType.HR])
  @ApiResponse({
    status: 201,
    description: 'The department has been successfully created.',
    type: CreateDepartmentResponseDto,
  })
  async createDepartment(
    @Body() createDepartmentDto: CreateDepartmentRequestDto,
  ) {
    return await this.departmentService.createDepartment(createDepartmentDto);
  }

  @Patch('/update/:id')
  @UseGuards(RolesGuard)
  @Roles([GroupType.HR])
  @ApiResponse({
    status: 200,
    description: 'The department has been successfully updated.',
    type: UpdateDepartmentResponseDto,
  })
  async updateDepartment(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDepartmentRequestDto: UpdateDepartmentRequestDto,
  ) {
    return await this.departmentService.updateDepartment(
      id,
      updateDepartmentRequestDto,
    );
  }

  @Delete('/delete/:id')
  @UseGuards(RolesGuard)
  @Roles([GroupType.HR])
  @ApiResponse({
    status: 200,
    description: 'The department has been successfully deleted.',
  })
  async deleteDepartment(@Param('id', ParseIntPipe) id: number) {
    return await this.departmentService.deleteDepartment(id);
  }

  @Get('/all')
  @ApiResponse({
    status: 200,
    description: 'All departments have been successfully retrieved.',
    type: GetAllDepartmentsResponseDto,
    isArray: true,
  })
  async getAllDepartments() {
    return await this.departmentService.getAllDepartments();
  }

  @Get('/all/with-employees')
  @ApiResponse({
    status: 200,
    description:
      'All departments with employees have been successfully retrieved.',
    type: GetAllDepartmentsWithEmployeesResponseDto,
    isArray: true,
  })
  async getAllDepartmentsWithEmployees() {
    return await this.departmentService.getAllDepartmentsWithEmployees();
  }
}
