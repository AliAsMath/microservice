import {
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { AUTH_SERVICE } from '../constants';
import { UserDto } from '../dto';
import { Reflector } from '@nestjs/core';

export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(AUTH_SERVICE) private readonly clientProxy: ClientProxy,
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const jwt = context.switchToHttp().getRequest().cookies?.Authentication;

    if (!jwt) return false;

    const roles = this.reflector.get('roles', context.getHandler());

    return this.clientProxy
      .send<UserDto>('authenticate', { Authentication: jwt })
      .pipe(
        tap((res) => {
          if (roles)
            for (const role of roles)
              if (!res.roles.includes(role))
                throw new UnauthorizedException(
                  'User dose not have enough role.',
                );
          context.switchToHttp().getRequest().user = res;
        }),
        map(() => true),
        catchError(() => of(false)),
      );
  }
}
