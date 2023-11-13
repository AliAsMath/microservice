import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import {
  NotificationsServiceController,
  NotificationsServiceControllerMethods,
  NotifyEmailMessage,
} from '@app/common';
import { of } from 'rxjs';

@Controller()
@NotificationsServiceControllerMethods()
export class NotificationsController implements NotificationsServiceController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UsePipes(new ValidationPipe())
  notifyEmail(data: NotifyEmailMessage) {
    console.log(`notify email to ${data.email}`);
    return of();
  }
}
