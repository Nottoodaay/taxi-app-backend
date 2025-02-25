import { Test, TestingModule } from '@nestjs/testing';
import { AuthDriversController } from './auth-drivers.controller';

describe('AuthDriversController', () => {
  let controller: AuthDriversController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthDriversController],
    }).compile();

    controller = module.get<AuthDriversController>(AuthDriversController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
