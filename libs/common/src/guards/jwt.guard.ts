import { AUTH_SERVICE_NAME, AuthServiceClient } from '@app/common';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Reflector } from '@nestjs/core';

export class JwtAuthGuard implements CanActivate, OnModuleInit {
  private authService: AuthServiceClient;

  constructor(
    @Inject(AUTH_SERVICE_NAME) private readonly client: ClientGrpc,
    private readonly reflector: Reflector,
  ) {}

  onModuleInit() {
    this.authService =
      this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const jwt = context.switchToHttp().getRequest().cookies?.Authentication;

    if (!jwt) return false;

    const roles = this.reflector.get('roles', context.getHandler());

    return this.authService.authenticate({ Authentication: jwt }).pipe(
      tap((res) => {
        if (roles)
          for (const role of roles)
            if (!res.roles.includes(role))
              throw new UnauthorizedException(
                'User dose not have enough role.',
              );
        context.switchToHttp().getRequest().user = { ...res, _id: res.id };
      }),
      map(() => true),
      catchError(() => of(false)),
    );
  }
}
