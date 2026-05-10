import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions } from '@nestjs/microservices';
import { CustomServerKafka } from './shared/kafka/custom-server-kafka';
import { environments } from './settings/environments/environments';
import * as morgan from 'morgan';
import { DatabaseAbstract } from './shared/connections/database/abstract/abstract.database';

async function bootstrap() {
  const logger: Logger = new Logger('SecurityMain');

  const app = await NestFactory.create(AppModule);

  app.use(morgan('dev'));

  const dbService = app.get(DatabaseAbstract);
  logger.log(await dbService.connect());

  const kafkaApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      strategy: new CustomServerKafka(
        {
          client: {
            clientId: environments.AUTHENTICATION_KAFKA_CLIENT_ID,
            brokers: [environments.KAFKA_BROKER_URL],
          },
          consumer: {
            groupId: environments.AUTHENTICATION_KAFKA_GROUP_ID,
            allowAutoTopicCreation: true,
            retry: { retries: 5 },
          },
        },
        environments.KAFKA_TOPIC
      ),
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
