import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { DatabaseModule, LoggerModule } from '@app/common';
import {
  ReservationDocument,
  ReservationSchema,
} from './model/reservation.schema';
import { ReservationRepository } from './reservations.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE, PAYMENTS_SERVICE } from '@app/common/constants';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig, ApolloFederationDriver } from '@nestjs/apollo';
import { ReservationsResolver } from './reservations.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
    }),
    ConfigModule.forRoot({
      envFilePath: './apps/reservations/.env',
      isGlobal: true,
      validationSchema: joi.object({
        PORT: joi.number().required(),
        MONGODB_URI: joi.string().required(),
        AUTH_HOST: joi.string().required(),
        AUTH_PORT: joi.number().required(),
        PAYMENTS_HOST: joi.string().required(),
        PAYMENTS_PORT: joi.number().required(),
      }),
    }),
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: ReservationDocument.name, schema: ReservationSchema },
    ]),
    LoggerModule,
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('AUTH_HOST'),
            port: configService.get('AUTH_PORT'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: PAYMENTS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('PAYMENTS_HOST'),
            port: configService.get('PAYMENTS_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationRepository, ReservationsResolver],
})
export class ReservationsModule {}
