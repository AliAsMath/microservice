import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) =>
    context.switchToHttp().getRequest().user,
);

export const GraphqlCurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) =>
    context.getArgByIndex(2).req?.user,
);
