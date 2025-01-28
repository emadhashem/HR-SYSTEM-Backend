import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from '../src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import * as request from 'supertest';
import { GroupType, PrismaClient } from '@prisma/client';
import { LoginRequestDto, LoginResponseDto } from '../src/auth/dto/login.dto';
import { PrismaService } from '../src/shared/services/prisma.service';
import { Bcrypt } from '../src/shared/utils/bcrypt';

describe('AuthController', () => {
  let app: INestApplication;
  let prisma: DeepMockProxy<PrismaClient>;
  let loginRequest: LoginRequestDto;
  let loginResponse: LoginResponseDto;
  let bcrypt: DeepMockProxy<Bcrypt>;
  let employee;
  beforeEach(async () => {
    prisma = mockDeep<PrismaClient>();
    bcrypt = mockDeep<Bcrypt>();
    employee = {
      id: 1,
      email: 'test@example.com',
      name: 'test',
      groupType: GroupType.HR, // Set groupType to HR
      createdAt: new Date(),
      passwordHash: 'hashpassword',
      updatedAt: new Date(),
    };

    loginRequest = {
      email: 'test@example.com',
      password: '1234',
    };

    loginResponse = {
      accessToken: 'access_token',
      employee: {
        email: employee.email,
        id: employee.id,
        name: employee.name,
        role: employee.groupType,
      },
      type: 'Bearer',
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .overrideProvider(Bcrypt)
      .useValue(bcrypt)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  it('/auth/login (POST) should login successfully ', async () => {
    bcrypt.compare.mockResolvedValue(true);
    prisma.employee.findFirst.mockResolvedValue(employee);
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginRequest)
      .expect(201);
    Object.keys(loginResponse).forEach((key) => {
      expect(response.body).toHaveProperty(key);
    });
  });

  it('/auth/login (POST) should fail ', async () => {
    prisma.employee.findFirst.mockResolvedValue(null);
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginRequest)
      .expect(400);
    expect(response.body).toEqual({
      statusCode: 400,
      message: 'HR Employee with these Email And Password not Found!',
      error: 'Bad Request',
    });
  });

  it('/auth/login (POST) should fail 2 ', async () => {
    prisma.employee.findFirst.mockResolvedValue(employee);
    bcrypt.compare.mockResolvedValue(false);
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginRequest)
      .expect(400);
    expect(response.body).toEqual({
      statusCode: 400,
      message: 'User with these Email And Password not Found!',
      error: 'Bad Request',
    });
  });
});
