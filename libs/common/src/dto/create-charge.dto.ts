import { IsEmail, IsString } from 'class-validator';

export class CreateChargeDto {
  @IsString()
  id: string;

  @IsEmail()
  email: string;
}
