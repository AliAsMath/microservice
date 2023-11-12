import { IsString } from 'class-validator';

export class CreateChargeDto {
  @IsString()
  id: string;
}
