import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(
    @Body()
    body: {
      userName: string;
      password: string;
      personalNumber: string;
      email: string;
      phoneNumber: string;
    },
  ): Promise<User> {
    return this.usersService.create(
      body.userName,
      body.password,
      body.personalNumber,
      body.email,
      body.phoneNumber,
    );
  }
}
