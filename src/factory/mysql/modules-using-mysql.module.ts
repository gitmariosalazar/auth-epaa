import { Module } from '@nestjs/common';
import { MySQLRolModule } from '../../modules/roles/infrastructure/modules/mysql/mysql.rol.module';
import { MySQLCategoryModule } from '../../modules/categories/infrastructure/modules/mysql/mysql.category.module';
import { MySQLPermissionModule } from '../../modules/permissions/infrastructure/modules/mysql/mysql.permission.module';
import { MySQLRolPermissionModule } from '../../modules/rol-permission/infrastructure/modules/mysql/mysql.rol-permission.module';
import { MySQLUserModule } from '../../modules/users/infrastructure/modules/mysql/mysql.user.module';
import { MySQLUserEmployeeModule } from '../../modules/employees/infrastructure/modules/mysql/mysql.use-employee.module';
import { MySQLAuthModule } from '../../modules/authentication/infrastructure/modules/mysql/mysql.auth.module';
import { MySQLAuditModule } from '../../modules/audit/infrastructure/modules/mysql/mysql.audit.module';

@Module({
  imports: [
    // Import PostgreSQL related modules here
    MySQLRolModule,
    MySQLCategoryModule,
    MySQLPermissionModule,
    MySQLRolPermissionModule,
    MySQLUserModule,
    MySQLUserEmployeeModule,
    MySQLAuthModule,
    MySQLAuditModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppAuthenticationModulesUsingMySQL {}
