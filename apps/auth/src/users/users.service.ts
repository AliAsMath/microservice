import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { GetUserDto } from '../dto/get-user.dto';
import { Role, User } from '@app/common';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    await this.validateCreateUser(createUserDto);
    const user = new User({
      ...createUserDto,
      roles: createUserDto.roles?.map((role) => new Role(role)),
    });

    return this.usersRepository.create(user);
  }

  private async validateCreateUser(createUser: CreateUserDto) {
    try {
      await this.usersRepository.findOne({ email: createUser.email });
    } catch (error) {
      return;
    }
    throw new UnprocessableEntityException('Email already exist.');
  }
  async verifyUser(email: string, password: string) {
    let user;
    try {
      user = await this.usersRepository.findOne({ email });
    } catch (error) {
      throw new UnauthorizedException('User not found.');
    }
    if (user.password !== password)
      throw new UnauthorizedException('Password not valid');

    return user;
  }

  async getUser(getUserDto: GetUserDto) {
    return this.usersRepository.findOne(getUserDto, { roles: true });
  }
}
