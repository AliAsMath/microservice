import { CreateUserDto } from './../dto/create-user.dto';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersDocument } from '../model/users.schema';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '@app/common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getUser(@CurrentUser() currentUser: UsersDocument) {
    return currentUser;
  }
}
