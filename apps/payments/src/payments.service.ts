import { NOTIFICATIONS_SERVICE } from '@app/common/constants';
import { CreateChargeDto } from '@app/common/dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PaymentsService {
  constructor(
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsService: ClientProxy,
  ) {}

  async createCharge({ email, id }: CreateChargeDto) {
    console.log(`create charge with id ${id}`);
    this.notificationsService.emit('notify-email', { email });
  }
}
