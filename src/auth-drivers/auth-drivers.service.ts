import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DriversService } from '../drivers/drivers.service';
import { Driver } from '../drivers/schemas/driver.schema';

@Injectable()
export class AuthDriversService {
  constructor(
    private readonly driversService: DriversService,
    private readonly jwtService: JwtService,
  ) {}

  async validateDriver(
    email: string,
    password: string,
  ): Promise<Driver | null> {
    const driver = await this.driversService.findByEmail(email);
    if (driver && driver.password === password) {
      return driver;
    }
    return null;
  }

  async login(driver: Driver) {
    const payload = { email: driver.email, sub: driver._id.toHexString() };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
