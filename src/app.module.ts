import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import {ConfigModule} from '@nestjs/config';
import { EmployeeModule } from './employee/employee.module';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  imports: [AuthModule, AuthModule, ConfigModule.forRoot({
    envFilePath: '.env',
    isGlobal: true,
  }), EmployeeModule, AttendanceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
