import { UseGuards } from '@nestjs/common';
import { GraphqlCurrentUser, Roles, UsersDocument } from '@app/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { PassportLocalGuard } from '../guard/graphql-jwt.guard';

@Resolver(() => UsersDocument)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => UsersDocument)
  createUser(@Args('createUserInput') createUserInput: CreateUserDto) {
    return this.usersService.create(createUserInput);
  }

  @Roles('Admin')
  @UseGuards(PassportLocalGuard)
  @Query(() => UsersDocument, { name: 'currentUser' })
  getCurrentUser(@GraphqlCurrentUser() currentUser: UsersDocument) {
    return currentUser;
  }
}
