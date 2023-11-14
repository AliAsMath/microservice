import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from '@app/common';
import { UsersDocument, UsersSchema } from '@app/common';
import { UsersRepository } from './users.repository';
import { UsersResolver } from './users.resolver';

@Module({
  imports: [
    DatabaseModule.forFeature([
      { name: UsersDocument.name, schema: UsersSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
