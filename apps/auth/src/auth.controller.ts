import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import {
  AuthServiceController,
  AuthServiceControllerMethods,
  UsersDocument,
} from '@app/common';
import { Response } from 'express';
import { CurrentUser } from '@app/common';

@Controller()
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
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
  async authenticate(data: any) {
    return { ...data.user, id: data.user._id };
  }
}
