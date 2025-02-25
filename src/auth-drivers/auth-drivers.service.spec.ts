import { Test, TestingModule } from '@nestjs/testing';
import { AuthDriversService } from './auth-drivers.service';

describe('AuthDriversService', () => {
  let service: AuthDriversService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthDriversService],
    }).compile();

    service = module.get<AuthDriversService>(AuthDriversService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
