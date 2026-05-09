import { Module } from '@nestjs/common';
import { AppController } from './app/controller/app.controller';
import { AppService } from './app/service/app.service';
import { HomeModule } from './app/module/home.module';
import { AppAuthenticationModulesUsingPostgreSQL } from './factory/postgresql/modules-using-postgresql.module';
import { AppAuthenticationModulesUsingMySQL } from './factory/mysql/modules-using-mysql.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuditInterceptor } from './shared/interceptors/audit.interceptor';
import { DatabasePersistenceModule } from './shared/connections/database/database-persistence.module';
import { environments } from './settings/environments/environments';

const authenticationModules = environments.DATABASE_TYPE === 'mysql'
  ? AppAuthenticationModulesUsingMySQL
  : AppAuthenticationModulesUsingPostgreSQL;

@Module({
  imports: [
    HomeModule, 
    authenticationModules, 
    DatabasePersistenceModule
  ],
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
