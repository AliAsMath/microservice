import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import {
  AUTH_PACKAGE_NAME,
  AUTH_SERVICE_NAME,
  DatabaseModule,
  LoggerModule,
  PAYMENTS_PACKAGE_NAME,
  PAYMENT_SERVICE_NAME,
} from '@app/common';
import {
  ReservationDocument,
  ReservationSchema,
} from './model/reservation.schema';
import { ReservationRepository } from './reservations.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './apps/reservations/.env',
      isGlobal: true,
      validationSchema: joi.object({
        PORT: joi.number().required(),
        MONGODB_URI: joi.string().required(),
      }),
    }),
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: ReservationDocument.name, schema: ReservationSchema },
    ]),
    LoggerModule,
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE_NAME,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: AUTH_PACKAGE_NAME,
            protoPath: join(__dirname, '../../../proto/auth.proto'),
            url: configService.getOrThrow('AUTH_GRPC_URL'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: PAYMENT_SERVICE_NAME,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: PAYMENTS_PACKAGE_NAME,
            protoPath: join(__dirname, '../../../proto/payments.proto'),
            url: configService.getOrThrow('PAYMENTS_GRPC_URL'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationRepository],
})
export class ReservationsModule {}
