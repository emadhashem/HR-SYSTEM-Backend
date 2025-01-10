import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { EmployeeService } from '../employee/employee.service';
import { JwtService } from '@nestjs/jwt';
import { LoginRequestDto } from './dto/login.dto';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { Employee, GroupType } from '@prisma/client';

jest.mock('../employee/employee.service');
jest.mock('@nestjs/jwt');

describe('AuthService', () => {
  let authService: AuthService;
  let employeeService: DeepMockProxy<EmployeeService>;
  let jwtService: DeepMockProxy<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: EmployeeService,
          useFactory: () => mockDeep<EmployeeService>(),
        },
        { provide: JwtService, useFactory: () => ({ signAsync: jest.fn() }) },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    employeeService = module.get(EmployeeService);
    jwtService = module.get(JwtService);
  });

  describe('login', () => {
    it('should return access token and user information on successful login', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const mockEmployee: Employee = {
        id: 1,
        name: 'John Doe',
        email,
        groupType: GroupType.HR,
        createdAt: new Date(),
        updatedAt: new Date(),
        passwordHash: '',
      };
      const mockAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5...';

      employeeService.validateEmployee.mockResolvedValueOnce(mockEmployee);
      jwtService.signAsync.mockResolvedValueOnce(mockAccessToken);

      const loginData: LoginRequestDto = { email, password };
      const result = await authService.login(loginData);

      expect(result).toEqual({
        accessToken: mockAccessToken,
        type: 'Bearer',
        employee: {
          id: mockEmployee.id,
          name: mockEmployee.name,
          email: mockEmployee.email,
          role: mockEmployee.groupType,
        },
      });
      expect(employeeService.validateEmployee).toHaveBeenCalledWith(
        email,
        password,
      );
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        email,
        sub: mockEmployee.id,
        role: mockEmployee.groupType,
      });
    });

    it('should throw an error if employee validation fails', async () => {
      const email = 'invalid@example.com';
      const password = 'wrongpassword';
      const loginData: LoginRequestDto = { email, password };

      employeeService.validateEmployee.mockRejectedValueOnce(
        new Error('Invalid credentials'),
      );

      await expect(authService.login(loginData)).rejects.toThrowError(
        'Invalid credentials',
      );
      expect(employeeService.validateEmployee).toHaveBeenCalledWith(
        email,
        password,
      );
      expect(jwtService.signAsync).not.toHaveBeenCalled(); // Not called if validation fails
    });
  });
});
