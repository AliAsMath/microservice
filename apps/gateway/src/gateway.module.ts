import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from '@app/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './apps/gateway/.env',
      isGlobal: true,
    }),
    LoggerModule,
    GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      useFactory: (configService: ConfigService) => ({
        server: {
          context: ({ req }) => {
            return { authentication: req?.headers?.authentication };
          },
        },
        gateway: {
          supergraphSdl: new IntrospectAndCompose({
            subgraphs: [
              {
                name: 'reservations',
                url: configService.getOrThrow('RESERVATIONS_GRAPHQL_URL'),
              },
              {
                name: 'auth',
                url: configService.getOrThrow('AUTH_GRAPHQL_URL'),
              },
            ],
          }),
          buildService({ url }) {
            return new RemoteGraphQLDataSource({
              url,
              willSendRequest({ request, context }) {
                request.http.headers.set(
                  'authentication',
                  context.authentication,
                );
              },
            });
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class GatewayModule {}
