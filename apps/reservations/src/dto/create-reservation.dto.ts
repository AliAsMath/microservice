import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateReservationDto {
  @IsDate()
  @Type(() => Date)
  @Field()
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  @Field()
  endDate: Date;

  @IsNotEmpty()
  @IsString()
  @Field()
  placeId: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  invoiceId: string;
}
