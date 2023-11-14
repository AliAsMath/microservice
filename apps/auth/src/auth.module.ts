import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule, LoggerModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as joi from 'joi';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ApolloDriverConfig, ApolloFederationDriver } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
    }),
    ConfigModule.forRoot({
      envFilePath: './apps/auth/.env',
      isGlobal: true,
      validationSchema: joi.object({
        MONGODB_URI: joi.string().required(),
        JWT_SECRET: joi.string().required(),
        JWT_EXPIRATION: joi.number().required(),
        HTTP_PORT: joi.number().required(),
        TCP_PORT: joi.number().required(),
      }),
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRATION') },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    DatabaseModule,
    LoggerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
