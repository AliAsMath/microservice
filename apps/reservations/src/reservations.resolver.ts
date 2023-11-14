import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ReservationDocument } from './model/reservation.schema';
import { ReservationsService } from './reservations.service';
import { GraphqlCurrentUser, UsersDocument, Roles } from '@app/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UseGuards } from '@nestjs/common';
import { GraphqlJwtAuthGuard } from '@app/common/guards';

@Resolver(() => ReservationDocument)
export class ReservationsResolver {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Mutation(() => ReservationDocument)
  @UseGuards(GraphqlJwtAuthGuard)
  createReservation(
    @Args('createReservationInput')
    createReservationInput: CreateReservationDto,
    @GraphqlCurrentUser() user: UsersDocument,
  ) {
    return this.reservationsService.create(createReservationInput, user);
  }

  @Roles('Admin')
  @UseGuards(GraphqlJwtAuthGuard)
  @Query(() => [ReservationDocument], { name: 'reservations' })
  findAll() {
    return this.reservationsService.findAll();
  }

  @Query(() => ReservationDocument, { name: 'reservation' })
  findOn(@Args('id', { type: () => String }) id: string) {
    return this.reservationsService.findOne(id);
  }

  @Mutation(() => ReservationDocument)
  removeReservation(@Args('id', { type: () => String }) id: string) {
    return this.reservationsService.remove(id);
  }
}
