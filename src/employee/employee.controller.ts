import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  CreateEmployeeRequestDto,
  CreateEmployeeResponseDto,
} from './dto/create-employee.dto';
import { EmployeeService } from './employee.service';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { GroupType } from '@prisma/client';
import { RolesGuard } from 'src/shared/guards/roles.guard';

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
}
