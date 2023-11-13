import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationRepository } from './reservations.repository';
import { PAYMENTS_SERVICE } from '@app/common/constants';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, map, of } from 'rxjs';
import { CreateChargeDto } from '@app/common/dto';
import { Reservation } from './model/reservation.entity';
import { User } from '@app/common';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    @Inject(PAYMENTS_SERVICE) private readonly paymentsService: ClientProxy,
  ) {}
  async create(
    createReservationDto: CreateReservationDto,
    { id: userId, email }: User,
  ) {
    return this.paymentsService
      .send<CreateChargeDto>('create-charge', { id: '1234', email })
      .pipe(
        map((res) => {
          console.log(res);
          const reservation = new Reservation({
            ...createReservationDto,
            timestamps: new Date(),
            userId,
            invoiceId: res.id,
          });
          return this.reservationRepository.create(reservation);
        }),
        catchError((err) => of(err)),
      );
  }

  findAll() {
    return this.reservationRepository.find({});
  }

  findOne(id: number) {
    return this.reservationRepository.findOne({ id });
  }

  update(id: number, updateReservationDto: UpdateReservationDto) {
    return this.reservationRepository.findOneAndUpdate(
      { id },
      updateReservationDto,
    );
  }

  remove(id: number) {
    return this.reservationRepository.findOneAndDelete({ id });
  }
}
