import { IsEmail, IsString } from 'class-validator';
import { CreateChargeMessage } from '../types';

export class CreateChargeDto implements CreateChargeMessage {
  @IsString()
  id: string;

  @IsEmail()
  email: string;
}
