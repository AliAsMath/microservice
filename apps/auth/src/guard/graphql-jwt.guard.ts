import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class PassportLocalGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    const isValidUser = await super.canActivate(
      new ExecutionContextHost([req]),
    );
    if (!isValidUser) return false;

    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    for (const role of roles) if (!req.user.roles.includes(role)) return false;

    return true;
  }

  // handleRequest(err: any, user: any) {
  //   if (err) {
  //    throw err;
  //    }

  //   if (!user) {
  //    throw new AuthenticationError('Auth Error! User not found');
  //    }

  //   return user;
  //  }
}
