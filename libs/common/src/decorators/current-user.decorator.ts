import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) =>
    context.switchToHttp().getRequest().user,
);
