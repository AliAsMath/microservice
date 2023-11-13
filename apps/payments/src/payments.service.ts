import {
  NOTIFICATIONS_SERVICE_NAME,
  NotificationsServiceClient,
} from '@app/common';
import { CreateChargeDto } from '@app/common/dto';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class PaymentsService implements OnModuleInit {
  private notificationsService: NotificationsServiceClient;

  constructor(
    @Inject(NOTIFICATIONS_SERVICE_NAME)
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.notificationsService =
      this.client.getService<NotificationsServiceClient>(
        NOTIFICATIONS_SERVICE_NAME,
      );
  }

  async createCharge({ email, id }: CreateChargeDto) {
    console.log(`create charge with id ${id}`);
    if (!this.notificationsService)
      this.notificationsService =
        this.client.getService<NotificationsServiceClient>(
          NOTIFICATIONS_SERVICE_NAME,
        );
    this.notificationsService.notifyEmail({ email }).subscribe(() => {});
  }
}
