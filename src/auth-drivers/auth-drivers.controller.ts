import { Body, Controller, Post } from '@nestjs/common';
import { AuthDriversService } from './auth-drivers.service';

@Controller('auth-drivers')
export class AuthDriversController {
  constructor(private readonly authDriversService: AuthDriversService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const driver = await this.authDriversService.validateDriver(
      body.email,
      body.password,
    );
    if (!driver) {
      return { message: 'Invalid email or password' };
    }
    return this.authDriversService.login(driver);
  }
}
