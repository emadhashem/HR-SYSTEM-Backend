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
import { CreateDepartmentRequestDto } from './dto/create-department.dto';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { GroupType } from '@prisma/client';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { DepartmentService } from './department.service';
import { UpdateDepartmentRequestDto } from './dto/update-department.dto';

@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post('/create')
  @UseGuards(RolesGuard)
  @Roles([GroupType.HR])
  async createDepartment(
    @Body() createDepartmentDto: CreateDepartmentRequestDto,
  ) {
    return await this.departmentService.createDepartment(createDepartmentDto);
  }

  @Patch('/update/:id')
  @UseGuards(RolesGuard)
  @Roles([GroupType.HR])
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
  async deleteDepartment(@Param('id', ParseIntPipe) id: number) {
    return await this.departmentService.deleteDepartment(id);
  }

  @Get('/all')
  async getAllDepartments() {
    return await this.departmentService.getAllDepartments();
  }

  @Get('/all/with-employees')
  async getAllDepartmentsWithEmployees() {
    return await this.departmentService.getAllDepartmentsWithEmployees();
  }
}
