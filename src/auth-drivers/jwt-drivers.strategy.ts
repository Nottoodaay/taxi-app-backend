import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { DriversService } from '../drivers/drivers.service';

@Injectable()
export class JwtDriversStrategy extends PassportStrategy(
  Strategy,
  'jwt-drivers',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly driversService: DriversService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const driver = await this.driversService.findById(payload.sub);
    if (!driver) {
      throw new UnauthorizedException();
    }
    return driver;
  }
}
