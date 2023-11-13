import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationRepository } from './reservations.repository';
import { PAYMENTS_SERVICE } from '@app/common/constants';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, map, of } from 'rxjs';
import { CreateChargeDto } from '@app/common/dto';
import { UsersDocument } from '@app/common';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    @Inject(PAYMENTS_SERVICE) private readonly paymentsService: ClientProxy,
  ) {}
  async create(
    createReservationDto: CreateReservationDto,
    { _id: userId, email }: UsersDocument,
  ) {
    return this.paymentsService
      .send<CreateChargeDto>('create-charge', { id: '1234', email })
      .pipe(
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
