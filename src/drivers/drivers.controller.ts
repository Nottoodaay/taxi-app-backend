import { Body, Controller, Post } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { Driver } from './schemas/driver.schema';

@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post('register')
  async registerDriver(
    @Body()
    body: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      phoneNumber: string;
      carNumber: string;
    },
  ): Promise<Driver> {
    return this.driversService.createDriver(
      body.firstName,
      body.lastName,
      body.email,
      body.password,
      body.phoneNumber,
      body.carNumber,
    );
  }
}
