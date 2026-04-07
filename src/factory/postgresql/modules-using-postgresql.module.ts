import { Module } from '@nestjs/common';
import { PostgreSQLRolModule } from '../../modules/roles/infrastructure/modules/postgresql/postgresql.rol.module';
import { PostgresqlCategoryModule } from '../../modules/categories/infrastructure/modules/postgresql/postgresql.category.module';
import { PostgreSQLPermissionModule } from '../../modules/permissions/infrastructure/modules/postgresql/postgresql.permission.module';
import { PostgresqlRolPermissionModule } from '../../modules/rol-permission/infrastructure/modules/postgresql/postgresql.rol-permission.module';
import { PostgresqlUserModule } from '../../modules/users/infrastructure/modules/postgresql/postgresql.user.module';
import { PostgresqlUserEmployeeModule } from '../../modules/employees/infrastructure/modules/postgresql/postgresql.use-employee.module';
import { PostgresqlAuthModule } from '../../modules/authentication/infrastructure/modules/postgresql/postgresql.auth.module';
import { PostgreSQLAuditModule } from '../../modules/audit/infrastructure/modules/postgresql/postgresql.audit.module';

@Module({
  imports: [
    // Import PostgreSQL related modules here
    PostgreSQLRolModule,
    PostgresqlCategoryModule,
    PostgreSQLPermissionModule,
    PostgresqlRolPermissionModule,
    PostgresqlUserModule,
    PostgresqlUserEmployeeModule,
    PostgresqlAuthModule,
    PostgreSQLAuditModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppAuthenticationModulesUsingPostgreSQL {}
