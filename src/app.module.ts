import { Module } from '@nestjs/common';
import { AppController } from './app/controller/app.controller';
import { AppService } from './app/service/app.service';
import { HomeModule } from './app/module/home.module';

@Module({
  imports: [HomeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
