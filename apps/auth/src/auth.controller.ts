import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UsersDocument } from './model/users.schema';
import { Response } from 'express';
import { CurrentUser } from '@app/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(
    @CurrentUser() user: UsersDocument,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.login(user, res);
    res.send(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @MessagePattern('authenticate')
  async authenticate(@Payload() data: any) {
    return data.user;
  }
}
