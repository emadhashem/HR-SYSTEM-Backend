import { Injectable } from '@nestjs/common';
import { LoginRequestDto } from './dto/login.dto';
import { EmployeeService } from 'src/employee/employee.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly jwtService: JwtService,
  ) {}
  async login(loginRequestDto: LoginRequestDto) {
    const employee = await this.employeeService.validateEmployee(
      loginRequestDto.email,
      loginRequestDto.password,
    );

    const accessToken = await this.jwtService.signAsync({
      email: employee.email,
      sub: employee.id,
      role: employee.groupType,
    });

    return {
      accessToken,
      type: 'Bearer',
      employee: {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        role: employee.groupType,
      },
    };
  }
}
