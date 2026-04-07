import { Module } from '@nestjs/common';
import { AppController } from './app/controller/app.controller';
import { AppService } from './app/service/app.service';
import { HomeModule } from './app/module/home.module';
import { AppAuthenticationModulesUsingPostgreSQL } from './factory/postgresql/modules-using-postgresql.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuditInterceptor } from './shared/interceptors/audit.interceptor';

@Module({
  imports: [HomeModule, AppAuthenticationModulesUsingPostgreSQL],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule {}
