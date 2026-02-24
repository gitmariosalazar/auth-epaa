import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { environments } from './settings/environments/environments';
import * as morgan from 'morgan';
import { DatabaseServicePostgreSQL } from './shared/connections/database/postgresql/postgresql.service';

async function bootstrap() {
  const logger: Logger = new Logger('QRCodeMain');

  const app = await NestFactory.create(AppModule);

  app.use(morgan('dev'));

  const postgresqlService: DatabaseServicePostgreSQL =
    new DatabaseServicePostgreSQL();

  const dbService = app.get(DatabaseServicePostgreSQL);
  logger.log(await dbService.connect());

  const kafkaApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: environments.AUTHENTICATION_KAFKA_CLIENT_ID, // this is the pure consumer
          brokers: [environments.KAFKA_BROKER_URL],
        },
        consumer: {
          groupId: environments.AUTHENTICATION_KAFKA_GROUP_ID, // main consumption group
          allowAutoTopicCreation: true,
          // Optional: retry if Kafka goes down
          retry: { retries: 5 },
        },
      },
    },
  );

  await app.listen(environments.NODE_ENV === 'production' ? 3004 : 4004);
  logger.log(
    `🚀🎉 The Security microservice is running on: http://localhost:${environments.NODE_ENV === 'production' ? 3004 : 4004}✅`,
  );

  await kafkaApp.listen();
  logger.log(`Nest application successfully started`);
}

void bootstrap();
