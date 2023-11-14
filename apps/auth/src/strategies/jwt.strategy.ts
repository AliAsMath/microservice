import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { tokenPayload } from '../interfaces/tokenPayload.interface';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: any) =>
          req?.cookies?.Authentication ||
          req?.Authentication ||
          req?.headers?.authentication,
      ]),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate({ userId }: tokenPayload) {
    return await this.usersService.getUser({ _id: userId });
  }
}
