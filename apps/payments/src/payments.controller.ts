import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreateChargeDto } from '@app/common/dto';
import {
  PaymentServiceController,
  PaymentServiceControllerMethods,
} from '@app/common';

@Controller()
@PaymentServiceControllerMethods()
export class PaymentsController implements PaymentServiceController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UsePipes(new ValidationPipe())
  async createCharge(data: CreateChargeDto) {
    this.paymentsService.createCharge(data);
    return { id: 'id_' + data.id };
  }
}
