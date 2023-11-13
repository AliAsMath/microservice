import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationRepository } from './reservations.repository';
import { ClientGrpc } from '@nestjs/microservices';
import { catchError, map, of } from 'rxjs';
import {
  PAYMENT_SERVICE_NAME,
  PaymentServiceClient,
  UsersDocument,
} from '@app/common';

@Injectable()
export class ReservationsService implements OnModuleInit {
  private paymentsService: PaymentServiceClient;
  constructor(
    private readonly reservationRepository: ReservationRepository,
    @Inject(PAYMENT_SERVICE_NAME) private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.paymentsService =
      this.client.getService<PaymentServiceClient>(PAYMENT_SERVICE_NAME);
  }

  async create(
    createReservationDto: CreateReservationDto,
    { _id: userId, email }: UsersDocument,
  ) {
    return this.paymentsService.createCharge({ id: '1234', email }).pipe(
      map((res) => {
        console.log(res);
        return this.reservationRepository.create({
          ...createReservationDto,
          timestamps: new Date(),
          userId: userId.toString(),
          invoiceId: res.id,
        });
      }),
      catchError((err) => of(err)),
    );
  }

  findAll() {
    return this.reservationRepository.find({});
  }

  findOne(_id: string) {
    return this.reservationRepository.findOne({ _id });
  }

  update(_id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationRepository.findOneAndUpdate(
      { _id },
      { $set: updateReservationDto },
    );
  }

  remove(_id: string) {
    return this.reservationRepository.findOneAndDelete({ _id });
  }
}
